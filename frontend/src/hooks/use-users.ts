import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createUserSchema, CreateUserFormData } from "../schemas/users/create-user-schema";
import {
  updateUserSchema,
  UpdateUserFormData,
  updateUserStatusSchema,
  UpdateUserStatusFormData
} from "../schemas/users/update-user-schema";
import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import {
  CreateUserResponse,
  GetUserByIdResponse,
  ListUsersResponse,
  UpdateUserResponse,
  UpdateUserStatusResponse
} from "../types/user";

type UseUsersInput = {
  includeInactive?: boolean;
};

export function useUsers(input?: UseUsersInput) {
  return useQuery({
    queryKey: ["users", input?.includeInactive ?? false],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ListUsersResponse>>("/users", {
        params: {
          ...(input?.includeInactive ? { includeInactive: true } : {})
        }
      });

      return unwrapApiResponse(response.data);
    }
  });
}

export function useUserById(userId?: string) {
  return useQuery({
    queryKey: ["users", "detail", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<GetUserByIdResponse>>(`/users/${userId}`);
      return unwrapApiResponse(response.data);
    }
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserFormData): Promise<CreateUserResponse> => {
      const parsedPayload = createUserSchema.parse(payload);
      const response = await api.post<ApiResponse<CreateUserResponse>>("/users", parsedPayload);
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserFormData): Promise<UpdateUserResponse> => {
      const parsedPayload = updateUserSchema.parse(payload);
      const response = await api.patch<ApiResponse<UpdateUserResponse>>(`/users/${userId}`, parsedPayload);
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
    }
  });
}

export function useUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserStatusFormData): Promise<UpdateUserStatusResponse> => {
      const parsedPayload = updateUserStatusSchema.parse(payload);
      const response = await api.patch<ApiResponse<UpdateUserStatusResponse>>(
        `/users/${userId}/status`,
        parsedPayload
      );
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
    }
  });
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { userId: string; isActive: boolean }): Promise<UpdateUserStatusResponse> => {
      const parsedPayload = updateUserStatusSchema.parse({ isActive: payload.isActive });
      const response = await api.patch<ApiResponse<UpdateUserStatusResponse>>(
        `/users/${payload.userId}/status`,
        parsedPayload
      );
      return unwrapApiResponse(response.data);
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", variables.userId] });
    }
  });
}
