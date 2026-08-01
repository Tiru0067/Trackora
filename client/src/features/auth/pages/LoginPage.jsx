import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Auth from "@/features/auth/components/Auth";
import AuthForm from "@/features/auth/components/AuthForm";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Auth>
      <AuthForm
        type="login"
        form={form}
        onChange={handleChange}
        onSubmit={login}
      />
    </Auth>
  );
};

export default Login;
