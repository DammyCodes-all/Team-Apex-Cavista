import pytest

from app.config import settings
import app.services.gemini_service as gs


def test_ask_gemini_error(monkeypatch):
    """If the underlying Gemini client raises, we convert to RuntimeError."""

    # choose a bogus model name to make sure error path is exercised
    settings.GEMINI_MODEL = "nonexistent-model"

    # simulate client.models.generate_content raising
    class DummyClient:
        def __init__(self, *args, **kwargs):
            pass
        @property
        def models(self):
            class M:
                def generate_content(self_inner, **kwargs):
                    raise Exception("404 model not found")
            return M()

    monkeypatch.setattr(gs.genai, "Client", lambda *args, **kwargs: DummyClient())

    with pytest.raises(RuntimeError) as excinfo:
        gs.ask_gemini("hello")
    assert "Gemini request failed" in str(excinfo.value)


def test_ask_gemini_no_model():
    """Missing GEMINI_MODEL should raise a clear error."""
    settings.GEMINI_MODEL = ""
    with pytest.raises(RuntimeError) as excinfo:
        gs.ask_gemini("hi")
    assert "Gemini model not configured" in str(excinfo.value)


def test_ask_gemini_no_api_key():
    """Missing Gemini API key should raise error before contacting model."""
    settings.GEMINI_MODEL = "gemini-1.0"
    settings.GEMINI_API_KEY = ""
    with pytest.raises(RuntimeError) as excinfo:
        gs.ask_gemini("hi")
    assert "Gemini API key not configured" in str(excinfo.value)
