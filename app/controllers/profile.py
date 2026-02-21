from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_current_user
from app.db.client import get_database
from app.services.user_service import get_profile, update_profile
from app.models.profile import UpdateProfileRequest, ProfileResponse

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse)
async def read_profile(current_user=Depends(get_current_user), db=Depends(get_database)):
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    user = await get_profile(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user.get("_id"))
    return user


@router.put("", response_model=ProfileResponse)
async def update_profile_endpoint(payload: UpdateProfileRequest, current_user=Depends(get_current_user), db=Depends(get_database)):
    patched = payload.model_dump(exclude_none=True)
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    user = await update_profile(db, user_id, patched)
    return user
