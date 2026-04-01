export type DepartmentEntity = {
  id: string;
  name: string;
  managerUserId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDepartmentRepositoryInput = {
  name: string;
  managerUserId?: string;
  isActive?: boolean;
};

export type UpdateDepartmentRepositoryInput = {
  departmentId: string;
  name: string;
  managerUserId?: string | null;
};

export type ListDepartmentsRepositoryInput = {
  includeInactive?: boolean;
};

export interface DepartmentsRepository {
  findById(departmentId: string): Promise<DepartmentEntity | null>;
  findByName(name: string): Promise<DepartmentEntity | null>;
  findByNameExcludingId(name: string, departmentId: string): Promise<DepartmentEntity | null>;
  create(data: CreateDepartmentRepositoryInput): Promise<DepartmentEntity>;
  list(input?: ListDepartmentsRepositoryInput): Promise<DepartmentEntity[]>;
  update(data: UpdateDepartmentRepositoryInput): Promise<DepartmentEntity>;
  setActive(departmentId: string, isActive: boolean): Promise<DepartmentEntity>;
}
