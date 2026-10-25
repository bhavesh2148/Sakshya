import pytest
from fastapi.testclient import TestClient
from api.gateway import app

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["engines"]["z3_smt_solver"] == "ACTIVE"

def test_get_rules_and_conflicts():
    res = client.get("/api/v1/rules")
    assert res.status_code == 200
    assert len(res.json()) >= 8

    res_conf = client.get("/api/v1/rules/conflicts")
    assert res_conf.status_code == 200
    conflicts = res_conf.json()
    assert len(conflicts) > 0
    assert conflicts[0]["conflict_type"] == "SUBSET_AMBIGUITY"

def test_run_audit_endpoint():
    res = client.post("/api/v1/audit/run/AICTE-2024-UG-001")
    assert res.status_code == 200
    data = res.json()
    assert "brief" in data
    assert "audit_report" in data
    assert "timeline_report" in data
    assert data["timeline_report"]["is_chronologically_valid"] is True

def test_run_fraud_audit_endpoint():
    res = client.post("/api/v1/audit/run/AICTE-2024-FRAUD-002")
    assert res.status_code == 200
    data = res.json()
    assert data["timeline_report"]["is_chronologically_valid"] is False
    assert len(data["timeline_report"]["anomalies"]) >= 2
    assert data["brief"]["executive_verdict"] == "REJECT_WITH_LEGAL_SHOW_CAUSE"
