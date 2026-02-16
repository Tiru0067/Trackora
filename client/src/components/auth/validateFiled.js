export const validateFiled = (name, value, mode = "blur", type) => {
  let message;
  const trimmed = value?.trim() || "";
  const length = trimmed?.length || 0;
  const isBlur = mode === "blur";
  const isChange = mode === "change";

  // Full Name validation (only for registration)
  if (name === "fullName") {
    if (!trimmed && isBlur) {
      message = "Please enter your full name";
    } else if (isChange && length > 0 && length < 2) {
      message = "Name must be at least 2 characters";
    }
  }

  // Email validation
  if (name === "email") {
    if (!trimmed && isBlur) {
      message = "Please enter your email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
      length > 0 &&
      isChange
    ) {
      message = "Please enter a valid email address";
    }
  }

  // Password validation
  if (name == "password") {
    if (!trimmed && isBlur) {
      message = "Please enter your password";
    }
    if (type === "register") {
      if (isChange && length > 0 && length < 8) {
        message = "Password must be at least 8 characters";
      } else if (isChange && length > 0 && !/[A-Z]/.test(value)) {
        message = "Password must contain at least one uppercase letter";
      } else if (isChange && length > 0 && !/[a-z]/.test(value)) {
        message = "Password must contain at least one lowercase letter";
      } else if (isChange && length > 0 && !/[0-9]/.test(value)) {
        message = "Password must contain at least one number";
      } else if (isChange && length > 0 && !/[^A-Za-z0-9]/.test(value)) {
        message = "Password must contain at least one special character";
      }
    }
  }

  return { [name]: message };
};
