import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import { buildResetPasswordEmail } from './reset-password-email.template';
import { buildSupportTicketReplyEmail } from './support-ticket-reply-email.template';
import { buildTeamInviteEmail } from './team-invite-email.template';
import type {
  ResetPasswordEmailPayload,
  SubscriptionSignupNoticePayload,
  SupportTicketReplyEmailPayload,
  TeamInviteEmailPayload,
} from './mail.types';
import { buildSubscriptionSignupNoticeEmail } from './subscription-signup-email';

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
    await this.send({ to: payload.to, subject, text, html });
  }

  async sendSupportTicketReplyEmail(
    payload: SupportTicketReplyEmailPayload,
  ): Promise<void> {
    const { subject, text, html } = buildSupportTicketReplyEmail(payload);
    await this.send({ to: payload.to, subject, text, html });
  }

  async sendResetPasswordEmail(
    payload: ResetPasswordEmailPayload,
  ): Promise<void> {
    const { subject, text, html } = buildResetPasswordEmail(payload);
    await this.send({ to: payload.to, subject, text, html });
  }

  async sendSubscriptionSignupNotice(
    payload: SubscriptionSignupNoticePayload,
  ): Promise<void> {
    const { subject, text, html } = buildSubscriptionSignupNoticeEmail(payload);
    await this.send({ to: payload.to, subject, text, html });
  }

  private async send(input: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    if (!this.isConfigured()) {
      if (this.configService.get<string>('nodeEnv') === 'production') {
        throw new Error('SMTP non configuré');
      }

      this.logger.warn(
        `[dev] Email non envoyé (SMTP absent) → ${input.to} - ${input.subject}`,
      );
      this.logger.debug(input.text);
      return;
    }

    const transporter = this.getTransporter();
    const from = this.configService.get<string>(
      'mail.from',
      'DropOne <noreply@dropone.pro>',
    );

    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
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
