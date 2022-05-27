import { useQuery, useMutation, useQueryClient } from "react-query";
import { request } from "../axios/axiosClient";

const fetchAssignedEmployees = (inspectionId) => {
  return request({ url: `/assignments/${inspectionId}` });
};

const addAssignedEmployee = (assignment) => {
  return request({ url: "/assignments", method: "post", data: assignment });
};

const deleteAssignedEmployee = (assignment_id) => {
  return request({ url: `/assignments/${assignment_id}`, method: "delete" });
};

export const useFetchAssignedEmployees = (inspectionId, onSuccess, onError) => {
  return useQuery(
    ["assigned_employees", inspectionId],
    () => fetchAssignedEmployees(inspectionId),
    {
      onSuccess,
      onError,
    }
  );
};

export const useAddAssignedEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation(addAssignedEmployee, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("assigned_employees");
    },
  });
};

export const useDeleteAssignedEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteAssignedEmployee, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("assigned_employees");
    },
  });
};
