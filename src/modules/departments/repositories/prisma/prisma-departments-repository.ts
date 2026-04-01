import { prisma } from "../../../../database/prisma";
import {
  CreateDepartmentRepositoryInput,
  ListDepartmentsRepositoryInput,
  UpdateDepartmentRepositoryInput,
  DepartmentEntity,
  DepartmentsRepository
} from "../departments-repository";

export class PrismaDepartmentsRepository implements DepartmentsRepository {
  async findById(departmentId: string): Promise<DepartmentEntity | null> {
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      return null;
    }

    return {
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  }

  async findByName(name: string): Promise<DepartmentEntity | null> {
    const department = await prisma.department.findUnique({
      where: { name }
    });

    if (!department) {
      return null;
    }

    return {
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  }

  async findByNameExcludingId(name: string, departmentId: string): Promise<DepartmentEntity | null> {
    const department = await prisma.department.findFirst({
      where: {
        name,
        id: {
          not: departmentId
        }
      }
    });

    if (!department) {
      return null;
    }

    return {
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  }

  async create(data: CreateDepartmentRepositoryInput): Promise<DepartmentEntity> {
    const department = await prisma.department.create({
      data: {
        name: data.name,
        isActive: data.isActive ?? true,
        ...(data.managerUserId ? { managerUserId: data.managerUserId } : {})
      }
    });

    return {
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  }

  async list(input?: ListDepartmentsRepositoryInput): Promise<DepartmentEntity[]> {
    const departments = await prisma.department.findMany({
      where: input?.includeInactive ? undefined : { isActive: true },
      orderBy: {
        createdAt: "asc"
      }
    });

    return departments.map((department) => ({
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    }));
  }

  async update(data: UpdateDepartmentRepositoryInput): Promise<DepartmentEntity> {
    const department = await prisma.department.update({
      where: {
        id: data.departmentId
      },
      data: {
        name: data.name,
        managerUserId: data.managerUserId ?? null
      }
    });

    return {
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  }

  async setActive(departmentId: string, isActive: boolean): Promise<DepartmentEntity> {
    const department = await prisma.department.update({
      where: {
        id: departmentId
      },
      data: {
        isActive
      }
    });

    return {
      id: department.id,
      name: department.name,
      managerUserId: department.managerUserId,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  }
}
