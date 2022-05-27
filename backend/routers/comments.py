from fastapi import status, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Comment
from ..schemas.comments import CommentBase, CommentResponse
from ..database_strategies import CommitData, DeleteData
from ..oauth2 import get_current_user

router = APIRouter(prefix="/comments", tags=["Comment"])


@router.get("/{inspection_id}", response_model=list[CommentResponse])
def get_comments(
    inspection_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    return db.query(Comment).filter(Comment.inspection_id == inspection_id).all()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CommentResponse)
def create_comment(
    comment: CommentBase,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_comment = Comment(employee_id=current_user, **comment.dict())
    with CommitData(db, new_comment):
        return new_comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_commentr(
    comment_id: str,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Comment).filter(Comment.comment_id == comment_id)
    delete = DeleteData(db, query, comment_id, router.tags[0])
    return delete.run()
