import useDispatch from "./use-app-dispatch";
import { globalActions, type GlobalState } from "@/store/global.slice";

export default function useDialog() {
  const dispatch = useDispatch();
  return (options: Partial<GlobalState["dialog"]>) =>
    dispatch(globalActions.toggleDialog(options));
}
