import {
  type ChangeEvent,
  type ForwardedRef,
  forwardRef,
  Fragment,
  type Key,
  type MouseEvent,
  type ReactNode,
  useImperativeHandle,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { cn } from "@/utils";
import { useInfiniteScroll } from "@/hooks";
import type {
  Order,
  Align,
  HeadCell,
  BasicTableRef,
  BasicTableProps,
  BasicTableHeadProps,
} from "./types";
import {
  getComparator,
  stableSort,
  getCellAlignFromHeadCellAlign,
} from "./utils";
import { useTableContext, TableProvider } from "./context";

export function BasicTableHead<TData>(props: BasicTableHeadProps<TData>) {
  const {
    tableHeadCellProps,
    order,
    orderBy,
    onRequestSort,
    headCells,
    tableSortLabelProps,
    align = "left",
    experimental,
  } = props;
  const createSortHandler =
    (property: keyof TData) => (event: MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const { dispatch } = useTableContext();

  const { ref: leftItem } = useInfiniteScroll({
    onLoadMore: () =>
      dispatch((prevState) => ({ ...prevState, innerLeftShadow: false })),
    onLeave: () =>
      dispatch((prevState) => ({ ...prevState, innerLeftShadow: true })),
    hasMore: experimental?.enableInnerShadow,
  });

  const { ref: rightItem } = useInfiniteScroll({
    onLoadMore: () =>
      dispatch((prevState) => ({ ...prevState, innerRightShadow: false })),
    onLeave: () =>
      dispatch((prevState) => ({ ...prevState, innerRightShadow: true })),
    hasMore: experimental?.enableInnerShadow,
  });

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, i) => (
          <Fragment key={headCell.id as Key}>
            {i === 0 ? (
              <TableCell
                sortDirection={orderBy === headCell.id ? order : false}
                {...tableHeadCellProps}
                align={headCell.align ?? align}
                ref={leftItem as any}
                padding={headCell.disablePadding ? "none" : "normal"}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                  {...tableSortLabelProps}>
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ) : i === headCells.length - 1 ? (
              <TableCell
                sortDirection={orderBy === headCell.id ? order : false}
                {...tableHeadCellProps}
                ref={rightItem as any}
                align={headCell.align ?? align}
                padding={headCell.disablePadding ? "none" : "normal"}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                  {...tableSortLabelProps}>
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ) : (
              <TableCell
                sortDirection={orderBy === headCell.id ? order : false}
                {...tableHeadCellProps}
                align={headCell.align ?? align}
                padding={headCell.disablePadding ? "none" : "normal"}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                  {...tableSortLabelProps}>
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            )}
          </Fragment>
        ))}
      </TableRow>
    </TableHead>
  );
}

function BasicTableWithGeneric<TData>(
  {
    data,
    headCells,
    align = "left",
    tablePaginationProps,
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage,
    tableContainerProps,
    tableProps,
    renderRow,
    hiddenRows = ["id"],
    tableRowProps,
    tableHeadCellProps,
    tableCellProps,
    fallback,
    stickyPagination,
    isLoading,
    tableSortLabelProps,
    rootFallback,
    experimental,
    fallbackTableRowProps,
    fallbackTableCellProps,
    disablePagination = false,
    children,
  }: BasicTableProps<TData>,
  ref: ForwardedRef<BasicTableRef<TData>>
) {
  useImperativeHandle(ref, () => ({
    getSelected: () => null,
  }));

  const [shouldShowShadow, setShouldShowShadow] = useState(
    experimental?.enablePaginationTopShadow
  );
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof TData | null>(null);
  const [page, setPage] = useState(tablePaginationProps?.page ?? 0);
  const [rowsPerPage, setRowsPerPage] = useState(
    defaultRowsPerPage ?? rowsPerPageOptions[0]
  );

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof TData | null
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    tablePaginationProps?.onPageChange?.(event, newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    tablePaginationProps?.onRowsPerPageChange?.(event);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort<TData & { id: number | string }>(
        data,
        getComparator<any>(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  const { ref: lastItem } = useInfiniteScroll({
    onLoadMore: () => setShouldShowShadow(false),
    onLeave: () => setShouldShowShadow(true),
    hasMore: experimental?.enablePaginationTopShadow,
  });

  const { state } = useTableContext();

  const usePropsFromKey = useCallback(
    (key: keyof TData, defaultProps: TableCellProps) => {
      return experimental?.useTableCellPropsFromKey?.(key, defaultProps);
    },
    [experimental?.useTableCellPropsFromKey]
  );

  const renderRowCB = useCallback(
    (
      row: TData & { id: number | string },
      key: keyof (TData & {
        id: string | number;
      })
    ) => {
      return renderRow?.(row, key);
    },
    [renderRow]
  );

  return (
    <>
      {rootFallback && !visibleRows.length && !isLoading ? (
        rootFallback
      ) : (
        <>
          <Box
            className={cn(
              state.innerLeftShadow && "shadow-inner-left-xl",
              state.innerRightShadow && "shadow-inner-right-xl"
            )}
            sx={{
              width: "100%",
              overflow: "hidden",
            }}>
            <TableContainer {...tableContainerProps}>
              {isLoading && <LinearProgress />}
              <Table aria-labelledby="tableTitle" {...tableProps}>
                <BasicTableHead<TData>
                  experimental={{
                    enableInnerShadow: experimental?.enableInnerShadow,
                  }}
                  order={order}
                  orderBy={orderBy ?? "asc"}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                  headCells={headCells}
                  align={align}
                  tableHeadCellProps={tableHeadCellProps}
                  tableSortLabelProps={tableSortLabelProps}
                />
                {children ? (
                  children(visibleRows, {
                    hiddenRows,
                    tableCellProps,
                    tableRowProps,
                  })
                ) : (
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      return (
                        <Fragment key={row.id?.toString()}>
                          {index === visibleRows.length - 1 ? (
                            <TableRow
                              ref={lastItem as any}
                              tabIndex={-1}
                              {...tableRowProps}>
                              {row &&
                                Object.keys(row).map((key) => {
                                  if (!hiddenRows.includes(key as any)) {
                                    return (
                                      <TableCell
                                        {...tableCellProps}
                                        {...usePropsFromKey?.(
                                          key as keyof TData,
                                          tableCellProps ?? {}
                                        )}
                                        className={cn(
                                          tableCellProps?.className,
                                          usePropsFromKey?.(
                                            key as keyof TData,
                                            tableCellProps ?? {}
                                          )?.className
                                        )}
                                        key={key}
                                        align={getCellAlignFromHeadCellAlign<TData>(
                                          key,
                                          headCells,
                                          align
                                        )}>
                                        {renderRowCB?.(
                                          row,
                                          key as keyof (TData & {
                                            id: string | number;
                                          })
                                        ) ??
                                          (row[
                                            key as keyof (TData & {
                                              id: string | number;
                                            })
                                          ] as ReactNode)}
                                      </TableCell>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                            </TableRow>
                          ) : (
                            <TableRow tabIndex={-1} {...tableRowProps}>
                              {row &&
                                Object.keys(row).map((key) => {
                                  if (!hiddenRows.includes(key as any)) {
                                    return (
                                      <TableCell
                                        {...tableCellProps}
                                        {...usePropsFromKey?.(
                                          key as keyof TData,
                                          tableCellProps ?? {}
                                        )}
                                        className={cn(
                                          tableCellProps?.className,
                                          usePropsFromKey?.(
                                            key as keyof TData,
                                            tableCellProps ?? {}
                                          )?.className
                                        )}
                                        key={key}
                                        align={getCellAlignFromHeadCellAlign<TData>(
                                          key,
                                          headCells,
                                          align
                                        )}>
                                        {renderRowCB?.(
                                          row,
                                          key as keyof (TData & {
                                            id: string | number;
                                          })
                                        ) ??
                                          (row[
                                            key as keyof (TData & {
                                              id: string | number;
                                            })
                                          ] as ReactNode)}
                                      </TableCell>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
                    {fallback && !visibleRows.length && (
                      <TableRow
                        {...fallbackTableRowProps}
                        sx={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} {...fallbackTableCellProps}>
                          {fallback}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Box>
          {!disablePagination && (
            <Box
              sx={{
                borderRadius: "0 0 8px 8px",
              }}
              className={cn(
                "w-full overflow-hidden bg-white transition-all",
                stickyPagination && "sticky bottom-0",
                shouldShowShadow && "shadow-top-lg"
              )}>
              <TablePagination
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} / ${count}`
                }
                labelRowsPerPage="筆數："
                component="div"
                page={page}
                {...tablePaginationProps}
                count={tablePaginationProps?.count ?? data.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}

const Forwarded = forwardRef(BasicTableWithGeneric) as <TData>(
  props: BasicTableProps<TData> & {
    ref?: ForwardedRef<BasicTableRef<TData>>;
  }
) => ReturnType<typeof BasicTableWithGeneric>;

function Index<TData>(
  props: BasicTableProps<TData> & {
    ref?: ForwardedRef<BasicTableRef<TData>>;
  }
) {
  return (
    <TableProvider>
      <Forwarded {...props} />
    </TableProvider>
  );
}

export default Index;

/**
 * we still export the types to avoid the breaking change
 */
export type { Order, Align, HeadCell, BasicTableRef, BasicTableProps };
