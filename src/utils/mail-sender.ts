// src/utils/mail-service.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'todo-mailhog',
      port: parseInt(process.env.MAIL_PORT || '1025'),
      secure: false,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify_account?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'メールアドレスの確認',
      text: `アカウントを有効化するには、以下のリンクをクリックしてください：${verificationUrl}`,
      html: `
        <div>
          <h1>メールアドレスの確認</h1>
          <p>アカウントを有効化するには、以下のリンクをクリックしてください：</p>
          <a href="${verificationUrl}">アカウントを有効化する</a>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset_password?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'パスワードリセット',
      text: `パスワードリセットするには、以下のリンクをクリックしてください：${resetUrl}`,
      html: `
        <div>
          <h1>パスワードリセット</h1>
          <p>パスワードリセットするには、以下のリンクをクリックしてください：</p>
          <a href="${resetUrl}">パスワードリセットする</a>
        </div>
      `,
    });
  }
}

export default new MailService();
