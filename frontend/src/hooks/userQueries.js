import { useQuery } from "react-query";
import { request } from "../axios/axiosClient";

const fetchCurrentUser = () => {
  return request({ url: "/login/user" });
};

export const UseCurrentUser = (onSuccess, onError) => {
  return useQuery("current_user", fetchCurrentUser, {
    onSuccess,
    onError,
  });
};
