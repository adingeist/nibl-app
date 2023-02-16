import { ApiError } from '@src/utils/ApiError';
import { appConfig } from '@src/utils/config';
import { logger } from '@src/start/logger';
import { Twilio } from 'twilio';

const twilioConfig = appConfig.get('twilio');

class SmsService {
  private smsClient: Twilio;

  constructor() {
    this.smsClient = new Twilio(
      twilioConfig.accountSID,
      twilioConfig.authToken
    );

    logger.info(`Connected to Twilio`);
  }

  sendMessage = async (phoneNumber: string, message: string) => {
    const result = await this.smsClient.messages.create({
      from: appConfig.get('twilio').sender,
      to: phoneNumber,
      body: message,
    });

    if (result.status === 'failed') {
      throw new ApiError(500, `Failed to send sms message.`);
    }

    return result;
  };
}

export const smsService = new SmsService();
