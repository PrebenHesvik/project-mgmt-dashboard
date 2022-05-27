import axios from "axios";
import { fetchToken } from "../Auth";

export const authAxios = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Authorization: `Bearer ${fetchToken()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const client = axios.create({ baseURL: "http://127.0.0.1:8000" });

export const request = async ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${fetchToken()}`;
  client.defaults.headers.Accept = "application/json";
  const onSuccess = (response) => response;
  const onError = (error) => {
    // do something here
    return error;
  };

  try {
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};
