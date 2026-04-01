export type Notification = {
  id: string;
  message: string;
  recipientUserId: string;
  ticketId: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListMyNotificationsResponse = {
  notifications: Notification[];
};
