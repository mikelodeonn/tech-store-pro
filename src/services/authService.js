
import { request } from "./api";
import { mapUser } from "../models/user";

export async function loginRequest(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { username, password, expiresInMins: 60 },
  });
  return { token: data.accessToken ?? data.token, user: mapUser(data) };
}

export async function getCurrentUser(token) {
  const data = await request("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return mapUser(data);
}