import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import { buildTeamInviteEmail } from './team-invite-email.template';
import type { TeamInviteEmailPayload } from './mail.types';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    const mail = this.configService.get<{
      enabled?: boolean;
      host?: string;
      user?: string;
      password?: string;
      from?: string;
    }>('mail');

    return Boolean(
      mail?.enabled &&
        mail.host?.trim() &&
        mail.from?.trim() &&
        mail.user?.trim() &&
        mail.password?.trim(),
    );
  }

  async sendTeamInviteEmail(payload: TeamInviteEmailPayload): Promise<void> {
    const { subject, text, html } = buildTeamInviteEmail(payload);

    if (!this.isConfigured()) {
      if (this.configService.get<string>('nodeEnv') === 'production') {
        throw new Error('SMTP non configuré');
      }

      this.logger.warn(
        `[dev] Email d'invitation non envoyé (SMTP absent) → ${payload.to}`,
      );
      this.logger.debug(text);
      return;
    }

    const transporter = this.getTransporter();
    const from = this.configService.get<string>('mail.from', 'DropOne <noreply@dropone.pro>');

    await transporter.sendMail({
      from,
      to: payload.to,
      subject,
      text,
      html,
    });
  }

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    const host = this.configService.get<string>('mail.host', '');
    const port = this.configService.get<number>('mail.port', 587);
    const secure = this.configService.get<boolean>('mail.secure', false);
    const user = this.configService.get<string>('mail.user', '');
    const password = this.configService.get<string>('mail.password', '');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass: password },
    });

    return this.transporter;
  }
}
