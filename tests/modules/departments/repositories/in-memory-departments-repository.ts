import { randomUUID } from "node:crypto";

import {
  CreateDepartmentRepositoryInput,
  DepartmentEntity,
  DepartmentsRepository,
  ListDepartmentsRepositoryInput,
  UpdateDepartmentRepositoryInput
} from "../../../../src/modules/departments/repositories/departments-repository";

export class InMemoryDepartmentsRepository implements DepartmentsRepository {
  public items: DepartmentEntity[] = [];

  async findById(departmentId: string): Promise<DepartmentEntity | null> {
    const department = this.items.find((item) => item.id === departmentId);
    return department ?? null;
  }

  async findByName(name: string): Promise<DepartmentEntity | null> {
    const department = this.items.find((item) => item.name === name);
    return department ?? null;
  }

  async create(data: CreateDepartmentRepositoryInput): Promise<DepartmentEntity> {
    const now = new Date();
    const department: DepartmentEntity = {
      id: randomUUID(),
      name: data.name,
      managerUserId: data.managerUserId ?? null,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };

    this.items.push(department);
    return department;
  }

  async findByNameExcludingId(name: string, departmentId: string): Promise<DepartmentEntity | null> {
    const department = this.items.find((item) => item.name === name && item.id !== departmentId);
    return department ?? null;
  }

  async list(input?: ListDepartmentsRepositoryInput): Promise<DepartmentEntity[]> {
    if (input?.includeInactive) {
      return this.items;
    }

    return this.items.filter((item) => item.isActive);
  }

  async update(data: UpdateDepartmentRepositoryInput): Promise<DepartmentEntity> {
    const departmentIndex = this.items.findIndex((item) => item.id === data.departmentId);

    if (departmentIndex < 0) {
      throw new Error("Department not found.");
    }

    const updatedDepartment: DepartmentEntity = {
      ...this.items[departmentIndex],
      name: data.name,
      managerUserId: data.managerUserId ?? null,
      updatedAt: new Date()
    };

    this.items[departmentIndex] = updatedDepartment;
    return updatedDepartment;
  }

  async setActive(departmentId: string, isActive: boolean): Promise<DepartmentEntity> {
    const departmentIndex = this.items.findIndex((item) => item.id === departmentId);

    if (departmentIndex < 0) {
      throw new Error("Department not found.");
    }

    const updatedDepartment: DepartmentEntity = {
      ...this.items[departmentIndex],
      isActive,
      updatedAt: new Date()
    };

    this.items[departmentIndex] = updatedDepartment;
    return updatedDepartment;
  }
}
