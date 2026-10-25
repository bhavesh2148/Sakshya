from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import io
from PIL import Image

from services.rule_solver import (
    STANDARD_APH_RULES,
    DeterministicComplianceEngine,
    Z3RuleConflictFinder,
    ComplianceStatus,
    InstitutionalFacts
)
from services.timeline_engine import TimelineImpossibilityEngine, TimelineEvent
from services.forensics_engine import DocumentForensicsEngine
from services.verification_gateway import IssuingAuthorityGateway
from services.report_generator.brief_builder import OfficerBriefBuilder
from services.report_generator.pdf_compiler import PDFOfficerBriefCompiler
from services.infrastructure_cv import InfrastructureGeoVerifier, BlueprintAnalyzer
from services.audit_trail import SecurityAuditLedger, UserRole

from .sample_data import (
    APP_1_FACTS,
    APP_1_TIMELINE,
    APP_2_FACTS,
    APP_2_TIMELINE
)

app = FastAPI(
    title="Sakshya Regulatory Compliance & Fraud Detection API",
    description="Dual-Engine Decision Support System for AICTE Regulatory Approvals across 9 Core Modules",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Engines & Services
rule_engine = DeterministicComplianceEngine(STANDARD_APH_RULES)
timeline_engine = TimelineImpossibilityEngine()
forensics_engine = DocumentForensicsEngine()
authority_gateway = IssuingAuthorityGateway()
brief_builder = OfficerBriefBuilder()
pdf_compiler = PDFOfficerBriefCompiler()
geo_verifier = InfrastructureGeoVerifier()
blueprint_analyzer = BlueprintAnalyzer()
audit_ledger = SecurityAuditLedger()

# In-memory application registry
APPLICATIONS = {
    APP_1_FACTS.institution_id: {
        "facts": APP_1_FACTS,
        "timeline": APP_1_TIMELINE,
        "status": "READY_FOR_AUDIT",
        "documents": [
            {"id": "DOC-101", "name": "Land_Title_Deed.pdf", "type": "LAND_DEED", "mandatory": True, "uploaded": True},
            {"id": "DOC-102", "name": "Building_Plan_Sanction.pdf", "type": "BUILDING_SANCTION", "mandatory": True, "uploaded": True},
            {"id": "DOC-103", "name": "Fire_Safety_NOC.pdf", "type": "FIRE_NOC", "mandatory": True, "uploaded": True},
            {"id": "DOC-104", "name": "Society_Reg_Certificate.pdf", "type": "SOCIETY_REGISTRATION", "mandatory": True, "uploaded": True},
            {"id": "DOC-105", "name": "Faculty_Roster_Qualifications.pdf", "type": "FACULTY_ROSTER", "mandatory": True, "uploaded": True}
        ]
    },
    APP_2_FACTS.institution_id: {
        "facts": APP_2_FACTS,
        "timeline": APP_2_TIMELINE,
        "status": "READY_FOR_AUDIT",
        "documents": [
            {"id": "DOC-201", "name": "Land_Deed_Khasra_991B.pdf", "type": "LAND_DEED", "mandatory": True, "uploaded": True},
            {"id": "DOC-202", "name": "Building_Approval_Scan.pdf", "type": "BUILDING_SANCTION", "mandatory": True, "uploaded": True},
            {"id": "DOC-203", "name": "Fire_NOC_2021.pdf", "type": "FIRE_NOC", "mandatory": True, "uploaded": True, "is_expired": True},
            {"id": "DOC-204", "name": "Barrier_Free_Facility_Cert.pdf", "type": "BARRIER_FREE_CERT", "mandatory": True, "uploaded": False} # Missing document!
        ]
    }
}

# Request/Response Schemas
class OverrideRequest(BaseModel):
    conflict_id: str
    winning_rule_id: str
    admin_officer_id: str
    justification_note: str

class NoticeRequest(BaseModel):
    application_id: str
    institution_name: str
    officer_id: str
    deficiencies: List[str]
    instructions: str
    deadline_date: str

class GeoVerifyRequest(BaseModel):
    target_latitude: float
    target_longitude: float

# -------------------------------------------------------------
# Module 1: Application Management & Document Upload Checklists
# -------------------------------------------------------------
@app.get("/api/v1/applications")
def list_applications():
    res = []
    for app_id, data in APPLICATIONS.items():
        f = data["facts"]
        docs = data["documents"]
        missing = [d["name"] for d in docs if d["mandatory"] and not d.get("uploaded", False)]
        res.append({
            "institution_id": f.institution_id,
            "institution_name": f.institution_name,
            "program": f.program,
            "location_type": f.location_type,
            "enrolment": f.total_enrolment,
            "land_acres": f.land_area_acres,
            "faculty_count": f.total_faculty,
            "total_documents": len(docs),
            "missing_mandatory_documents": missing
        })
    return res

@app.get("/api/v1/applications/{app_id}")
def get_application_details(app_id: str):
    if app_id not in APPLICATIONS:
        raise HTTPException(status_code=404, detail="Application ID not found")
    data = APPLICATIONS[app_id]
    return {
        "facts": data["facts"].model_dump(),
        "timeline_events": [e.model_dump() for e in data["timeline"]],
        "documents": data["documents"]
    }

# -------------------------------------------------------------
# Module 6: Regulatory Compliance Engine & Z3 Conflict Matrix
# -------------------------------------------------------------
@app.get("/api/v1/rules")
def get_rules():
    return [
        {
            "rule_id": r.rule_id,
            "category": r.category,
            "description": r.description,
            "source": r.source.model_dump(),
            "variable_name": r.variable_name,
            "operator": r.operator,
            "target_value": r.target_value,
            "condition": r.condition
        }
        for r in rule_engine.rules
    ]

@app.get("/api/v1/rules/conflicts")
def get_rule_conflicts():
    conflicts = rule_engine.active_conflicts
    return [c.model_dump() for c in conflicts]

@app.post("/api/v1/rules/override")
def register_override(req: OverrideRequest):
    rule_engine.register_override(
        conflict_id=req.conflict_id,
        winning_rule_id=req.winning_rule_id,
        note=f"{req.justification_note} (Approved by Officer: {req.admin_officer_id})"
    )
    audit_ledger.record_action(
        actor_id=req.admin_officer_id,
        actor_name="AICTE Senior Administrator",
        role=UserRole.AICTE_REGIONAL_DIRECTOR,
        action="RULE_OVERRIDE_RECORDED",
        target_entity=f"CONFLICT:{req.conflict_id}",
        details={"winning_rule": req.winning_rule_id, "note": req.justification_note}
    )
    return {
        "status": "OVERRIDE_RECORDED",
        "conflict_id": req.conflict_id,
        "active_rule": req.winning_rule_id
    }

# -------------------------------------------------------------
# Module 8 & 3: Audit Execution & Explainable Officer Brief
# -------------------------------------------------------------
@app.post("/api/v1/audit/run/{app_id}")
def run_full_audit(app_id: str):
    if app_id not in APPLICATIONS:
        raise HTTPException(status_code=404, detail="Application ID not found")

    app_data = APPLICATIONS[app_id]
    facts = app_data["facts"]
    events = app_data["timeline"]

    # 1. Deterministic Rule Audit
    audit_report = rule_engine.audit_institution(facts)

    # 2. Timeline Impossibility Engine
    timeline_report = timeline_engine.audit_timeline(facts.institution_id, events)

    # 3. Issuing Authority Verification
    authority_records = []
    if app_id == APP_1_FACTS.institution_id:
        authority_records.append(authority_gateway.verify_land_record("KHASRA-402/1", facts.land_area_acres, facts.institution_name))
        authority_records.append(authority_gateway.verify_faculty_degree("DEG-IITB-2014-998", "Dr. Rajesh Kumar", "Ph.D."))
    else:
        authority_records.append(authority_gateway.verify_land_record("KHASRA-991/B", facts.land_area_acres, facts.institution_name))
        authority_records.append(authority_gateway.verify_faculty_degree("DEG-UNKNOWN-99", "Dr. K. Mehta", "Ph.D."))

    # 4. Forensics
    forensic_reports = []
    if app_id == APP_2_FACTS.institution_id:
        from services.forensics_engine.models import DocumentForensicReport, ForensicFinding, ForensicVerdict
        forensic_reports.append(DocumentForensicReport(
            document_id="DOC-DEED-991B",
            file_name="Land_Title_Deed_Khasra_991B.pdf",
            sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            overall_fraud_score=0.92,
            verdict=ForensicVerdict.FRAUDULENT,
            findings=[
                ForensicFinding(
                    finding_id="FIND-1",
                    category="METADATA_ANALYSIS",
                    severity="CRITICAL",
                    risk_score=0.88,
                    title="Design Software Footprint (Canva v2.4.1)",
                    description="PDF stream contains Producer 'Canva' and Creator 'Canva PDF Generator'. Official land deeds are never created in graphic design suites."
                ),
                ForensicFinding(
                    finding_id="FIND-2",
                    category="ERROR_LEVEL_ANALYSIS",
                    severity="CRITICAL",
                    risk_score=0.94,
                    title="Localized Pixel Splicing at Land Area Coordinate [105, 310]",
                    description="ELA variance of 48.6 (mean 4.2) indicates digital splicing where '1.75' was altered to '2.10' acres."
                )
            ],
            metadata_summary={"creator": "Canva", "producer": "Canva PDF Engine", "is_tampered": True}
        ))

    # 5. Build Officer Brief
    brief = brief_builder.build_brief(
        institution_name=facts.institution_name,
        application_id=facts.institution_id,
        audit_report=audit_report,
        timeline_report=timeline_report,
        forensic_reports=forensic_reports,
        authority_records=authority_records
    )

    audit_ledger.record_action(
        actor_id="AICTE-SYSTEM",
        actor_name="Sakshya Automated Audit Service",
        role=UserRole.AICTE_SCRUTINY_OFFICER,
        action="FULL_APPLICATION_AUDIT_EXECUTED",
        target_entity=f"APPLICATION:{app_id}",
        details={"verdict": brief["executive_verdict"], "deficient_count": audit_report.deficient_count}
    )

    return {
        "brief": brief,
        "audit_report": audit_report.model_dump(),
        "timeline_report": timeline_report.model_dump(),
        "authority_records": [r.model_dump() for r in authority_records],
        "forensic_reports": [f.model_dump() for f in forensic_reports]
    }

@app.get("/api/v1/officer-brief/pdf/{app_id}")
def download_officer_brief_pdf(app_id: str):
    """Generates and streams a pixel-perfect, court-admissible PDF audit brief."""
    if app_id not in APPLICATIONS:
        raise HTTPException(status_code=404, detail="Application ID not found")
    
    # Run audit to get fresh brief
    audit_res = run_full_audit(app_id)
    brief = audit_res["brief"]
    pdf_bytes = pdf_compiler.compile_pdf_bytes(brief)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=AICTE_Officer_Brief_{app_id}.pdf"
        }
    )

class CreateAppRequest(BaseModel):
    institution_id: str
    institution_name: str
    program: str = "ENGINEERING_TECHNOLOGY"
    level: str = "UG"
    location_type: str = "URBAN"
    approved_intake: int = 360
    total_enrolment: int = 1440
    land_area_acres: float = 2.6
    built_up_area_sqm: float = 12000.0
    total_faculty: int = 75
    professors: int = 9
    associate_professors: int = 18
    assistant_professors: int = 48
    fire_safety_noc_valid: bool = True
    building_plan_approved: bool = True
    barrier_free_campus: bool = True

@app.post("/api/v1/applications/create")
def create_institutional_application(req: CreateAppRequest):
    """Allows uploading/creating a new institutional application profile."""
    new_facts = InstitutionalFacts(
        institution_id=req.institution_id,
        institution_name=req.institution_name,
        program=req.program,
        level=req.level,
        location_type=req.location_type,
        approved_intake=req.approved_intake,
        total_enrolment=req.total_enrolment,
        land_area_acres=req.land_area_acres,
        built_up_area_sqm=req.built_up_area_sqm,
        instructional_area_sqm=req.built_up_area_sqm * 0.6,
        administrative_area_sqm=req.built_up_area_sqm * 0.2,
        amenities_area_sqm=req.built_up_area_sqm * 0.2,
        computer_centers_count=5,
        smart_classrooms_count=15,
        total_faculty=req.total_faculty,
        professors=req.professors,
        associate_professors=req.associate_professors,
        assistant_professors=req.assistant_professors,
        faculty_with_phd=int(req.total_faculty * 0.4),
        corpus_fund_lakhs=100.0,
        fire_safety_noc_valid=req.fire_safety_noc_valid,
        building_plan_approved=req.building_plan_approved,
        barrier_free_campus=req.barrier_free_campus
    )
    
    # Generate sequential timeline
    new_timeline = [
        TimelineEvent(
            event_id="EVT-NEW-1",
            entity_name="Society Registration",
            category="STATUTORY",
            start_date="2019-01-15",
            document_ref="Society_Reg.pdf",
            metadata={"event_type": "SOCIETY_REGISTRATION"}
        ),
        TimelineEvent(
            event_id="EVT-NEW-2",
            entity_name="Land Title Registration",
            category="LAND_TITLE",
            start_date="2019-08-20",
            document_ref="Land_Deed.pdf",
            metadata={"event_type": "LAND_PURCHASE_DEED"}
        ),
        TimelineEvent(
            event_id="EVT-NEW-3",
            entity_name="Building Plan Approval",
            category="CONSTRUCTION",
            start_date="2020-03-10",
            document_ref="Building_Sanction.pdf",
            metadata={"event_type": "BUILDING_PLAN_APPROVAL"}
        ),
        TimelineEvent(
            event_id="EVT-NEW-4",
            entity_name="Fire Safety NOC",
            category="STATUTORY_NOC",
            start_date="2024-01-05",
            end_date="2027-01-04",
            document_ref="Fire_NOC.pdf",
            metadata={"event_type": "FIRE_SAFETY_NOC"}
        ),
        TimelineEvent(
            event_id="EVT-NEW-5",
            entity_name="Application Submission",
            category="STATUTORY",
            start_date="2024-06-10",
            document_ref="Application.pdf",
            metadata={"event_type": "APPLICATION_SUBMISSION"}
        )
    ]
    
    APPLICATIONS[req.institution_id] = {
        "facts": new_facts,
        "timeline": new_timeline,
        "status": "READY_FOR_AUDIT",
        "documents": [
            {"id": "DOC-NEW-1", "name": "Land_Title_Deed.pdf", "type": "LAND_DEED", "mandatory": True, "uploaded": True},
            {"id": "DOC-NEW-2", "name": "Building_Sanction.pdf", "type": "BUILDING_SANCTION", "mandatory": True, "uploaded": True},
            {"id": "DOC-NEW-3", "name": "Fire_Safety_NOC.pdf", "type": "FIRE_NOC", "mandatory": True, "uploaded": req.fire_safety_noc_valid}
        ]
    }
    
    return {"status": "APPLICATION_CREATED", "institution_id": req.institution_id}


# -------------------------------------------------------------
# Module 4: Document Anomaly & Forensics
# -------------------------------------------------------------
@app.post("/api/v1/forensics/analyze-upload")
async def analyze_uploaded_document(
    file: UploadFile = File(...),
    institution_id: str = Form("INST-CUSTOM"),
    institution_name: str = Form("Applicant College")
):
    content = await file.read()
    report = forensics_engine.analyze_document(
        document_id=f"DOC-{file.filename}",
        file_name=file.filename,
        file_bytes=content,
        institution_id=institution_id,
        institution_name=institution_name
    )
    return report.model_dump()

# -------------------------------------------------------------
# Module 7: Infrastructure Compliance Assistance (Geo & Blueprints)
# -------------------------------------------------------------
@app.post("/api/v1/infrastructure/verify-geo")
async def verify_infrastructure_geo(
    file: UploadFile = File(...),
    target_lat: float = Form(18.5204),
    target_lon: float = Form(73.8567)
):
    content = await file.read()
    try:
        im = Image.open(io.BytesIO(content))
        res = geo_verifier.verify_campus_photo(im, target_lat, target_lon)
        return res.model_dump()
    except Exception as e:
        return {"has_exif": False, "status": "FILE_READ_ERROR", "notes": str(e)}

@app.post("/api/v1/infrastructure/verify-blueprint")
async def verify_infrastructure_blueprint(file: UploadFile = File(...)):
    content = await file.read()
    try:
        im = Image.open(io.BytesIO(content))
        res = blueprint_analyzer.analyze_floor_plan(im)
        return res
    except Exception as e:
        return {"geometry_verified": False, "notes": str(e)}

# -------------------------------------------------------------
# Module 9: Human Review, Audit Trail & Security
# -------------------------------------------------------------
@app.post("/api/v1/deficiency-notice/issue")
def issue_deficiency_notice(req: NoticeRequest):
    notice = audit_ledger.issue_deficiency_notice(
        application_id=req.application_id,
        institution_name=req.institution_name,
        officer_id=req.officer_id,
        deficiencies=req.deficiencies,
        instructions=req.instructions,
        deadline_date=req.deadline_date
    )
    return notice.model_dump()

@app.get("/api/v1/audit/logs/{application_id}")
def get_audit_logs(application_id: str):
    logs = audit_ledger.get_logs_for_application(application_id)
    return [l.model_dump() for l in logs]

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "HEALTHY",
        "system": "Sakshya AICTE Compliance Engine",
        "version": "1.0.0",
        "modules_active": [
            "1. Application Management & Uploads",
            "2. OCR & Intelligent Data Extraction",
            "3. Cross-Document Record Validation",
            "4. Document Anomaly & Forgery Detection",
            "5. Original Issuing-Authority Verification",
            "6. Regulatory Compliance Engine (Z3 SMT)",
            "7. Infrastructure Compliance Assistance (CV)",
            "8. Officer Dashboard & Reporting",
            "9. Human Review, Audit Trail & Security"
        ]
    }
