import { api, prefixProxyEndpoint } from "@/services";
import { get } from "@/utils/request";
import { type HTTPError } from "ky";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import ProjectConfig from "@/project.config.json";
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
    features: any[];
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

const enableMetaAPI = ProjectConfig.enableMetaAPI.value;

const enableMeAPI = ProjectConfig.enableMeAPI.value;
const meAPIRefetchInterval = ProjectConfig.enableMeAPI.refetchInterval;

export const useGetMe = (options?: UseQueryOptions<MeResponse, HTTPError>) => {
  return useQuery<MeResponse, HTTPError>({
    ...options,
    queryKey: [queryKey.me],
    queryFn: async () => {
      return await get<MeResponse>("/v1/me");
    },
    enabled: options?.enabled || enableMeAPI,
    retry: false,
    refetchInterval: meAPIRefetchInterval,
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
  });
};

export default globalApi;
