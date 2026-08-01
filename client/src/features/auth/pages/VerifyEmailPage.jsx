import { useEffect, useState, useCallback } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { verifyEmail, resendVerifyEmail } from "../api/auth";
import { useToast } from "@/hooks/useToast";
import Auth from "../components/Auth";

const formatRemaining = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const VerifyEmailPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const unverifiedData = location.state || {};
  const name = user?.name || unverifiedData.name;
  const email = user?.email || unverifiedData.email;
  const emailVerificationTokenExpiresAt = user?.emailVerificationTokenExpiresAt;

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  // Track resend cooldown/lockout, seeded from the user object if present
  const [resendState, setResendState] = useState({
    count: user?.verificationEmailResendCount ?? unverifiedData.count ?? 0,
    blockedUntil: user?.verificationEmailResendBlockedUntil
      ? new Date(user.verificationEmailResendBlockedUntil)
      : unverifiedData.blockedUntil
        ? new Date(unverifiedData.blockedUntil)
        : null,
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


  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const verify = async () => {
      setVerifying(true);
      try {
        const response = await verifyEmail(token);
        if (cancelled) return;
        addToast(
          response.data?.message || "Email verified successfully",
          "success",
        );
        navigate("/dashboard", { replace: true });
      } catch (err) {
        if (cancelled) return;
        const errData = err.response?.data;
        addToast(errData?.message || "Verification failed", "error");
        navigate("/login", { replace: true });
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const resend = useCallback(async () => {
    if (!email || resending || remainingMs > 0) return;

    setResending(true);
    try {
      const response = await resendVerifyEmail(email);
      const {
        verificationEmailResendCount,
        verificationEmailResendBlockedUntil,
      } = response.data || {};

      setResendState({
        count: verificationEmailResendCount ?? resendState.count,
        blockedUntil: verificationEmailResendBlockedUntil
          ? new Date(verificationEmailResendBlockedUntil)
          : null,
      });

      addToast("Verification email sent", "success");
    } catch (err) {
      const errData = err.response?.data;
      addToast(
        errData?.message || "Failed to resend verification email",
        "error",
      );

// Sync the latest blockedUntil/count from the response.
// Keep the countdown in sync after failed requests.
      if (errData?.verificationEmailResendBlockedUntil) {
        setResendState({
          count: errData.verificationEmailResendCount ?? resendState.count,
          blockedUntil: new Date(errData.verificationEmailResendBlockedUntil),
        });
      }
    } finally {
      setResending(false);
    }
  }, [email, resending, remainingMs, resendState.count, addToast]);

  if (!user && !email && !token) {
    return <Navigate to="/login" replace />;
  }

  if (token && verifying) {
    return (
      <Auth>
        <p className="text-sm text-(--ink-soft)">Verifying your email…</p>
      </Auth>
    );
  }

  const isLockedOut = resendState.count >= 3 && remainingMs > 0;

  return (
    <Auth>
      <section
        aria-labelledby="verify-email-title"
        className="flex flex-col gap-6"
      >
        <header className="flex flex-col gap-2">
          <h2
            id="verify-email-title"
            className="text-2xl font-medium text-(--ink)"
          >
            Verify your email
          </h2>

          <p className="text-sm text-(--ink-soft)">
            Hey {name ? <strong>{name}</strong> : "there"}, we've sent a
            verification link to{" "}
            {email ? <strong>{email}</strong> : "your email address"}.
          </p>

          <p className="text-sm text-(--ink-soft)">
            Click the link in the email to activate your account before signing
            in.
          </p>

          {emailVerificationTokenExpiresAt && (
            <p className="text-sm text-(--ink-soft)">
              The link will expire at{" "}
              {new Date(emailVerificationTokenExpiresAt).toLocaleString()}.
            </p>
          )}
        </header>

        <section aria-labelledby="verify-help-title" className="space-y-3">
          <h3 id="verify-help-title" className="sr-only">
            Verification help
          </h3>
          <p className="text-sm text-(--ink-soft)">
            Didn't receive the email? Check your spam or junk folder first.
          </p>
          <div className="flex flex-col items-start gap-1">
            <button
              type="button"
              className="text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              onClick={resend}
              disabled={resending || remainingMs > 0}
            >
              {resending ? "Sending…" : "Resend verification email"}
            </button>

            {remainingMs > 0 && (
              <p className="text-xs text-(--ink-muted)">
                Resend available in {formatRemaining(remainingMs)}
              </p>
            )}
          </div>
        </section>

        <footer>
          <Link to="/login" replace>
            <button type="button" className="text-(--accent)">
              Back to login
            </button>
          </Link>
        </footer>
      </section>
    </Auth>
  );
};

export default VerifyEmailPage;
