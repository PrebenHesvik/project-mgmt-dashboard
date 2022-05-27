import { useQuery, useMutation, useQueryClient } from "react-query";
import { request } from "../axios/axiosClient";

const addEmployee = (employee) => {
  return request({ url: "/employees", method: "post", data: employee });
};

const deleteEmployee = (employeeId) => {
  return request({ url: `/employees/${employeeId}`, method: "delete" });
};

const fetchEmployees = () => {
  return request({ url: "/employees" });
};

const fetchEmployee = (employeeId) => {
  return request({ url: `/employees/${employeeId}` });
};

export const useEmployeesData = (onSuccess, onError) => {
  return useQuery("employees", fetchEmployees, {
    onSuccess,
    onError,
  });
};

export const useEmployeeData = (employeeId, onSuccess, onError) => {
  return useQuery(["employee", employeeId], () => fetchEmployee(employeeId), {
    onSuccess,
    onError,
  });
};

export const editEmployee = (employee) => {
  const { employeeId, ...data } = employee;
  return request({
    url: `/employees/${employeeId}`,
    method: "put",
    data: data,
  });
};

export const useAddEmployeeData = () => {
  const queryClient = useQueryClient();
  return useMutation(addEmployee, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("employees");
    },
  });
};

export const useEditEmployeeData = () => {
  const queryClient = useQueryClient();
  return useMutation(editEmployee, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("employee");
    },
  });
};

export const useDeleteEmployeeData = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteEmployee, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("employees");
    },
  });
};
