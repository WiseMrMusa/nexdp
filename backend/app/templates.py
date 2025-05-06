from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Template
from app.auth import oauth2_scheme, decode_token

router = APIRouter()

@router.post("/templates/")
def create_template(name: str, content: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    owner_id = None
    if token:
      
        try:
            payload = decode_token(token)
            owner_id = payload.get("sub") 
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")

    template = Template(name=name, content=content, owner_id=owner_id)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.get("/templates/")
def read_public_templates(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Template).filter(Template.is_public == True).offset(skip).limit(limit).all()

@router.get("/templates/me")
def read_user_templates(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return db.query(Template).filter(Template.owner_id == user_id).all()

@router.put("/templates/{template_id}")
def update_template(template_id: int, name: str, content: str, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    if template.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this template")

    template.name = name
    template.content = content
    db.commit()
    db.refresh(template)
    return template

@router.delete("/templates/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    db.delete(template)
    db.commit()
    return {"message": "Template deleted successfully"}