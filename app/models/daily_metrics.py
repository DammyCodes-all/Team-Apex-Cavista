"""
Daily Metrics Pydantic Models for Prevention AI Data Ingestion.

Daily passive health data collected from user devices/wearables.
This is the raw data source for baseline learning.
"""
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional


class DailyMetricsCreate(BaseModel):
    """Request schema for submitting daily metrics."""
    user_id: str
    date: date  # Date of the metrics (YYYY-MM-DD)
    steps: int = Field(ge=0, description="Daily step count")
    sleep_duration_minutes: int = Field(ge=0, description="Total sleep in minutes")
    sedentary_minutes: int = Field(ge=0, description="Sedentary time in minutes")
    location_diversity_score: float = Field(ge=0, le=100, description="Location diversity 0-100")
    active_minutes: int = Field(ge=0, description="Active minutes (exercise intensity)")


class DailyMetricsResponse(BaseModel):
    """Response schema for daily metrics queries."""
    user_id: str
    date: date
    steps: int
    sleep_duration_minutes: int
    sedentary_minutes: int
    location_diversity_score: float
    active_minutes: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DailyMetricsUpdate(BaseModel):
    """Request schema for updating a daily metric entry."""
    steps: Optional[int] = None
    sleep_duration_minutes: Optional[int] = None
    sedentary_minutes: Optional[int] = None
    location_diversity_score: Optional[float] = None
    active_minutes: Optional[int] = None
