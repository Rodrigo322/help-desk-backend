import { NotificationsRepository } from "../repositories/notifications-repository";

import { NotificationEventType } from "../repositories/notifications-repository";

export type ListMyNotificationsUseCaseRequest = {
  userId: string;
};

export type ListMyNotificationsUseCaseResponse = {
  notifications: Array<{
    id: string;
    message: string;
    eventType: NotificationEventType;
    recipientUserId: string;
    ticketId: string | null;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class ListMyNotificationsUseCase {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async execute(
    input: ListMyNotificationsUseCaseRequest
  ): Promise<ListMyNotificationsUseCaseResponse> {
    const notifications = await this.notificationsRepository.findManyByRecipientUserId(
      input.userId
    );

    return {
      notifications: notifications.map((notification) => ({
        id: notification.id,
        message: notification.message,
        eventType: notification.eventType,
        recipientUserId: notification.recipientUserId,
        ticketId: notification.ticketId,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
      }))
    };
  }
}
