from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Standard error response returned by most endpoints.

    Fields:
    - error_type: a short string identifier for categorizing the error (e.g. "not_found", "validation_error").
    - detail: human readable message describing what went wrong.
    """

    error_type: str
    detail: str
