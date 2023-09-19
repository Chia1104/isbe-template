import { type ErrorResponse } from "@/@types/api";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { sha3_512 } from "@/utils";
import { post, del } from "@/utils/request";
import { TOKEN } from "@/constants";
import { type HTTPError } from "ky";
import { queryClient } from "@/contexts/ReactQueryProvider";
import useDispatch from "@/hooks/use-app-dispatch";
import { globalActions } from "@/store/global.slice";
import { queryKey } from "@/constants";

export interface TokenDTO {
  account: string;
  password: string;
}

export interface ResetPasswordSendDTO {
  type?: "resetPassword";
  account: string;
}

export interface ResetPasswordDTO {
  account: string;
  password: string;
  code: string;
}

export interface TokenResponse extends ErrorResponse {
  data: {
    token: string;
  };
}

export const useToken = (
  options?: UseMutationOptions<TokenResponse, HTTPError, TokenDTO>
) => {
  return useMutation<TokenResponse, HTTPError, TokenDTO>({
    ...options,
    mutationFn: async (tokenDTO) => {
      const { account, password } = tokenDTO;
      return await post<TokenResponse, TokenDTO>(`/v1/tokens`, {
        account,
        password: sha3_512(password),
      });
    },
    onSuccess: (data, variables, context) => {
      localStorage.setItem(TOKEN, data.data.token);
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useResetPasswordSend = (
  options?: UseMutationOptions<void, HTTPError, ResetPasswordSendDTO>
) => {
  return useMutation<void, HTTPError, ResetPasswordSendDTO>({
    ...options,
    mutationFn: async (resetPasswordDTO) => {
      const { account } = resetPasswordDTO;
      await post<void, ResetPasswordSendDTO>(
        `/v1/admins:send-account-verification`,
        {
          type: "resetPassword",
          account: account.toLowerCase(),
        }
      );
    },
  });
};

export const useResetPassword = (
  options?: UseMutationOptions<void, HTTPError, ResetPasswordDTO>
) => {
  return useMutation<void, HTTPError, ResetPasswordDTO>({
    ...options,
    mutationFn: async (resetPasswordDTO) => {
      const { account, password, code } = resetPasswordDTO;
      await post<void, ResetPasswordDTO>(`/v1/admins:reset-password`, {
        account: account.toLowerCase(),
        password: sha3_512(password),
        code,
      });
    },
  });
};

export const useLogout = (opts?: UseMutationOptions<void, HTTPError, void>) => {
  const dispatch = useDispatch();
  const logout = () => {
    void queryClient.resetQueries({
      queryKey: [queryKey.me, queryKey.meta],
      exact: true,
    });
    queryClient.clear();
    dispatch(globalActions.resetGlobalState());
  };
  const result = useMutation<void, HTTPError, void>({
    ...opts,
    mutationFn: async () => {
      await del(`/v1/tokens/{token}`);
    },
    onSuccess: (data, variables, context) => {
      logout();
      opts?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...result,
    logout,
  };
};
