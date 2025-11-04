import axiosClient from "./axiosClient";

export const loginRequest = (data) => {
  return axiosClient.post("/v1/account/login", data);
};
