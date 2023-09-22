import useDispatch from "./use-app-dispatch";
import { globalActions, type GlobalState } from "@/store/global.slice";

export default function useSnackbar() {
  const dispatch = useDispatch();
  return (options: Partial<GlobalState["snackbar"]>) =>
    dispatch(globalActions.snackbarRequest(options));
}
