/** @format */

import { EXAMPLE_FEATURE_KEY, exampleReducer } from "./example.slice";
import {
  TABLE_PAGE_FEATURE_KEY,
  tablePageReducer,
} from "@/store/table-page.slice";

const reducers = {
  [EXAMPLE_FEATURE_KEY]: exampleReducer,
  [TABLE_PAGE_FEATURE_KEY]: tablePageReducer,
};
export default reducers;
