import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { selectIsDark } from "@/store/slices/themeSlice";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

export default function GoogleAuthButton({ mode = "login" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE}/auth/login-google`,
        {
          idToken: credentialResponse.credential,
          mode,
        },
        {
          withCredentials: true,
        },
      );

      const accessToken = data?.data?.accessToken;

      const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      dispatch(
        setCredentials({
          user: profileResponse?.data?.data?.user ?? null,
          accessToken,
        }),
      );

      toast.success(mode === "register" ? "Google account created successfully." : "Signed in with Google successfully.");
      navigate("/", { replace: true });
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
        onError={() => setError("Google sign-in was cancelled.")}
        size="large"
        width={200}
        text="continue_with"
        shape="rectangular"
        theme={isDark ? "filled_black" : "outline"}
      />
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
