import { useQuery } from "react-query";
import { request } from "../axios/axiosClient";

const fetchConstraints = () => {
  return request({ url: "/constraints" });
};

export const useConstraints = (onSuccess, onError) => {
  return useQuery("constraints", fetchConstraints, {
    onSuccess,
    onError,
  });
};
