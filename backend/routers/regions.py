from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional

from sqlalchemy import func

from ..database import get_db
from ..database_strategies import CommitData
from .. import models
from ..schemas.regions import Region


class ApprovedLocations:
    pass


router = APIRouter(prefix="/locations", tags=["Location"])


@router.get("/", response_model=List[Region])
def get_regions(
    # current_user: int = Depends(oauth2.get_current_user)
    db: Session = Depends(get_db),
):

    return db.query(models.Region).all()
