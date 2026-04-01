import { prisma } from "../../../../database/prisma";
import {
  CreateNotificationRepositoryInput,
  NotificationEntity,
  NotificationsRepository
} from "../notifications-repository";

export class PrismaNotificationsRepository implements NotificationsRepository {
  async create(data: CreateNotificationRepositoryInput): Promise<NotificationEntity> {
    const notification = await prisma.notification.create({
      data: {
        message: data.message,
        eventType: data.eventType,
        recipientUserId: data.recipientUserId,
        ...(data.ticketId ? { ticketId: data.ticketId } : {})
      }
    });

    return {
      id: notification.id,
      message: notification.message,
      eventType: notification.eventType,
      recipientUserId: notification.recipientUserId,
      ticketId: notification.ticketId,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    };
  }

  async findManyByRecipientUserId(recipientUserId: string): Promise<NotificationEntity[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientUserId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      eventType: notification.eventType,
      recipientUserId: notification.recipientUserId,
      ticketId: notification.ticketId,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    }));
  }
}
