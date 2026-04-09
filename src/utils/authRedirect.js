export const POST_LOGOUT_REDIRECT_KEY = "postLogoutRedirect";

export const markPostLogoutRedirect = (path = "/") => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(POST_LOGOUT_REDIRECT_KEY, path);
};

export const consumePostLogoutRedirect = () => {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(POST_LOGOUT_REDIRECT_KEY);
  if (value) {
    window.sessionStorage.removeItem(POST_LOGOUT_REDIRECT_KEY);
  }
  return value;
};
