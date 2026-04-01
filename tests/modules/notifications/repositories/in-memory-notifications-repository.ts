import { randomUUID } from "node:crypto";

import {
  CreateNotificationRepositoryInput,
  NotificationEntity,
  NotificationsRepository
} from "../../../../src/modules/notifications/repositories/notifications-repository";

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: NotificationEntity[] = [];

  async create(data: CreateNotificationRepositoryInput): Promise<NotificationEntity> {
    const now = new Date();
    const notification: NotificationEntity = {
      id: randomUUID(),
      message: data.message,
      eventType: data.eventType,
      recipientUserId: data.recipientUserId,
      ticketId: data.ticketId ?? null,
      readAt: null,
      createdAt: now,
      updatedAt: now
    };

    this.items.push(notification);
    return notification;
  }

  async findManyByRecipientUserId(recipientUserId: string): Promise<NotificationEntity[]> {
    return this.items.filter((item) => item.recipientUserId === recipientUserId);
  }
}
