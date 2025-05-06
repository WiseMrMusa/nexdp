from fastapi import FastAPI
from app.auth import router as auth_router  # Fix import to use `router`
from app.templates import router as templates_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}

app.include_router(auth_router, prefix="/auth")
app.include_router(templates_router, prefix="/api")