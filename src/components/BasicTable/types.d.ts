import { MouseEvent, type ReactNode } from "react";
import type {
  TableCellProps,
  TableContainerProps,
  TablePaginationProps,
  TableProps,
  TableRowProps,
  TableSortLabelProps,
} from "@mui/material";

export type Order = "asc" | "desc";

export type Align = "inherit" | "left" | "center" | "right" | "justify";

export interface HeadCell<TData> {
  disablePadding?: boolean;
  id: keyof TData;
  label: ReactNode;
  numeric?: boolean;
  align?: Align;
}

export interface BasicTableHeadProps<TData> {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof TData) => void;
  order: Order;
  orderBy: string | number | symbol;
  rowCount: number;
  headCells: Array<HeadCell<TData>>;
  align?: Align;
  tableHeadCellProps?: TableCellProps;
  tableSortLabelProps?: TableSortLabelProps;
  experimental?: {
    enableInnerShadow?: boolean;
  };
}

export interface BasicTableRef<TData = unknown> {
  getSelected: () => null;
}

export interface BasicTableProps<TData> {
  data: Array<TData & { id: string | number }>;
  headCells: Array<HeadCell<TData>>;
  align?: Align;
  tablePaginationProps?: Partial<TablePaginationProps>;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  tableContainerProps?: TableContainerProps;
  tableProps?: TableProps;
  renderRow?: (
    row: TData & { id: string | number },
    key: keyof (TData & { id: string | number })
  ) => ReactNode;
  hiddenRows?: Array<keyof (TData & { id: string | number })>;
  tableRowProps?: TableRowProps;
  fallbackTableRowProps?: TableRowProps;
  tableHeadCellProps?: TableCellProps;
  tableCellProps?: TableCellProps & {
    experimental?: {
      /**
       * @deprecated use useTableCellPropsFromKey in experimental instead
       */
      usePropsFromKey?: (
        key: keyof (TData & { id: string | number })
      ) => Partial<TableCellProps>;
    };
  };
  fallbackTableCellProps?: TableCellProps;
  fallback?: ReactNode;
  stickyPagination?: boolean;
  isLoading?: boolean;
  tableSortLabelProps?: TableSortLabelProps;
  rootFallback?: ReactNode;
  experimental?: {
    enableInnerShadow?: boolean;
    enablePaginationTopShadow?: boolean;
    useTableCellPropsFromKey?: (
      key: keyof (TData & { id: string | number }),
      defaultProps: TableCellProps
    ) => Partial<TableCellProps>;
  };
  disablePagination?: boolean;
  children?: (
    data: Array<TData & { id: string | number }>,
    ctx?: {
      hiddenRows?: Array<keyof (TData & { id: string | number })>;
      tableCellProps?: TableCellProps;
      tableRowProps?: TableRowProps;
    }
  ) => ReactNode;
}

export type State = {
  innerRightShadow: boolean;
  innerLeftShadow: boolean;
};
