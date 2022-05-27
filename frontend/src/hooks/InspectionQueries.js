import { useQuery, useMutation, useQueryClient } from "react-query";
import { request } from "../axios/axiosClient";

const addInspection = (inspection) => {
  return request({ url: "/inspections", method: "post", data: inspection });
};

const deleteInspection = (inspectionId) => {
  return request({ url: `/inspections/${inspectionId}`, method: "delete" });
};

const fetchInspections = () => {
  return request({ url: "/inspections" });
};

const fetchInspection = (inspectionId) => {
  return request({ url: `/inspections/${inspectionId}` });
};

export const useInspectionsData = (onSuccess, onError) => {
  return useQuery("inspections", fetchInspections, {
    onSuccess,
    onError,
  });
};

export const useInspectionData = (inspectionId, onSuccess, onError) => {
  return useQuery(
    ["inspection", inspectionId],
    () => fetchInspection(inspectionId),
    {
      onSuccess,
      onError,
    }
  );
};

export const editInspection = (inspection) => {
  const { inspectionId, ...data } = inspection;
  return request({
    url: `/inspections/${inspectionId}`,
    method: "put",
    data: data,
  });
};

export const useAddInspectionData = () => {
  const queryClient = useQueryClient();
  return useMutation(addInspection, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("inspections");
    },
  });
};

export const useEditInspectionData = () => {
  const queryClient = useQueryClient();
  return useMutation(editInspection, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("inspection");
    },
  });
};

export const useDeleteInspectionData = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteInspection, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("inspections");
    },
  });
};
