import { useContext, useState } from "react";
import { CurrentUserContext } from "../../../../context/UserContext";
import {
  useFetchComments,
  useAddComment,
  useDeleteComment,
} from "../../../../hooks/commentQueries";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "./comments.scss";

export const Comments = ({ inspectionId }) => {
  const { currentEmployeeId } = useContext(CurrentUserContext);
  const { isLoading, data, isError, error } = useFetchComments(inspectionId);
  const [comment, setComment] = useState("");
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: addComment } = useAddComment();

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment({ comment_text: comment, inspection_id: inspectionId });
    setComment("");
  };

  const handleDelete = (commentId) => {
    deleteComment(commentId);
  };

  if (isLoading) {
    return (
      <div className="comments">
        <h4 className="title">COMMENTS</h4>
        <p>Is loading</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="comments">
        <h4 className="title">COMMENTS</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="comments">
        <h4 className="title">KOMMENTARER</h4>
        {data?.data.map((obj) => {
          return (
            <div key={obj["comment_id"]} className="comment">
              <div className="header">
                <p className="employee">{obj["employee"]["name"]}</p>
                {parseInt(currentEmployeeId) ===
                obj["employee"]["employee_id"] ? (
                  <DeleteIcon onClick={() => handleDelete(obj["comment_id"])} />
                ) : null}
              </div>
              <div className="body">
                <p className="comment-text">{obj["comment_text"]}</p>
              </div>
              <div className="footer">
                <p className="comment-date">{obj["date_created"]}</p>
              </div>
            </div>
          );
        })}
        <form action="">
          <TextField
            id="comment"
            label="Kommentar"
            variant="outlined"
            name="comment_text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button color="secondary" variant="contained" onClick={handleSubmit}>
            Legg til kommentar
          </Button>
        </form>
      </div>
    </>
  );
};
