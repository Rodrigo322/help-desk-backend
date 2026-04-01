export const NOTIFICATION_EVENT_TYPE_VALUES = ["CREATED", "ASSIGNED", "UPDATED"] as const;
export type NotificationEventType = (typeof NOTIFICATION_EVENT_TYPE_VALUES)[number];

export type NotificationEntity = {
  id: string;
  message: string;
  eventType: NotificationEventType;
  recipientUserId: string;
  ticketId: string | null;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateNotificationRepositoryInput = {
  message: string;
  eventType: NotificationEventType;
  recipientUserId: string;
  ticketId?: string;
};

export interface NotificationsRepository {
  create(data: CreateNotificationRepositoryInput): Promise<NotificationEntity>;
  findManyByRecipientUserId(recipientUserId: string): Promise<NotificationEntity[]>;
}
