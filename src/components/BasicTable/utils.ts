import get from "lodash/get";
import type { HeadCell, Order, Align } from "./types";
import type { TablePaginationProps, TableCellProps } from "@mui/material";
import type { PaginatedMeta } from "@/@types/api";
import type { Dispatch } from "react";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T | null) {
  if (!orderBy) return 0;
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key | null
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis: Array<[T, number]> = array.map((el, index) => [
    el,
    index,
  ]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function getCellAlignFromHeadCellAlign<T>(
  target: keyof T | string,
  headCells: Array<HeadCell<T>>,
  align: Align
) {
  return get(
    headCells.find((headCell) => headCell.id === target),
    "align",
    align
  );
}

interface Options<TResult = unknown, TError = unknown> {
  meta: PaginatedMeta | null;
  page: number | string;
  /**
   * @todo
   */
  perPage?: number | string;
  setPage: Dispatch<number | string> | ((page: number | string) => void);
  setPerPage: Dispatch<number | string> | ((perPage: number | string) => void);
  isLoading?: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<TResult, TError>>;
  defaultPerPage?: number;
}

/**
 * @param meta - PaginatedMeta from API
 * @param page - Current page
 * @param setPage - Set current page
 * @param setPerPage - Set per page
 * @param isLoading - Is loading
 * @param fetchNextPage - Fetch next page
 * @param defaultPerPage - Default per page
 *
 * @returns {TablePaginationProps}
 *
 * @example
 * tablePaginationProps={{
 *    ...extensions.getInfinityListPageProps({
 *       meta,
 *       page,
 *       setPage,
 *       setPerPage,
 *       isLoading: isFetching,
 *       fetchNextPage,
 *    }),
 * }}
 */
const getInfinityListPageProps = <TResult = unknown, TError = unknown>({
  meta,
  page,
  perPage,
  setPage,
  setPerPage,
  isLoading,
  fetchNextPage,
  defaultPerPage = 10,
}: Options<TResult, TError>): Pick<
  TablePaginationProps,
  | "onPageChange"
  | "onRowsPerPageChange"
  | "page"
  | "count"
  | "nextIconButtonProps"
  | "backIconButtonProps"
> => {
  return {
    onPageChange: async (event, newPage) => {
      setPage(newPage);
      if (newPage + 1 > Number(meta?.currentPage) ?? 0) {
        await fetchNextPage({
          pageParam: newPage + 1,
        });
      }
    },
    onRowsPerPageChange: (e) => {
      setPerPage(e.target?.value ?? defaultPerPage);
      setPage(0);
    },
    page: Number(page),
    count: meta?.totalRows ?? 0,
    nextIconButtonProps: {
      disabled: Number(page) + 1 === (meta?.totalPages ?? 0) ?? isLoading,
    },
    backIconButtonProps: {
      disabled: !page ?? isLoading,
    },
  };
};

export const extensions = { getInfinityListPageProps };
