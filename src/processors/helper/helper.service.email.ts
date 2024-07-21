import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { isDevEnv } from '@/app.environment';
import { createLogger } from '@/utils/logger';
import { EMAIL } from '@/app.config';
import { getMessageFromNormalError } from '@/transformers/error.transformer';

const logger = createLogger({ scope: 'EmailService', time: isDevEnv });

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private clientIsValid: boolean;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL.host,
      port: EMAIL.port,
      secure: false,
      auth: {
        user: EMAIL.account,
        pass: EMAIL.password,
      },
    });
  }

  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false;
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30);
        logger.error(
          `client initialization failed! retry after 30 mins`,
          '|',
          getMessageFromNormalError(error),
        );
      } else {
        this.clientIsValid = true;
        logger.success('client initialized.');
      }
    });
  }

  public sendMail(mailOptions: EmailOptions) {
    if (!this.clientIsValid) {
      logger.warn('send failed! (initialization failed)');
      return false;
    }
    this.transporter.sendMail(
      {
        ...mailOptions,
        from: EMAIL.from,
      },
      (error, info) => {
        if (error) {
          logger.failure(`send failed!`, getMessageFromNormalError(error));
        } else {
          logger.success('send succeeded.', info.messageId, info.response);
        }
      },
    );
  }

  public sendMailAs(prefix: string, mailOptions: EmailOptions) {
    return this.sendMail({
      ...mailOptions,
      subject: `[${prefix}] ${mailOptions.subject}`,
    });
  }
}
