import axiosClient from "../../config/axios";
import { LoginDTO, LoginResponse, RegisterDTO, User } from "./types";

export const loginAPI = async (data: LoginDTO): Promise<LoginResponse> => {
  const response = await axiosClient.post("/users/login", data);
  return response as unknown as LoginResponse;
};

export const registerAPI = async (data: RegisterDTO): Promise<User> => {
  const response = await axiosClient.post("/users/register", data);
  return response as unknown as User;
};

export const getCurrentUserAPI = async (): Promise<User> => {
  const response = await axiosClient.get("/users/me");
  return response as unknown as User;
};
