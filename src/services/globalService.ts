import { api, prefixProxyEndpoint } from "@/services";
import { get } from "@/utils/request";
import { type HTTPError } from "ky";
import {
  useQuery,
  type UseQueryOptions,
  useQueries,
  type QueryKey,
  type QueryFunction,
} from "@tanstack/react-query";
import ProjectConfig from "@/project.config.json";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { queryKey } from "@/constants";

export interface MeResponse {
  error?: any;
  data?: {
    client: {
      id: string;
      name: string;
    };
    id: string;
    name: string;
    account: string;
    roles: Record<string, string[]>;
    current: any;
  };
}

export interface MetaResponse {
  error?: any;
  data?: {
    features: any[]
  };
}

export const globalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => prefixProxyEndpoint("/v1/me"),
    }),
    getMeta: builder.query<MetaResponse, void>({
      query: () => prefixProxyEndpoint("/v1/meta"),
    }),
  }),
});

globalApi.enhanceEndpoints({
  addTagTypes: ["Global"],
  endpoints: {
    getMe: {
      providesTags: [{ type: "Global", id: "ME" }],
    },
    getMeta: {
      providesTags: [{ type: "Global", id: "META" }],
    },
  },
});

type UseQueryOptionsForUseQueries<
  TQueryFnData = unknown,
  TError = unknown,
  TData = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "context" | "onError" | "onSuccess" | "onSettled"
>;

const enableMetaAPI = ProjectConfig.enableMetaAPI.value;
const metaAPIRefetchInterval = ProjectConfig.enableMetaAPI.refetchInterval;

const enableMeAPI = ProjectConfig.enableMeAPI.value;
const meAPIRefetchInterval = ProjectConfig.enableMeAPI.refetchInterval;

export const useGetMeAndMeta = (
  options?: [
    UseQueryOptionsForUseQueries<MeResponse, HTTPError> extends {
      queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
      select: (data: any) => infer TData;
    }
      ? UseQueryOptionsForUseQueries<TQueryFnData, unknown, TData, TQueryKey>
      : UseQueryOptionsForUseQueries<MeResponse, HTTPError> extends {
          queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
        }
      ? UseQueryOptionsForUseQueries<
          TQueryFnData,
          unknown,
          TQueryFnData,
          TQueryKey
        >
      : UseQueryOptionsForUseQueries,
    UseQueryOptionsForUseQueries<MetaResponse, HTTPError> extends {
      queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
      select: (data: any) => infer TData;
    }
      ? UseQueryOptionsForUseQueries<TQueryFnData, unknown, TData, TQueryKey>
      : UseQueryOptionsForUseQueries<MetaResponse, HTTPError> extends {
          queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
        }
      ? UseQueryOptionsForUseQueries<
          TQueryFnData,
          unknown,
          TQueryFnData,
          TQueryKey
        >
      : UseQueryOptionsForUseQueries,
  ]
) => {
  const location = useLocation();
  const isAuthPage = useMemo(() => {
    return /\/auth\/.*/.test(location.pathname);
  }, [location.pathname]);
  return useQueries({
    queries: [
      {
        ...options?.[0],
        queryKey: [queryKey.me],
        queryFn: async () => {
          return await get<MeResponse>("/v1/me");
        },
        enabled: options?.[0]?.enabled || enableMeAPI,
        retry: false,
        refetchInterval: meAPIRefetchInterval,
        meta: {
          global: true,
          name: "getMe",
        },
      },
      {
        ...options?.[1],
        queryKey: [queryKey.meta],
        queryFn: async () => {
          return await get<MetaResponse>("/v1/meta");
        },
        enabled: options?.[1]?.enabled || enableMetaAPI,
        retry: false,
        refetchInterval: metaAPIRefetchInterval,
        meta: {
          global: true,
          name: "getMeta",
        },
      },
    ],
  });
};

export const useGetMe = (options?: UseQueryOptions<MeResponse, HTTPError>) => {
  return useQuery<MeResponse, HTTPError>({
    ...options,
    queryKey: [queryKey.me],
    queryFn: async () => {
      return await get<MeResponse>("/v1/me");
    },
    enabled: options?.enabled || enableMeAPI,
    retry: false,
    meta: {
      global: true,
      name: "getMe",
    },
  });
};

export const useGetMeta = (
  options?: UseQueryOptions<MetaResponse, HTTPError>
) => {
  return useQuery<MetaResponse, HTTPError>({
    ...options,
    queryKey: [queryKey.meta],
    queryFn: async () => {
      return await get<MetaResponse>("/v1/meta");
    },
    enabled: options?.enabled || enableMetaAPI,
    retry: false,
    meta: {
      global: true,
      name: "getMeta",
    },
  });
};

export default globalApi;
