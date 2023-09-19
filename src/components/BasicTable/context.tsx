import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import type { State } from "./types";

export const initialState = {
  innerLeftShadow: false,
  innerRightShadow: false,
} satisfies State;

export const TableContext = createContext<{
  state: State;
  dispatch: Dispatch<SetStateAction<State>>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>(initialState);

  return (
    <TableContext.Provider value={{ state, dispatch: setState }}>
      {children}
    </TableContext.Provider>
  );
};
