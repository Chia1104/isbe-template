import type { LoaderRequest } from "@/@types/loader";
import {
  useLoaderData as unsafe_useLoaderData,
  defer as unsafe_defer,
  Await as unsafe_Await,
} from "react-router-dom";

type ExcludeResponse<T> = T extends Response ? never : T;

export const createLoader = <TResult = unknown>(
  loader: (loaderRequest: LoaderRequest) => Promise<TResult> | TResult | null
) => {
  return async (loaderRequest: LoaderRequest) => {
    return await loader(loaderRequest);
  };
};

export const useLoaderData = <TResult = unknown>() =>
  unsafe_useLoaderData() as ExcludeResponse<Awaited<TResult | null>>;

export const defer = <TData extends Record<string, unknown>>(data: TData) =>
  unsafe_defer(data) as Awaited<TData>;

export type AwaitResolveRenderFunction<TData = unknown> = (
  data: Awaited<TData>
) => React.ReactNode;

export interface AwaitProps<TData = unknown> {
  children: React.ReactNode | AwaitResolveRenderFunction<TData>;
  errorElement?: React.ReactNode;
  resolve: Promise<TData> | TData;
}

export const Await = <TData = unknown>(props: AwaitProps<TData>): JSX.Element =>
  unsafe_Await(props);
