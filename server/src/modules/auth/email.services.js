import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const baseTemplate = ({
  preheader,
  heading,
  bodyHtml,
  buttonText,
  buttonUrl,
}) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <span style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
      ${preheader}
    </span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background-color:#111827; padding:24px 32px;">
                <span style="color:#ffffff; font-size:20px; font-weight:700; letter-spacing:-0.02em;">Trackora</span>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 32px 8px 32px;">
                <h1 style="margin:0 0 16px 0; font-size:22px; color:#111827; font-weight:700;">${heading}</h1>
                <div style="font-size:15px; line-height:1.6; color:#4b5563;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 32px 36px 32px;">
                <a href="${buttonUrl}" target="_blank"
                  style="display:inline-block; background-color:#4f46e5; color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; padding:12px 28px; border-radius:8px; margin-top:12px;">
                  ${buttonText}
                </a>
                <p style="margin:20px 0 0 0; font-size:12px; color:#9ca3af; word-break:break-all;">
                  Or paste this link into your browser:<br/>
                  <a href="${buttonUrl}" style="color:#6366f1;">${buttonUrl}</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #eef0f3;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                  This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:20px 0 0 0; font-size:12px; color:#9ca3af;">
            &copy; ${new Date().getFullYear()} Trackora. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const sendVerificationEmail = async ({ name, email, token }) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const html = baseTemplate({
    preheader: "Verify your email to activate your Trackora account.",
    heading: `Welcome to Trackora, ${name} 👋`,
    bodyHtml: `<p style="margin:0;">Verify your email address to activate your account and get started.</p>`,
    buttonText: "Verify email",
    buttonUrl: verificationUrl,
  });

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Verify your Trackora email",
    html,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  return data;
};

export const sendPasswordResetEmail = async ({ name, email, token }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const html = baseTemplate({
    preheader: "Reset your Trackora password.",
    heading: "Password reset request",
    bodyHtml: `<p style="margin:0;">Hi ${name}, we received a request to reset your Trackora password. Click below to set a new one.</p>`,
    buttonText: "Reset password",
    buttonUrl: resetUrl,
  });

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Reset your Trackora password",
    html,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  return data;
};
