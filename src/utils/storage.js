const TOKEN_KEY = "token";
const LOGIN_USER_KEY = "loginUser";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredLoginUser() {
  const rawLoginUser = localStorage.getItem(LOGIN_USER_KEY);

  if (!rawLoginUser) return null;

  try {
    return JSON.parse(rawLoginUser);
  } catch (error) {
    localStorage.removeItem(LOGIN_USER_KEY);
    return null;
  }
}

export function setStoredLoginUser(loginUser) {
  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(loginUser));
}

export function removeStoredLoginUser() {
  localStorage.removeItem(LOGIN_USER_KEY);
}

export function clearAuthStorage() {
  removeAccessToken();
  removeStoredLoginUser();
}
