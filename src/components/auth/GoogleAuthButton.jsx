import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { selectIsDark } from "@/store/slices/themeSlice";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { consumePostLogoutRedirect } from "@/utils/authRedirect";

export default function GoogleAuthButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);
  const [error, setError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Google sign-in is unavailable right now.
      </p>
    );
  }

  const handleSuccess = async (credentialResponse) => {
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login-google", {
        idToken: credentialResponse.credential,
      });
      const authData = response?.data?.data ?? {};
      const accessToken = authData?.accessToken ?? authData?.token?.accessToken ?? null;
      const refreshToken = authData?.refreshToken ?? authData?.token?.refreshToken ?? null;

      dispatch(
        setCredentials({
          user: authData?.user ?? null,
          token: accessToken,
          refreshToken,
        }),
      );

      if (!accessToken) {
        throw new Error("Google login succeeded without access token. Please try again.");
      }

      toast.success("Signed in with Google successfully.");
      navigate(consumePostLogoutRedirect() || "/", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Google sign-in failed. Try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError("Google sign-in is unavailable right now.")}
        size="large"
        width={200}
        text="continue_with"
        locale="en"
        shape="rectangular"
        theme={isDark ? "filled_black" : "outline"}
      />
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
