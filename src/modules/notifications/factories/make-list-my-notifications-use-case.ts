import { PrismaNotificationsRepository } from "../repositories/prisma/prisma-notifications-repository";
import { ListMyNotificationsUseCase } from "../use-cases/list-my-notifications-use-case";

export function makeListMyNotificationsUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();

  return new ListMyNotificationsUseCase(notificationsRepository);
}
