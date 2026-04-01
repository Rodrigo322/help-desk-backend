import { PrismaNotificationsRepository } from "../repositories/prisma/prisma-notifications-repository";
import { CreateNotificationUseCase } from "../use-cases/create-notification-use-case";

export function makeCreateNotificationUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();

  return new CreateNotificationUseCase(notificationsRepository);
}
