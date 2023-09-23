import type { LoaderRequest } from "@/@types/loader";
import { useLoaderData as unsafe_useLoaderData } from "react-router-dom";

type ExcludeResponse<T> = T extends Response ? never : T;

export const createLoader = <TResult = unknown>(
  loader: (loaderRequest: LoaderRequest) => Promise<TResult> | TResult | null
) => {
  return async (loaderRequest: LoaderRequest) => {
    return loader(loaderRequest);
  };
};

export const useLoaderData = <TResult = unknown>() =>
  unsafe_useLoaderData() as ExcludeResponse<Awaited<TResult | null>>;
