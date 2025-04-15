import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    const apiKey = process.env.API_KEY_SENDGRID;
    if (!apiKey) {
      throw new Error('SendGrid API key is not defined');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendMail(
    to: string,
    subject: string,
    message: string,
    data?: Record<string, any>,
  ) {
    const msg = {
      to,
      from: process.env.EMAIL_FROM as string,
      subject,
      html: this.buildTemplate(message, data),
    };

    try {
      await sgMail.send(msg);
      console.log('📨 Correo enviado con éxito a', to);
    } catch (error) {
      console.error('❌ Error al enviar correo:', error.response?.body || error.message);
    }
  }

  private buildTemplate(message: string, data?: Record<string, any>): string {
    const dataHtml = data
      ? Object.entries(data)
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join('')
      : '';

    return `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>${message}</h2>
        ${dataHtml}
        <p style="margin-top: 20px; font-size: 12px; color: #777;">
          Si no reconoces este correo, puedes ignorarlo.
        </p>
      </div>
    `;
  }
}
