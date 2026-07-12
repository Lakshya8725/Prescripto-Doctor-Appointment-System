import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST || "smtp.gmail.com",
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
};

export const sendOtpEmail = async (email, otp, name = "User") => {
  const mailer = getTransporter();
  const subject = `${otp} is your Prescripto verification code`;
  const text = `Hi ${name},\n\nYour Prescripto verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code.\n\n— Prescripto Team`;
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
      <h2 style="color:#2563eb;margin:0 0 8px">Prescripto</h2>
      <p>Hi ${name},</p>
      <p>Your email verification code is:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111">${otp}</p>
      <p style="color:#6b7280;font-size:14px">Valid for 10 minutes. Never share this code.</p>
    </div>`;

  if (!mailer) {
    console.log(`[DEV EMAIL OTP] ${email} → ${otp}`);
    return { sent: false, dev: true };
  }

  await mailer.sendMail({
    from: `"Prescripto" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html,
  });

  return { sent: true, dev: false };
};
