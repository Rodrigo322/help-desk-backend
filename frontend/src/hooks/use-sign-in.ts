import { useMutation } from "@tanstack/react-query";

import { useAuth } from "./use-auth";
import { signIn } from "../services/auth-service";
import { SignInPayload, SignInResponse } from "../types/auth";

export function useSignIn() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: async (payload: SignInPayload): Promise<SignInResponse> => signIn(payload),
    onSuccess: (data) => {
      setSession(data);
    }
  });
}
