const nodemailer = require('nodemailer');
const logger = require('./logger');

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  const isConfigured =
    user && pass && !user.includes('your_email') && !pass.includes('your_email_password');

  if (!isConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async options => {
  const transporter = getTransporter();

  // If SMTP is not yet configured with valid real credentials, log clearly for local dev
  if (!transporter) {
    logger.warn(`[DEV EMAIL SIMULATION] To: ${options.email} | Subject: "${options.subject}"`);
    if (options.otp) {
      logger.info(`[DEV EMAIL OTP CODE] OTP for ${options.email}: ${options.otp}`);
    }
    return {
      messageId: `dev-simulated-${Date.now()}`,
      previewOtp: options.otp,
    };
  }

  try {
    const message = {
      from: `${process.env.SMTP_FROM || 'SparrowLMS Support'} <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || 'SparrowLMS Verification Code',
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    logger.info(`Email successfully dispatched: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`SMTP Dispatch Failure: ${error.message}`);
    // If SMTP connection fails in development, fallback to logged code so development continues
    if (process.env.NODE_ENV !== 'production' && options.otp) {
      logger.warn(`[DEV FALLBACK OTP] Code for ${options.email}: ${options.otp}`);
      return {
        messageId: `dev-fallback-${Date.now()}`,
        previewOtp: options.otp,
      };
    }
    throw error;
  }
};

module.exports = sendEmail;
