import { ApiResponse } from "../types/api";
import { SignInPayload, SignInResponse } from "../types/auth";
import { api, unwrapApiResponse } from "./api";

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const response = await api.post<ApiResponse<SignInResponse>>("/sessions", payload);
  return unwrapApiResponse(response.data);
}

