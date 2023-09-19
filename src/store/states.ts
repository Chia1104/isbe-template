/** @format */

import { type ExampleState } from "@/store/example.slice";
import { type GlobalState } from "@/store/global.slice";
import { type TablePageState } from "@/store/table-page.slice";

export interface RootState {
  global: GlobalState;
  example: ExampleState;
  tablePage: TablePageState;
}

export const getRoot = (state: RootState): RootState => state;
export const getGlobal = (state: RootState): GlobalState => state.global;
export const getExample = (state: RootState): ExampleState => state.example;
export const getTablePage = (state: RootState): TablePageState =>
  state.tablePage;
