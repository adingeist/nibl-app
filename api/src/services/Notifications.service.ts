import { NotificationEnum } from '@src/entities/enums/Notification.enum';
import { ExpoPushToken } from '@src/entities/ExpoPushToken.entity';
import { Nib } from '@src/entities/Nib.entity';
import { Notification } from '@src/entities/Notification.entity';
import { Recipe } from '@src/entities/Recipe.entity';
import { User } from '@src/entities/User.entity';
import { ExpoPushTokenRepository } from '@src/repository/ExpoPushToken.repository';
import { NotificationRepository } from '@src/repository/Notification.repository';
import { UserRepository } from '@src/repository/User.repository';
import { logger } from '@src/start/logger';
import {
  Expo,
  ExpoPushErrorTicket,
  ExpoPushMessage,
  ExpoPushTicket,
} from 'expo-server-sdk';

class ExpoService {
  private expo;

  constructor() {
    this.expo = new Expo({});
  }

  /**
   * Send a push notification to tokens from registered devices.
   * @param pushTokenObjects - PushTokens to send to
   * @param message - Message body of the notification
   * @param data - Extra data to be supplied, such as a deep link
   */
  sendPushNotification = async (
    pushTokenObjects: ExpoPushToken[],
    message: string,
    data?: Record<string, unknown>,
  ) => {
    const messages: ExpoPushMessage[] = [];

    // Create bulk of messages to send to each push token with a registered
    // device
    pushTokenObjects.forEach(async (pushToken) => {
      if (Expo.isExpoPushToken(pushToken.token)) {
        messages.push({
          to: pushToken.token,
          sound: 'default',
          body: message,
          data,
        });
      } else {
        logger.info(
          `Push token ${pushToken} is not a valid Expo token, removing from db`,
        );
        await ExpoPushTokenRepository.deleteByToken(pushToken.token);
      }
    });

    // Create a chunk to send as a lump request to Expo's notification service
    const chunks = this.expo.chunkPushNotifications(messages);

    const sendChunk = async (chunk: ExpoPushMessage[]) => {
      logger.info('Sending Chunk', chunk);
      try {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);
        await this.checkReceipts(tickets);

        logger.info(`Tickets sent: ${JSON.stringify(tickets)}`);

        tickets.forEach(async (ticket) => {
          if (ticket.status === 'error') {
            await this.handleError(ticket);
          }
        });
      } catch (error) {
        logger.error('Error sending chunk', error);
      }
    };

    const sendChunks = () =>
      Promise.all(chunks.map((chunk) => sendChunk(chunk)));

    await sendChunks();
  };

  /**
   * Later, after the Expo push notification service has delivered the
   * notifications to Apple or Google (usually quickly, but allow the the service
   * up to 30 minutes when under load), a "receipt" for each notification is
   * created. The receipts will be available for at least a day; stale receipts
   * are deleted.
   *
   * The ID of each receipt is sent back in the response "ticket" for each
   * notification. In summary, sending a notification produces a ticket, which
   * contains a receipt ID you later use to get the receipt.
   *
   * The receipts may contain error codes to which you must respond. In
   * particular, Apple or Google may block apps that continue to send
   * notifications to devices that have blocked notifications or have uninstalled
   * your app. Expo does not control this policy and sends back the feedback from
   * Apple and Google so you can handle it appropriately.
   */
  private async checkReceipts(tickets: ExpoPushTicket[]) {
    const receiptIds: string[] = [];

    tickets.forEach((ticket) => {
      if (ticket.status === 'ok' && ticket.id) {
        receiptIds.push(ticket.id);
      }

      if (ticket.status === 'error') {
        switch (ticket.details?.error) {
          case 'DeviceNotRegistered':
        }
      }
    });

    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    const sendChunk = async (idChunk: string[]) => {
      logger.info('Sending Chunk', idChunk);
      try {
        const receipts = await this.expo.getPushNotificationReceiptsAsync(
          idChunk,
        );

        for (const receiptId in receipts) {
          const pushReceipt = receipts[receiptId];
          if (pushReceipt.status === 'ok') {
            continue;
          } else if (pushReceipt.status === 'error') {
            this.handleError(pushReceipt);
          }
        }
      } catch (error) {
        logger.error('Error getting receipt chunk', error);
      }
    };

    const sendChunks = () =>
      Promise.all(receiptIdChunks.map((chunk) => sendChunk(chunk)));

    await sendChunks();
  }

  /**
   * Handle push notification errors. See:
   * https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
   */
  private handleError = async (ticket: ExpoPushErrorTicket) => {
    if (ticket.status === 'error') {
      logger.info(
        `Failed to send notification. Ticket:`,
        JSON.stringify(ticket),
      );
    }

    if (!ticket.details) return;

    switch (ticket.details.error) {
      case 'DeviceNotRegistered': {
        type DeviceNotRegistered = { expoPushToken?: string };
        const pushToken = (ticket.details as DeviceNotRegistered).expoPushToken;
        if (!pushToken) return;
        await ExpoPushTokenRepository.deleteByToken(pushToken);
        return;
      }
      case 'InvalidCredentials':
        logger.error(`Push notification credentials are invalid`);
        return;
      case 'MessageRateExceeded':
        // TODO : exponential back off. Retry sending the message
        logger.error(`Too many messages are being sent to a device.`);
        return;
      case 'MessageTooBig':
        logger.error(`Notification message was too big`);
        return;

      default:
        return;
    }
  };

  /**
   * Notifies a user 'username liked your recipe'
   * @param notifyUserId - user ID to notify
   * @param triggeredByUser - user liking the recipe
   * @param recipe - recipe being liked
   */
  async sendRecipeLikedPushNotification(
    notifyUserId: string,
    triggeredByUser: User,
    recipe: Recipe,
  ) {
    const userNotified = await UserRepository.findOne({
      where: { id: notifyUserId },
      relations: { expoPushTokens: true },
    });

    if (userNotified) {
      const notification = NotificationRepository.create({
        type: NotificationEnum.RECIPE_LIKED,
        recipe,
        triggeredByUser,
        userNotified,
      });

      await NotificationRepository.save(notification);

      await NotificationsService.sendPushNotification(
        userNotified.expoPushTokens,
        `${triggeredByUser.username} liked your recipe`,
      );
    }
  }

  /**
   * Sends notifications to each device the user has registered
   * @param notifyUserId
   * @param notification
   * @param message
   * @param data
   */
  private async sendNotificationsToUser(
    notifyUserId: string,
    notification: Notification,
    message: string,
    data?: Record<string, unknown>,
  ) {
    const userNotified = await UserRepository.findOne({
      where: { id: notifyUserId },
      relations: { expoPushTokens: true },
    });

    if (userNotified) {
      notification.userNotified = userNotified;

      await NotificationRepository.save(notification);

      await NotificationsService.sendPushNotification(
        userNotified.expoPushTokens,
        message,
        data,
      );
    }
  }

  /**
   * Notifies a user 'username liked your recipe'
   * @param notifyUserId - user ID to notify
   * @param triggeredByUser - user liking the nib
   * @param nib - nib being liked
   */
  async sendNibLikedPushNotification(
    notifyUserId: string,
    triggeredByUser: User,
    nib: Nib,
  ) {
    const notification = NotificationRepository.create({
      type: NotificationEnum.NIB_LIKED,
      nib,
      triggeredByUser,
    });

    const message = `${triggeredByUser.username} liked your nib`;

    await this.sendNotificationsToUser(notifyUserId, notification, message);
  }

  async sendRecipeNibbedNotification(
    notifyUserId: string,
    triggeredByUser: User,
    nib: Nib,
    recipe: Recipe,
  ) {
    const notification = NotificationRepository.create({
      type: NotificationEnum.NIB_ON_RECIPE,
      nib,
      recipe,
      triggeredByUser,
    });

    const message = `${triggeredByUser.username} liked your nib`;

    await this.sendNotificationsToUser(notifyUserId, notification, message);
  }

  /**
   * Notifies a user 'username started following you'
   * @param notifyUserId - user ID to notify
   * @param triggeredByUser - new user following the one being notified
   */
  async sendNewFollowerNotification(
    notifyUserId: string,
    triggeredByUser: User,
  ) {
    const notification = NotificationRepository.create({
      type: NotificationEnum.NEW_FOLLOWER,
      triggeredByUser,
    });

    const message = `${triggeredByUser.username} started following you`;

    await this.sendNotificationsToUser(notifyUserId, notification, message);
  }
}

export const NotificationsService = new ExpoService();
