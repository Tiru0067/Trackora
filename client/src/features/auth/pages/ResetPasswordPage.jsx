import { useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils/cn";
import { validateField } from "@/features/auth/utils/validateFields";
import { useToast } from "@/hooks/useToast";
import { resetPassword } from "../api/auth";

import FormField from "@/components/ui/FormField";
import Auth from "../components/Auth";

const formFieldStyle = "text-sm mb-1.5";
const iconStyle = "ml-3 shrink-0 text-(--ink-soft)";
const formInputStyle =
  "w-full p-2.5 text-sm bg-transparent focus:outline-none text-(--ink) placeholder:text-(--ink-muted)";

const ResetPasswordPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token"));

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const error = validateField("password", val, "change", "register");
    setPasswordError(error.password || "");
  };

  const handleBlur = (e) => {
    const error = validateField("password", e.target.value, "blur", "register");
    setPasswordError(error.password || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const error = validateField("password", password, "submit", "register");
    if (error.password) {
      setPasswordError(error.password);
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, password);
      addToast(
        response.data?.message || "Password reset successfully!",
        "success",
      );
      navigate("/login", { replace: true });
    } catch (err) {
      const errData = err.response?.data;
      addToast(errData?.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <Auth>
      <section
        aria-labelledby="reset-password-title"
        className="w-full max-w-sm"
      >
        <header className="mb-6">
          <h2
            id="reset-password-title"
            className="text-2xl font-medium text-(--ink-soft) mb-1"
          >
            Create new password
          </h2>
          <p className="text-sm text-(--ink-muted)">
            Please enter your new strong password below
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <FormField
              label="New Password"
              id="password"
              labelClassName={formFieldStyle}
            >
              <div className="input-group">
                <LockKeyhole
                  aria-hidden="true"
                  size={18}
                  className={iconStyle}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  className={formInputStyle}
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="new-password"
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    passwordError ? "password-error" : "password-hint"
                  }
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="mr-3 p-0.5 rounded text-(--ink-muted) hover:text-(--ink-soft) focus-visible:outline-2 focus-visible:outline-(--accent) cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <Eye aria-hidden="true" size={18} />
                  ) : (
                    <EyeOff aria-hidden="true" size={18} />
                  )}
                </button>
              </div>

              <p
                id={passwordError ? "password-error" : "password-hint"}
                role={passwordError ? "alert" : undefined}
                className={cn(
                  "text-xs mt-1 min-h-4",
                  passwordError ? "text-red-500" : "text-(--ink-muted)",
                )}
              >
                {passwordError
                  ? passwordError
                  : "Min. 8 characters with uppercase, number, and symbol."}
              </p>
            </FormField>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "btn w-full mt-2 bg-(--accent) text-white",
              loading
                ? "cursor-progress bg-(--accent)/75"
                : "hover:bg-(--accent)/75 active:bg-(--accent)/75",
            )}
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </section>
    </Auth>
  );
};

export default ResetPasswordPage;
