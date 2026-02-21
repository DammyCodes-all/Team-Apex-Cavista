import pytest
from app.services.ai_service import compute_baseline_from_series, detect_deviation_from_series


def test_compute_baseline_from_series():
    values = [10, 12, 11, 13, 12]
    mean, std = compute_baseline_from_series(values)
    assert round(mean, 2) == 11.6
    assert std > 0


def test_detect_deviation_from_series():
    baseline = [100, 110, 95, 105, 100]
    recent = [70, 72, 68]
    res = detect_deviation_from_series(baseline, recent)
    assert "z" in res and "pct_change" in res
    assert res["z"] < 0
