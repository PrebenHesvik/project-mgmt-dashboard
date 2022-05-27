from fastapi import status, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.assignments import AssignmentBase, AssignmentResponse
from ..database_strategies import DeleteData, CommitData
from ..oauth2 import get_current_user
from ..models import Assignment

router = APIRouter(prefix="/assignments", tags=["Assignment"])


@router.get('/{inspection_id}', response_model=list[AssignmentResponse])
def get_assignments(
    inspection_id: int,
    db: Session = Depends(get_db), 
    current_user: int = Depends(get_current_user)
):
    return db.query(Assignment).filter(Assignment.inspection_id == inspection_id).all()

@router.post('/', response_model=AssignmentResponse)
def create_assignment(
    assignment: AssignmentBase,
    db: Session = Depends(get_db), 
    current_user: int = Depends(get_current_user)):
    
    new_assignment = Assignment(**assignment.dict())
    with CommitData(db=db, data=new_assignment):
        return new_assignment
    
@router.delete('/{assignment_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    assignment_id: int,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Assignment).filter(Assignment.assignment_id == assignment_id)
    delete = DeleteData(db, query, assignment_id, router.tags[0])
    return delete.run()
    