import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDepartmentSchema,
  CreateDepartmentFormData
} from "../schemas/departments/create-department-schema";
import {
  updateDepartmentSchema,
  UpdateDepartmentFormData,
  updateDepartmentStatusSchema,
  UpdateDepartmentStatusFormData
} from "../schemas/departments/update-department-schema";
import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import {
  CreateDepartmentResponse,
  GetDepartmentByIdResponse,
  ListDepartmentsResponse,
  UpdateDepartmentResponse,
  UpdateDepartmentStatusResponse
} from "../types/department";

type UseDepartmentsInput = {
  includeInactive?: boolean;
};

export function useDepartments(input?: UseDepartmentsInput) {
  return useQuery({
    queryKey: ["departments", input?.includeInactive ?? false],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ListDepartmentsResponse>>("/departments", {
        params: {
          ...(input?.includeInactive ? { includeInactive: true } : {})
        }
      });
      return unwrapApiResponse(response.data);
    }
  });
}

export function useDepartmentById(departmentId?: string) {
  return useQuery({
    queryKey: ["departments", "detail", departmentId],
    enabled: Boolean(departmentId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<GetDepartmentByIdResponse>>(
        `/departments/${departmentId}`
      );
      return unwrapApiResponse(response.data);
    }
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDepartmentFormData): Promise<CreateDepartmentResponse> => {
      const parsedPayload = createDepartmentSchema.parse(payload);
      const response = await api.post<ApiResponse<CreateDepartmentResponse>>(
        "/departments",
        parsedPayload
      );
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    }
  });
}

export function useUpdateDepartment(departmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDepartmentFormData): Promise<UpdateDepartmentResponse> => {
      const parsedPayload = updateDepartmentSchema.parse(payload);
      const response = await api.patch<ApiResponse<UpdateDepartmentResponse>>(
        `/departments/${departmentId}`,
        parsedPayload
      );
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", "detail", departmentId] });
    }
  });
}

export function useUpdateDepartmentStatus(departmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: UpdateDepartmentStatusFormData
    ): Promise<UpdateDepartmentStatusResponse> => {
      const parsedPayload = updateDepartmentStatusSchema.parse(payload);
      const response = await api.patch<ApiResponse<UpdateDepartmentStatusResponse>>(
        `/departments/${departmentId}/status`,
        parsedPayload
      );
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", "detail", departmentId] });
    }
  });
}

export function useChangeDepartmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: { departmentId: string; isActive: boolean }
    ): Promise<UpdateDepartmentStatusResponse> => {
      const parsedPayload = updateDepartmentStatusSchema.parse({ isActive: payload.isActive });
      const response = await api.patch<ApiResponse<UpdateDepartmentStatusResponse>>(
        `/departments/${payload.departmentId}/status`,
        parsedPayload
      );
      return unwrapApiResponse(response.data);
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", "detail", variables.departmentId] });
    }
  });
}
