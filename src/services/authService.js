
import { request } from "./api";
import { mapUser } from "../models/user";

//Inicia sesion con el backend y devuelve un objeto con el token y la información del usuario
export async function loginRequest(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { username, password, expiresInMins: 60 },
  });

  //Devuelve un objeto con el token y la información del usuario
  return { token: data.accessToken ?? data.token, user: mapUser(data) };
}

//Obtiene la información del usuario actual a partir del token de autenticación
export async function getCurrentUser(token) {
  const data = await request("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  //Devuelve un objeto con la información del usuario
  return mapUser(data);
}