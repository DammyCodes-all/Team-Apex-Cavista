"""
Health Profile Pydantic Models for Prevention AI Baseline Setup.

The health_profile tracks the user's baseline collection phase and
configuration for which health signals to monitor.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class EnabledSignals(BaseModel):
    """Health signals the user has enabled for monitoring."""
    steps: bool = True
    sleep: bool = True
    screen_time: bool = True
    location: bool = True
    voice_stress: bool = False


class Goals(BaseModel):
    """User-selected health goals."""
    selected_goals: List[str] = []  # e.g., ["improve_sleep", "reduce_sedentary"]
    custom_goal: Optional[str] = None


class BaselineMetrics(BaseModel):
    """Aggregated baseline metrics (null until 14 days collected)."""
    steps_mean: Optional[float] = None
    sleep_mean: Optional[float] = None
    sedentary_mean: Optional[float] = None
    location_mean: Optional[float] = None
    active_minutes_mean: Optional[float] = None


class HealthProfileCreate(BaseModel):
    """Request schema for creating a health profile (typically auto-created on signup)."""
    user_id: str
    enabled_signals: Optional[EnabledSignals] = None
    goals: Optional[Goals] = None


class HealthProfileResponse(BaseModel):
    """Response schema for health profile queries."""
    user_id: str
    baseline_status: str  # "collecting" | "active"
    baseline_start_date: datetime
    baseline_days_collected: int
    enabled_signals: EnabledSignals
    goals: Goals
    baseline_metrics: BaselineMetrics
    risk_score: float
    demo_mode: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class HealthProfileUpdate(BaseModel):
    """Request schema for updating health profile settings."""
    enabled_signals: Optional[EnabledSignals] = None
    goals: Optional[Goals] = None
