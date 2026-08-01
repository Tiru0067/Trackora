import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { UserRound, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils/cn";
import { currencyList } from "@/utils/currencies";
import { validateField } from "@/features/auth/utils/validateFields";

import { useToast } from "@/hooks/useToast";

import ComboBox from "@/components/ui/ComboBox";
import FormField from "@/components/ui/FormField";

import google from "@/assets/social/google.svg";

// ─── Styles ────────────────────────────────────────────────────────────────
const formFieldStyle = "text-sm mb-1.5";
const iconStyle = "ml-3 shrink-0 text-(--ink-soft)";
const formInputStyle =
  "w-full p-2.5 text-sm bg-transparent focus:outline-none text-(--ink) placeholder:text-(--ink-muted)";

const AuthForm = ({ type, form, onChange, onSubmit }) => {
  // ─── Hooks ────────────────────────────────────────────────────────────────
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // ─── Derived ──────────────────────────────────────────────────────────────
  const isLogin = type === "login";
  const title = isLogin ? "Welcome back" : "Create your account";
  const subtitle = isLogin
    ? "Please sign in to your account"
    : "Please enter your details to register";

  const submitLabel =
    loading && isLogin
      ? "Signing in..."
      : loading && !isLogin
        ? "Creating account..."
        : isLogin
          ? "Sign in"
          : "Sign up";

  // ─── IDs ──────────────────────────────────────────────────────────────────
  const titleId = "auth-form-title";
  const subtitleId = "auth-form-subtitle";
  const fullNameErrorId = "fullName-error";
  const emailErrorId = "email-error";
  const passwordErrorId = "password-error";
  const passwordHintId = "password-hint";

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (event) => {
    onChange(event);
    const { name, value } = event.target;
    const error = validateField(name, value, "change", type);
    setErrors((prev) => ({ ...prev, ...error }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value, "blur", type);
    setErrors((prev) => ({ ...prev, ...error }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullNameError = isLogin
      ? {}
      : validateField("name", form.name, "submit", type);

    const emailError = validateField("email", form.email, "submit", type);
    const passwordError = validateField(
      "password",
      form.password,
      "submit",
      type,
    );

    setErrors((prev) => ({
      ...prev,
      ...fullNameError,
      ...emailError,
      ...passwordError,
    }));

    const hasErrors = isLogin
      ? emailError.email || passwordError.password
      : fullNameError.fullName || emailError.email || passwordError.password;

    if (hasErrors) return;

    try {
      setLoading(true);
      const response = await onSubmit(form);

      if (!isLogin || !response.data.emailVerifiedAt) {
        navigate("/verify-email", {
          replace: true,
          state: {
            email: response.data?.email || form.email,
            name: response.data?.name || form.name,
            blockedUntil: response.data?.verificationEmailResendBlockedUntil,
          },
        });
      } else {
        navigate("/dashboard", { replace: true });
      }

      addToast(response.message, "success");
    } catch (err) {
      const {
        code,
        message,
        verificationEmailResendBlockedUntil,
        verificationEmailResendCount,
      } = err.response?.data ?? err;

      switch (code) {
        case "INVALID_CREDENTIALS":
          addToast(message, "warning");
          break;

        case "EMAIL_NOT_VERIFIED":
          navigate("/verify-email", {
            replace: true,
            state: {
              email: form.email,
              blockedUntil: verificationEmailResendBlockedUntil,
              count: verificationEmailResendCount,
            },
          });
          addToast(message, "warning");
          break;

        default:
          addToast(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={subtitleId}
      className="w-full max-w-sm"
    >
      <header className="mb-6">
        <h2
          id={titleId}
          className="text-2xl font-medium text-(--ink-soft) mb-1"
        >
          {title}
        </h2>
        <p id={subtitleId} className="text-sm text-(--ink-muted)">
          {subtitle}
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
          <legend className="sr-only">
            {isLogin ? "Sign in credentials" : "Account details"}
          </legend>

          {!isLogin && (
            <div className="flex items-start gap-3">
              <FormField
                label="Full name"
                id="fullName"
                labelClassName={formFieldStyle}
              >
                <div className="input-group">
                  <UserRound
                    aria-hidden="true"
                    size={18}
                    className={iconStyle}
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className={formInputStyle}
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    required
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? fullNameErrorId : undefined
                    }
                  />
                </div>

                <p
                  id={fullNameErrorId}
                  role="alert"
                  className="text-xs mt-1 text-red-500 min-h-4"
                >
                  {errors.fullName}
                </p>
              </FormField>

              <FormField
                label="Currency"
                id="currency"
                className="min-w-15 max-w-25"
                labelClassName={formFieldStyle}
              >
                <div className="input-group">
                  <ComboBox
                    searchable={true}
                    options={currencyList}
                    value={form.currency}
                    onChange={(option) =>
                      handleChange({
                        target: { name: "currency", value: option },
                      })
                    }
                  />
                </div>
              </FormField>
            </div>
          )}

          <FormField label="Email" id="email" labelClassName={formFieldStyle}>
            <div className="input-group">
              <Mail aria-hidden="true" size={18} className={iconStyle} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={formInputStyle}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? emailErrorId : undefined}
                required
              />
            </div>

            <p
              id={emailErrorId}
              role="alert"
              className="text-xs mt-1 text-red-500 min-h-4"
            >
              {errors.email}
            </p>
          </FormField>

          <FormField
            label="Password"
            id="password"
            labelClassName={formFieldStyle}
          >
            <div className="input-group">
              <LockKeyhole aria-hidden="true" size={18} className={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className={formInputStyle}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password
                    ? passwordErrorId
                    : !isLogin
                      ? passwordHintId
                      : undefined
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

            <div className="flex items-start justify-between">
              <p
                id={errors.password ? passwordErrorId : passwordHintId}
                role={errors.password ? "alert" : undefined}
                className={cn(
                  "text-xs mt-1 min-h-4",
                  errors.password ? "text-red-500" : "text-(--ink-muted)",
                )}
              >
                {errors.password
                  ? errors.password
                  : !isLogin &&
                    "Min. 8 characters with uppercase, number, and symbol."}
              </p>

              {isLogin && (
                <NavLink
                  to="/forgot-password"
                  className="block text-right text-xs text-(--ink) hover:text-(--ink-soft) hover:underline mt-1"
                >
                  Forgot password?
                </NavLink>
              )}
            </div>
          </FormField>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full p-2.5 text-sm font-medium bg-(--accent) active:bg-(--accent)/75 text-white rounded-lg cursor-pointer transition-colors duration-150",
            loading
              ? "cursor-progress bg-(--accent)/75"
              : "hover:bg-(--accent)/75",
          )}
        >
          {submitLabel}
        </button>

        <div aria-hidden="true" className="flex items-center gap-3">
          <hr className="flex-1 border-t border-(--line)" />
          <span className="text-xs text-(--ink)">Or continue with</span>
          <hr className="flex-1 border-t border-(--line)" />
        </div>

        <section aria-label="Social sign in options">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Continue with Google"
              className="min-w-30 flex-1 flex items-center justify-center gap-2 p-2.5 border border-(--line) rounded-lg hover:bg-(--bg-warm) cursor-pointer transition-colors duration-150"
              onClick={() => addToast("Coming soon", "info")}
            >
              <img src={google} alt="" aria-hidden="true" className="w-4 h-4" />
              <span className="text-sm text-(--ink-soft)">Google</span>
            </button>
          </div>
        </section>

        <p className="text-sm text-center text-(--ink)">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <NavLink
            to={isLogin ? "/register" : "/login"}
            className="text-(--accent) hover:text-(--accent-ink) hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </NavLink>
        </p>
      </form>
    </section>
  );
};

export default AuthForm;
