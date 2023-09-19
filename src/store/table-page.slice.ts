import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const TABLE_PAGE_FEATURE_KEY = "tablePage";

export interface DefaultTablePageState {
  defaultPage: number;
  defaultPerPage: number;
  currentPage: number;
  perPage: number;
}

// const example = [
//   {
//     foo: {
//       defaultPage: 0,
//       defaultPerPage: 10,
//       currentPage: 0,
//       perPage: 10,
//     },
//   },
//   {
//     bar: {
//       defaultPage: 0,
//       defaultPerPage: 10,
//       currentPage: 0,
//       perPage: 10,
//     },
//   },
// ] satisfies TablePageState[];

export interface TablePageState {
  [key: string]: DefaultTablePageState;
}

export const initialTablePageState: TablePageState[] = [];

export const tablePageSlice = createSlice({
  name: TABLE_PAGE_FEATURE_KEY,
  initialState: initialTablePageState,
  reducers: {
    createTableKey(
      state,
      action: PayloadAction<{
        key: string;
        defaultPage: number;
        defaultPerPage: number;
      }>
    ) {
      const { key, defaultPage, defaultPerPage } = action.payload;
      const found = state.find((item) => item[key]);
      if (!found) {
        state.push({
          [key]: {
            defaultPage,
            defaultPerPage,
            currentPage: defaultPage,
            perPage: defaultPerPage,
          },
        });
      }
    },
    changePage(
      state,
      action: PayloadAction<{
        key: string;
        page: number;
      }>
    ) {
      const { key, page } = action.payload;
      const found = state.find((item) => item[key]);
      if (found) {
        found[key].currentPage = page;
      }
    },
    changePerPage(
      state,
      action: PayloadAction<{
        key: string;
        perPage: number;
      }>
    ) {
      const { key, perPage } = action.payload;
      const found = state.find((item) => item[key]);
      if (found) {
        found[key].perPage = perPage;
      }
    },
    resetPage(state, action: PayloadAction<{ key: string }>) {
      const { key } = action.payload;
      const found = state.find((item) => item[key]);
      if (found) {
        found[key].currentPage = found[key].defaultPage;
      }
    },
    resetPerPage(state, action: PayloadAction<{ key: string }>) {
      const { key } = action.payload;
      const found = state.find((item) => item[key]);
      if (found) {
        found[key].perPage = found[key].defaultPerPage;
      }
    },
    resetAll(state, action: PayloadAction<{ key: string }>) {
      const { key } = action.payload;
      const found = state.find((item) => item[key]);
      if (found) {
        found[key].currentPage = found[key].defaultPage;
        found[key].perPage = found[key].defaultPerPage;
      }
    },
    clearTablePage() {
      return initialTablePageState;
    },
    clearTablePageByKey(state, action: PayloadAction<{ key: string }>) {
      const { key } = action.payload;
      return state.filter((item) => !item[key]);
    },
  },
});

export const {
  createTableKey,
  changePage,
  changePerPage,
  resetPage,
  resetPerPage,
  resetAll,
  clearTablePage,
  clearTablePageByKey,
} = tablePageSlice.actions;

export const tablePageReducer = tablePageSlice.reducer;
