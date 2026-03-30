import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { PrismaAttachmentsRepository } from "../repositories/prisma/prisma-attachments-repository";
import { ListTicketAttachmentsUseCase } from "../use-cases/list-ticket-attachments-use-case";

export function makeListTicketAttachmentsUseCase() {
  const attachmentsRepository = new PrismaAttachmentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new ListTicketAttachmentsUseCase(
    attachmentsRepository,
    ticketsRepository
  );

  return useCase;
}

