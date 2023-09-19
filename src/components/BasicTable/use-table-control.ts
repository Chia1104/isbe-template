import useDispatch from "../../hooks/use-app-dispatch";
import useSelector from "../../hooks/use-app-selector";
import { useCallback, useLayoutEffect } from "react";
import {
  changePage,
  createTableKey,
  changePerPage,
  resetAll,
  resetPage,
  resetPerPage,
} from "@/store/table-page.slice";
import { useLocation, type Location } from "react-router-dom";

interface Options {
  key: string;
  defaultPerPage?: number;
  defaultPage?: number;
  scope?: (location: Location) => boolean;
}

/**
 * @todo experimental feature
 * @param key
 * @param defaultPerPage
 * @param defaultPage
 */
const useTableControl = ({
  key,
  defaultPerPage = 10,
  defaultPage = 0,
}: Options) => {
  const dispatch = useDispatch();
  const location = useLocation();
  useLayoutEffect(() => {
    dispatch(createTableKey({ key, defaultPerPage, defaultPage }));
  }, []);
  const result = useSelector((state) =>
    state.tablePage.find((item) => item[key])
  );
  const handleChangePage = useCallback(
    (page: number | string) => {
      dispatch(changePage({ key, page: Number(page) }));
    },
    [key]
  );
  const handleChangePerPage = useCallback(
    (perPage: number | string) => {
      dispatch(changePerPage({ key, perPage: Number(perPage) }));
    },
    [key]
  );
  const handleResetAll = useCallback(() => {
    dispatch(resetAll({ key }));
  }, [key]);
  const handleResetPage = useCallback(() => {
    dispatch(resetPage({ key }));
  }, [key]);
  const handleResetPerPage = useCallback(() => {
    dispatch(resetPerPage({ key }));
  }, [key]);
  return {
    page: result?.[key]?.currentPage ?? defaultPage,
    perPage: result?.[key]?.perPage ?? defaultPerPage,
    setPage: handleChangePage,
    setPerPage: handleChangePerPage,
    handleResetAll,
    handleResetPage,
    handleResetPerPage,
  };
};

export default useTableControl;
