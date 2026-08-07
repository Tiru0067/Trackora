import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import { cn } from "@/utils/cn";
import { validateField } from "@/features/auth/utils/validateFields";
import { useToast } from "@/hooks/useToast";
import { forgotPassword } from "../api/auth";

import FormField from "@/components/ui/FormField";
import Auth from "../components/Auth";

const formFieldStyle = "text-sm mb-1.5";
const iconStyle = "ml-3 shrink-0 text-(--ink-soft)";
const formInputStyle =
  "w-full p-2.5 text-sm bg-transparent focus:outline-none text-(--ink) placeholder:text-(--ink-muted)";

const formatRemaining = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const ForgotPasswordPage = () => {
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendState, setResendState] = useState({
    count: 0,
    blockedUntil: null,
  });

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!resendState.blockedUntil) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [resendState.blockedUntil]);

  const remainingMs = resendState.blockedUntil
    ? Math.max(resendState.blockedUntil.getTime() - now, 0)
    : 0;

  const handleChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    const error = validateField("email", val, "change", "login");
    setEmailError(error.email || "");
  };

  const handleBlur = (e) => {
    const error = validateField("email", e.target.value, "blur", "login");
    setEmailError(error.email || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || remainingMs > 0) return;

    const error = validateField("email", email, "submit", "login");
    if (error.email) {
      setEmailError(error.email);
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email);

      const { passwordResetBlockedUntil, passwordResetResendCount } =
        response.data?.data || {};

      setResendState({
        count: passwordResetResendCount ?? resendState.count,
        blockedUntil: passwordResetBlockedUntil
          ? new Date(passwordResetBlockedUntil)
          : null,
      });

      addToast("Password reset email sent!", "success");
    } catch (err) {
      const errData = err.response?.data;

      const blockedUntil = errData?.passwordResetBlockedUntil;
      const count = errData?.passwordResetResendCount;

      if (blockedUntil) {
        setResendState({
          count: count ?? resendState.count,
          blockedUntil: new Date(blockedUntil),
        });
      }

      addToast(errData?.message || "Failed to send reset email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Auth>
      <section
        aria-labelledby="forgot-password-title"
        className="w-full max-w-sm"
      >
        <header className="mb-6">
          <h2
            id="forgot-password-title"
            className="text-2xl font-medium text-(--ink-soft) mb-1"
          >
            Reset your password
          </h2>
          <p className="text-sm text-(--ink-muted)">
            Enter your email and we'll send you a reset link
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <FormField label="Email" id="email" labelClassName={formFieldStyle}>
              <div className="input-group">
                <Mail aria-hidden="true" size={18} className={iconStyle} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className={formInputStyle}
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  spellCheck="false"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  required
                />
              </div>

              <p
                id="email-error"
                role="alert"
                className="text-xs mt-1 text-red-500 min-h-4"
              >
                {emailError}
              </p>
            </FormField>
          </fieldset>

          <div className="flex flex-col items-center gap-2">
            <button
              type="submit"
              disabled={loading || remainingMs > 0}
              className={cn(
                "w-full p-2.5 text-sm font-medium bg-(--accent) active:bg-(--accent)/75 text-white rounded-lg cursor-pointer transition-colors duration-150",
                loading || remainingMs > 0
                  ? "cursor-not-allowed bg-(--accent)/50 text-white/80"
                  : "hover:bg-(--accent)/75",
              )}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            {remainingMs > 0 && (
              <p className="text-xs text-(--ink-muted)">
                Resend available in {formatRemaining(remainingMs)}
              </p>
            )}
          </div>

          <p className="text-sm text-center text-(--ink) mt-2">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-(--accent) hover:text-(--accent-ink) hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </section>
    </Auth>
  );
};

export default ForgotPasswordPage;
