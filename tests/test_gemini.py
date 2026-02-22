import pytest

from app.config import settings
import app.services.gemini_service as gs


def test_ask_gemini_error(monkeypatch):
    """If the underlying Gemini client raises, we convert to RuntimeError."""

    # choose a bogus model name to make sure error path is exercised
    settings.GEMINI_MODEL = "nonexistent-model"

    class DummyModel:
        def generate_content(self, message):
            raise Exception("404 model not found")

    # make the constructor return our dummy model instance
    monkeypatch.setattr(gs.genai, "GenerativeModel", lambda name: DummyModel())

    with pytest.raises(Exception) as excinfo:
        gs.ask_gemini("hello")
    # underlying exception message should surface
    assert "404 model not found" in str(excinfo.value)
