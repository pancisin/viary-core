const accessToken = "access_token";
const refreshToken = "refresh_token";

const setAccessToken = (token, persistent) => {
  const storage = persistent ? window.localStorage : window.sessionStorage;
  storage.setItem(accessToken, token);
};

const getAccessToken = () => {
  return (
    window.localStorage.getItem(accessToken) ||
    window.sessionStorage.getItem(accessToken)
  );
};

const removeAccessToken = () => {
  window.localStorage.removeItem(accessToken) ||
    window.sessionStorage.removeItem(accessToken);
};

const setRefreshToken = token =>
  window.localStorage.setItem(refreshToken, token);
  
const getRefreshToken = () => window.localStorage.getItem(refreshToken);
const removeRefreshToken = () => window.localStorage.removeItem(refreshToken);

export {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken
};
