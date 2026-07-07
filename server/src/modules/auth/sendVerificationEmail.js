import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async ({ name, email, token }) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Verify you Trackora email",
    html: `
      <h1>Welcome to Trackora, ${name}</h1>
      <p>Verify your email address to activate your account.</p>
      <p>
        <a href="${verificationUrl}">Verify email</a>
      </p>
      <p>This link expires in 30 minutes.</p>
    `,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  return data;
};

export default sendVerificationEmail;
