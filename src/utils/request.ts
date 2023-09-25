import { type ErrorResponse } from "@/@types/api";
import { getBaseURL } from "@/utils";
import { FORBIDDEN_ERROR, queryKey } from "@/constants";
import ky, { type Options, type HTTPError, type SearchParamsOption } from "ky";
import store from "@/store";
import { globalActions } from "@/store/global.slice";
import { queryClient } from "@/contexts/ReactQueryProvider";

const request = () => {
  return ky.extend({
    prefixUrl: getBaseURL(),
    timeout: 10000,
    credentials: "include",
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("Content-Type", "application/json");
        },
      ],
      beforeError: [
        async (error) => {
          const { response } = error;
          let res: ErrorResponse | null = null;

          switch (response?.status) {
            case 403: {
              if (response?.body) {
                try {
                  res = (await error.response.clone().json()) as ErrorResponse;
                } catch (err) {
                  res = null;
                }
              }

              if (!res) {
                error.name = FORBIDDEN_ERROR;
                error.message = FORBIDDEN_ERROR;
              }
              break;
            }
            case 401: {
              store.dispatch(globalActions.setAuthorized(false));
              break;
            }
            default: {
              break;
            }
          }
          return error;
        },
      ],
    },
  });
};

export const get = async <
  T = unknown,
  U extends SearchParamsOption = SearchParamsOption,
>(
  url: string,
  data?: U,
  opts?: Options
): Promise<T> => {
  const urlWithoutStartSlash = url.replace(/^\//, "");
  return await request()
    .get(urlWithoutStartSlash, { searchParams: data, ...opts })
    .json();
};

export const post = async <T = unknown, U = unknown>(
  url: string,
  data: U,
  opts?: Options
): Promise<T> => {
  const urlWithoutStartSlash = url.replace(/^\//, "");
  return await request()
    .post(urlWithoutStartSlash, { json: data, ...opts })
    .json();
};

export const put = async <T = unknown, U = unknown>(
  url: string,
  data: U,
  opts?: Options
): Promise<T> => {
  const urlWithoutStartSlash = url.replace(/^\//, "");
  return await request()
    .put(urlWithoutStartSlash, { json: data, ...opts })
    .json();
};

export const del = async <T = unknown>(
  url: string,
  opts?: Options
): Promise<T> => {
  const urlWithoutStartSlash = url.replace(/^\//, "");
  return await request().delete(urlWithoutStartSlash, opts).json();
};

export const patch = async <T = unknown, U = unknown>(
  url: string,
  data: U,
  opts?: Options
): Promise<T> => {
  const urlWithoutStartSlash = url.replace(/^\//, "");
  return await request()
    .patch(urlWithoutStartSlash, { json: data, ...opts })
    .json();
};

export const handleKyError = async (
  error: HTTPError
): Promise<ErrorResponse> => {
  switch (error.name) {
    case "HTTPError": {
      const { response } = error;
      if (response?.body) {
        try {
          return (await error.response.clone().json()) as ErrorResponse;
        } catch (err) {
          return {
            errors: [
              {
                field: "unknown",
                message: "發生未知錯誤",
              },
            ],
          };
        }
      }
      return {
        errors: [
          {
            field: "unknown",
            message: "發生未知錯誤",
          },
        ],
      };
    }
    case "AbortError": {
      return {
        errors: [
          {
            field: "abort",
            message: "你已取消此次請求",
          },
        ],
      };
    }
    case FORBIDDEN_ERROR: {
      return {
        errors: [
          {
            field: "forbidden",
            message: error?.message ?? "你沒有權限執行此操作",
          },
        ],
      };
    }
    default: {
      return {
        errors: [
          {
            field: "unknown",
            message: "發生未知錯誤",
          },
        ],
      };
    }
  }
};

export default request;
