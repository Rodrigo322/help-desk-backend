import { useMutation } from "@tanstack/react-query";

import { useAuth } from "./use-auth";
import { api, getApiErrorMessage, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import { SignInPayload, SignInResponse } from "../types/auth";

export function useSignIn() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const response = await api.post<ApiResponse<SignInResponse>>("/sessions", payload);
      return unwrapApiResponse(response.data);
    },
    onSuccess: (data) => {
      setSession(data);
    },
    meta: {
      getErrorMessage: getApiErrorMessage
    }
  });
}

