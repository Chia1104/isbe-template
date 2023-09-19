import { type ReactNode, type ReactElement } from "react";
import { type RouteObject } from "react-router-dom";
import { type Role } from "./roles";
import type { MeResponse } from "@/services/globalService";

declare interface IsBeRoute {
  /**
   * @description 路由名稱，`children` 的路由會跟著父層的 `path` 組成完整路由名稱
   */
  path?: RouteObject["path"];
  /**
   * @deprecated
   */
  index?: RouteObject["index"];
  /**
   * @description 該層的 `children` 會出先在父層的 `Outlet` 中，若這層含有 `children`，請用 `layout`
   */
  children?: IsBeRoute[];
  caseSensitive?: boolean;
  /**
   * @description unique id
   */
  id: string;
  /**
   * @description 可以放客製化的 `errorElement`，預設為 root 的 `error
   * @param ReactNode | string(path)
   * @example "/pages/foo/error" | <Error />
   */
  errorElement?: RouteObject["errorElement"];
  /**
   * @description 可以放客製化的 `loading`，預設為 app 的 `AppLoading`
   */
  loading?: ReactElement;
  /**
   * @description breadcrumb 的名稱
   */
  title?: string;
  /**
   * @description drawer menu 的 icon
   */
  icon?: string | ReactNode | null;
  /**
   * @description 重導路徑
   * @example "/foo"
   */
  redirect?: RouteObject["redirect"];
  /**
   * @description 路由元件，可以是 "pages" 的元件，也可以用 `@roswell/layouts` 的 `Layout` 元件
   * @example "pages/foo" | "@roswell/Drawer"
   */
  element: string;
  /**
   * @deprecated
   */
  order?: number;
  hiddenBreadcrumb?: boolean;
  disabledBreadcrumbLink?: boolean;
  hiddenNavigation?: boolean;
  hideInMenu?: boolean;
  /** 權限控制 */
  acl?: string[];
  /**
   * @deprecated 請把要做登入驗證的路由放在 `/pages/(main)` 裡面
   */
  needVerifyToken?: boolean;
  /**
   * @description 是否需要權限控制，需要 acl 的時候要設定為 `true`，使用 `useDevMode` 的時候也要設定為 `true`
   * 設定 rule，若要隱藏 drawer item 也要設定為 `true`
   */
  needPermission?: boolean;
  /**
   * @todo
   */
  isLayout?: boolean;
  useDevMode?: {
    enabled?: boolean;
    env?: Env[];
    roles?: Role[];
  };
  /**
   * @description drawer menu 是否被選中
   */
  selected?: boolean;
  /**
   * @description custom rule for auth
   * @param me
   */
  rule?: (me?: MeResponse | null) => boolean;
}
