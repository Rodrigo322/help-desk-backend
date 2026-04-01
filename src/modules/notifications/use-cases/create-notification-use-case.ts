import { NotificationsRepository } from "../repositories/notifications-repository";

import { NotificationEventType } from "../repositories/notifications-repository";

export type CreateNotificationUseCaseRequest = {
  message: string;
  eventType: NotificationEventType;
  recipientUserId: string;
  ticketId?: string;
};

export type CreateNotificationUseCaseResponse = {
  notification: {
    id: string;
    message: string;
    eventType: NotificationEventType;
    recipientUserId: string;
    ticketId: string | null;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class CreateNotificationUseCase {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async execute(
    input: CreateNotificationUseCaseRequest
  ): Promise<CreateNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.create({
      message: input.message,
      eventType: input.eventType,
      recipientUserId: input.recipientUserId,
      ...(input.ticketId ? { ticketId: input.ticketId } : {})
    });

    return {
      notification: {
        id: notification.id,
        message: notification.message,
        eventType: notification.eventType,
        recipientUserId: notification.recipientUserId,
        ticketId: notification.ticketId,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
      }
    };
  }
}
