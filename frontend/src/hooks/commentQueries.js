import { useQuery, useMutation, useQueryClient } from "react-query";
import { request } from "../axios/axiosClient";

const fetchComments = (inspectionId) => {
  return request({ url: `/comments/${inspectionId}` });
};

const addComment = (comment) => {
  return request({ url: "/comments", method: "post", data: comment });
};

const deleteComment = (commentId) => {
  return request({ url: `/comments/${commentId}`, method: "delete" });
};

export const useFetchComments = (inspectionId, onSuccess, onError) => {
  return useQuery(
    ["comments", inspectionId],
    () => fetchComments(inspectionId),
    {
      onSuccess,
      onError,
    }
  );
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation(addComment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("comments");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteComment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("comments");
    },
  });
};
