import { appConfig } from '@src/utils/config';
import { logger } from '@src/start/logger';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
const smtpConfig = appConfig.get('SMTPTransport');

class EmailService {
  private emailClient: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.emailClient = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
      tls: { ciphers: 'SSLv3' },
    });

    logger.info(`Connected to SMTP server`);
  }

  sendEmail(email: string, html: string, options?: SendMailOptions) {
    const mailOptions: SendMailOptions = {
      from: 'no-reply@niblet.app',
      to: email,
      html,
      ...options,
    };

    return this.emailClient.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
