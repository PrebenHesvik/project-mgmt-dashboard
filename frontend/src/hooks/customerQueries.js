import { useQuery, useMutation, useQueryClient } from "react-query";
import { request } from "../axios/axiosClient";

const addCustomer = (employee) => {
  return request({ url: "/customers", method: "post", data: employee });
};

const deleteCustomer = (customerId) => {
  return request({ url: `/customers/${customerId}`, method: "delete" });
};

const fetchCustomers = () => {
  return request({ url: "/customers" });
};

const fetchCustomer = (customerId) => {
  return request({ url: `/customers/${customerId}` });
};

export const useCustomersData = (onSuccess, onError) => {
  return useQuery("customers", fetchCustomers, {
    onSuccess,
    onError,
  });
};

export const useCustomerData = (customerId, onSuccess, onError) => {
  return useQuery(["customer", customerId], () => fetchCustomer(customerId), {
    onSuccess,
    onError,
  });
};

export const editCustomers = (customer) => {
  const { customerId, ...data } = customer;
  return request({
    url: `/customers/${customerId}`,
    method: "put",
    data: data,
  });
};

export const useAddCustomerData = () => {
  const queryClient = useQueryClient();
  return useMutation(addCustomer, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("customers");
    },
  });
};

export const useEditCustomerData = () => {
  const queryClient = useQueryClient();
  return useMutation(editCustomers, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("customer");
    },
  });
};

export const useDeleteCustomerData = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCustomer, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("customers");
    },
  });
};
