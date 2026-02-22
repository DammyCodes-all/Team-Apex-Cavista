from fastapi import APIRouter, Depends, HTTPException
from app.models.profile import UpdateProfileRequest, ProfileResponse
from app.models.error import ErrorResponse
from app.services.user_service import get_profile, update_profile
from app.deps import get_current_user
from app.db.client import get_database

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse,
            responses={
                401: {"model": ErrorResponse},
                404: {"model": ErrorResponse},
            })
async def read_profile(current_user=Depends(get_current_user), db=Depends(get_database)):
    """Fetch the profile for the authenticated user.

    Errors:
    - 401 Unauthorized: missing/invalid credentials
    - 404 Not Found: profile does not exist

    Example error payloads:
    ```json
    { "error_type": "not_found", "detail": "User not found" }
    ```
    """
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    user = await get_profile(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail={"error_type": "not_found", "detail": "User not found"})
    user["id"] = str(user.get("_id"))
    return user


@router.post("", response_model=ProfileResponse,
             responses={
                 401: {"model": ErrorResponse},
                 500: {"model": ErrorResponse},
             })
async def create_or_update_profile(payload: UpdateProfileRequest, current_user=Depends(get_current_user), db=Depends(get_database)):
    """Create or patch the profile for the authenticated user.

    Payload example is defined in `UpdateProfileRequest` model schema.

    Errors:
    - 401 Unauthorized: invalid session
    - 500 Internal Server Error: database failure

    Example error payload:
    ```json
    { "error_type": "database_error", "detail": "Failed to write profile" }
    ```
    """
    patched = payload.model_dump(exclude_none=True)
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    user = await update_profile(db, user_id, patched)
    return user


@router.put("", response_model=ProfileResponse,
            responses={
                401: {"model": ErrorResponse},
                500: {"model": ErrorResponse},
            })
async def update_profile_endpoint(payload: UpdateProfileRequest, current_user=Depends(get_current_user), db=Depends(get_database)):
    """Update profile fields for the authenticated user.

    Errors are similar to POST/CREATE.
    """
    patched = payload.model_dump(exclude_none=True)
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    user = await update_profile(db, user_id, patched)
    return user
