const getEmailVerificationTemplate = (otp, name = 'Learner') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - SparrowLMS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1329; margin: 0; padding: 32px 16px; color: #0f172a; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .header { background: #0c1527; padding: 28px; text-align: center; border-bottom: 2px solid #2563eb; }
    .logo { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .body { padding: 36px 28px; }
    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
    .subtitle { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
    .otp-wrapper { background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: #64748b; margin-bottom: 6px; }
    .otp-code { font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; }
    .footer-note { font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 28px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Sparrow<span>LMS</span></div>
    </div>
    <div class="body">
      <h1 class="title">Verify Your Email Address</h1>
      <p class="subtitle">Hello ${name}, welcome to SparrowLMS. Please enter the following 6-digit verification code to confirm your email and complete your registration:</p>
      <div class="otp-wrapper">
        <div class="otp-label">One-Time Verification Code</div>
        <div class="otp-code">${otp}</div>
      </div>
      <p class="footer-note">This code is valid for 10 minutes. If you did not initiate this registration request, please disregard this email.</p>
    </div>
    <div class="footer">
      SparrowLMS &bull; Enterprise Learning Management Platform
    </div>
  </div>
</body>
</html>
  `.trim();
};

const getPasswordResetTemplate = (otp, name = 'User') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - SparrowLMS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1329; margin: 0; padding: 32px 16px; color: #0f172a; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .header { background: #0c1527; padding: 28px; text-align: center; border-bottom: 2px solid #2563eb; }
    .logo { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo span { color: #3b82f6; }
    .body { padding: 36px 28px; }
    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
    .subtitle { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
    .otp-wrapper { background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: #64748b; margin-bottom: 6px; }
    .otp-code { font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #dc2626; }
    .footer-note { font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 28px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Sparrow<span>LMS</span></div>
    </div>
    <div class="body">
      <h1 class="title">Reset Account Password</h1>
      <p class="subtitle">Hello ${name}, a request was received to reset your SparrowLMS account password. Use the security code below to confirm this change:</p>
      <div class="otp-wrapper">
        <div class="otp-label">Password Reset Code</div>
        <div class="otp-code">${otp}</div>
      </div>
      <p class="footer-note">This code will expire in 10 minutes. If you did not request a password reset, please secure your account immediately.</p>
    </div>
    <div class="footer">
      SparrowLMS &bull; Enterprise Learning Management Platform
    </div>
  </div>
</body>
</html>
  `.trim();
};

module.exports = {
  getEmailVerificationTemplate,
  getPasswordResetTemplate,
};
