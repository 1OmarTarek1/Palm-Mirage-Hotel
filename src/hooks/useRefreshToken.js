// Intentionally disabled: this project uses a simple localStorage session.
// If the access token expires, the user should log in again.
const useRefreshToken = () => {
  const refresh = async () => {
    throw new Error("Refresh token flow is disabled on the website.");
  };

  return refresh;
};

export default useRefreshToken;
