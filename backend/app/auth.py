from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import BaseModel
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "secreatkey"
ALGORITHM = "HS256"  

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/signin")  

class SignupRequest(BaseModel):
    email: str
    username: str
    full_name: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: str

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the password and create a new user
    hashed_password = pwd_context.hash(request.password)
    new_user = User(
        email=request.email,
        username=request.username,
        full_name=request.full_name,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/signin")
def signin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token
    token = jwt.encode({"sub": user.id}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a reset token (for simplicity, using user ID)
    reset_token = jwt.encode({"sub": user.id}, SECRET_KEY, algorithm=ALGORITHM)

    message = MessageSchema(
        subject="Password Reset",
        recipients=[user.email],
        body=f"Use this token to reset your password: {reset_token}",
    )
    # FastMail(config).send_message(message)  
    return {"message": "Password reset email sent"}

@router.post("/reset-password/confirm")
def reset_password_confirm(request: ResetPasswordConfirm, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = pwd_context.hash(request.new_password)
    db.commit()
    return {"message": "Password reset successfully"}