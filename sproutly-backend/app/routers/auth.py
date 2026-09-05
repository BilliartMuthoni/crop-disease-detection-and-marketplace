from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    generate_otp,
    hash_otp,
    verify_otp,
    create_access_token,
    create_refresh_token,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    VerifyOtpRequest,
    TokenResponse,
    OtpSentResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_user_by_identifier(db: Session, phone_number: Optional[str], email: Optional[str]) -> Optional[User]:
    query = db.query(User)
    if phone_number:
        return query.filter(User.user_phone_number == phone_number).first()
    return query.filter(User.user_email == email).first()


def _issue_and_store_otp(db: Session, user: User) -> None:
    otp = generate_otp()
    user.hashed_otp = hash_otp(otp)
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes)
    db.commit()

    # Mock delivery for development. Replace with a real SMS gateway
    # (e.g. Africa's Talking) before production use.
    identifier = user.user_phone_number or user.user_email
    print(f"[MOCK OTP] sending to {identifier}: {otp}")


@router.post("/register", response_model=OtpSentResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = _get_user_by_identifier(db, payload.phone_number, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number or email already exists",
        )

    user = User(
        user_phone_number=payload.phone_number,
        user_email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    _issue_and_store_otp(db, user)
    return OtpSentResponse(
        message="Account created. An OTP has been sent for verification.",
        expires_in_minutes=settings.otp_expire_minutes,
    )


@router.post("/login", response_model=OtpSentResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = _get_user_by_identifier(db, payload.phone_number, payload.email)
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        # Same error for "no such user" and "wrong password" -- never reveal which one.
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    _issue_and_store_otp(db, user)
    return OtpSentResponse(
        message="OTP sent for verification.",
        expires_in_minutes=settings.otp_expire_minutes,
    )


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp_endpoint(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    user = _get_user_by_identifier(db, payload.phone_number, payload.email)
    if not user or not user.hashed_otp or not user.otp_expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No pending OTP for this account")

    expires_at = user.otp_expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired, please request a new one")

    if not verify_otp(payload.otp, user.hashed_otp):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    # Single-use: clear it immediately so it can never be replayed.
    user.hashed_otp = None
    user.otp_expires_at = None
    user.is_verified = True
    db.commit()

    access_token = create_access_token(subject=str(user.user_id), role=user.role.value)
    refresh_token = create_refresh_token(subject=str(user.user_id))

    return TokenResponse(access_token=access_token, refresh_token=refresh_token, role=user.role)
