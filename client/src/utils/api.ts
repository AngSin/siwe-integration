import axios from "axios";
import { User, VerifySignatureRequestBody } from "./types";

export const backendUrl = `${window.location.protocol}//${window.location.host}`;

export const getNonce = async (): Promise<string> => {
  const res = await axios.get(`${backendUrl}/signature/nonce`, {
    // @ts-ignore-next-line
    credentials: "include",
  });
  return res.data;
};

export const verifySignature = async (
  body: VerifySignatureRequestBody,
): Promise<boolean> => {
  const res = await axios.post(`${backendUrl}/signature`, body, {
    // @ts-ignore-next-line
    credentials: "include",
  });
  return res.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${backendUrl}/users`);
  return res.data;
};

export const getProfile = async (): Promise<User> => {
  const res = await axios.get(`${backendUrl}/users/profile`, {
    // @ts-ignore-next-line
    credentials: "include",
  });
  return res.data;
};

export const checkUserLoggedIn = async () => {
  const res = await axios.get(`${backendUrl}/signature/info`, {
    // @ts-ignore-next-line
    credentials: "include",
  });
  return res.data;
};

export const saveUser = async (body: User): Promise<User> => {
  const res = await axios.post(`${backendUrl}/users`, body, {
    // @ts-ignore-next-line
    credentials: "include",
  });
  return res.data;
};

export const logOut = async () => {
  await axios.post(`${backendUrl}/signature/logout`, {
    // @ts-ignore-next-line
    credentials: "include",
  });
};
