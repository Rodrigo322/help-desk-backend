export type Department = {
  id: string;
  name: string;
  managerUserId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListDepartmentsResponse = {
  departments: Department[];
};

export type CreateDepartmentPayload = {
  name: string;
  managerUserId?: string;
};

export type CreateDepartmentResponse = {
  department: Department;
};

export type GetDepartmentByIdResponse = {
  department: Department;
};

export type UpdateDepartmentPayload = {
  name: string;
  managerUserId?: string;
};

export type UpdateDepartmentResponse = {
  department: Department;
};

export type UpdateDepartmentStatusPayload = {
  isActive: boolean;
};

export type UpdateDepartmentStatusResponse = {
  department: Department;
};
