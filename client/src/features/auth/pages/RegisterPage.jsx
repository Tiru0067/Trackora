import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Auth from "@/features/auth/components/Auth";
import AuthForm from "@/features/auth/components/AuthForm";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    currency: "INR",
    email: "",
    password: "",
  });

  const { register } = useAuth();

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
        type="register"
        form={form}
        onChange={handleChange}
        onSubmit={register}
      />
    </Auth>
  );
};

export default RegisterPage;
