import type { LoaderRequest } from "@/@types/loader";
import { type IsBeRoute } from "@/@types/route";
import {
  createBrowserRouter,
  matchPath,
  matchRoutes,
  Outlet,
  redirect,
  type RouteObject,
} from "react-router-dom";
import Loadable, { type LoadableClassComponent } from "@loadable/component";
import PageLoading from "@/components/PageLoading";
import { type LoaderFunctionArgs } from "react-router-dom";
import { type EnhancedStore } from "@reduxjs/toolkit";
import LayoutLoading from "@/components/LayoutLoading";
import PageError from "@/pages/error";
import routesJSON from "@/router/routes";
import { langs, languagesConfig } from "@roswell/hooks";
import type { ReactElement } from "react";
import React from "react";
import App from "@/App";
import { AppDispatch } from "@/store";
import { globalActions, Locale } from "@/store/global.slice";
import _ from "lodash";
import ProjectConfig from "@/project.config.json";
import { getAcl } from "@/services/aclServices";
import { queryClient } from "@/contexts/ReactQueryProvider";
import { MeResponse } from "@/services/globalService";
import { queryKey } from "@/constants";

export const appLoader = async ({ store, request, params }: LoaderRequest) => {
  return { store, request, params };
};

export const loadComponent = (
  path: string,
  loading?: ReactElement,
  error?: ReactElement
): LoadableClassComponent<any> => {
  const isRoswellLayout = !(path.match("@roswell/") == null);
  const elementPath = path.replace(/(layout|pages|@roswell)\//, "");
  try {
    return Loadable(
      async () =>
        isRoswellLayout
          ? await import("@roswell/layouts").then(
              (module) => module[elementPath]
            )
          : await import(`@/pages/${elementPath}`),
      {
        fallback: loading ?? <LayoutLoading />,
      }
    );
  } catch (err) {
    console.error(err);
    return (error ?? <PageError />) as any;
  }
};

export const createRoutes = (
  store: EnhancedStore,
  routes?: IsBeRoute[]
): RouteObject[] => {
  return (
    routes?.map(({ needPermission = false, ...route }) => {
      const newRoute: RouteObject = {};
      const isLayout =
        !(route.element.match(/layout$/) == null) ||
        !(route.element.match("@roswell/") == null) ||
        route.isLayout;
      const Element = loadComponent(route.element, route.loading);
      const errorElementPath =
        typeof route.errorElement === "string"
          ? route.errorElement.replace("pages/", "")
          : null;
      const ErrorElement = errorElementPath
        ? loadComponent(errorElementPath, route.loading)
        : (route.errorElement as any);
      newRoute.path = route.path;
      newRoute.element = <Element routes={route.children} Outlet={Outlet} />;
      newRoute.errorElement = ErrorElement ? <ErrorElement /> : <PageError />;
      newRoute.children = createRoutes(store, route.children);
      newRoute.loader = async ({ request, params }: LoaderFunctionArgs) => {
        const { lang } = params;
        const pathNames = request.url
          .replace(window.location.origin, "")
          .split("?");
        const location = {
          pathname: pathNames[0],
          search: pathNames.length >= 2 ? `?${pathNames[1]}` : "",
        };
        const matchedRoute =
          matchRoutes(
            routesJSON,
            location,
            (langs.includes(lang || "") && `/${lang}`) || ""
          ) || [];
        const matchPathRoute = matchPath(
          lang ? `/${lang}/${route.path || ""}` : route.path || "",
          request.url.replace(window.location.origin, "")
        );

        const me = queryClient.getQueryData<MeResponse>([queryKey.me]);

        const rule = route.rule ? route.rule(me) : true;
        const isPermission =
          needPermission && route.acl
            ? getAcl(route.acl, route.useDevMode, me)
            : true;

        // 合法語系
        if (
          (lang && (!langs.includes(lang) || matchedRoute.length <= 0)) ||
          (!isLayout && matchedRoute.length <= 0)
        ) {
          throw new Response("Not Found", { status: 404 });
        }

        // has redirect
        else if (
          route.redirect &&
          request.url.replace(window.location.origin, "") !== route.redirect &&
          matchPathRoute != null
        ) {
          return redirect(lang ? `/${lang}${route.redirect}` : route.redirect);
        } else if (!rule) {
          /**
           * handle custom rule
           */
          throw new Response("Forbidden", { status: 403 });
        } else if (!isPermission) {
          throw new Response("Forbidden", { status: 403 });
        }

        // page loader
        else {
          const pageModule: any = await Element.load();
          if (typeof pageModule === "object" && pageModule.loader) {
            return pageModule.loader({
              store,
              request,
              params,
            });
          } else {
            return null;
          }
        }
      };
      return newRoute;
    }) || []
  );
};

export const createRouter = (store: EnhancedStore, isBeRoutes: IsBeRoute[]) => {
  const languages = _.values(ProjectConfig.languages);

  let routes: RouteObject[] = [];
  routes = createRoutes(store, isBeRoutes);
  routes.push({
    path: "*",
    loader: () => {
      throw new Response("Not Found", { status: 404 });
    },
    element: <PageError />,
    errorElement: <PageError />,
  });

  return createBrowserRouter([
    {
      path: "/:lang?",
      element: <App />,
      children: routes,
      loader: async ({ request, params }) => {
        const dispatch: AppDispatch = store.dispatch;
        const me = queryClient.getQueryData<MeResponse>([queryKey.me]);
        const { lang } = params;
        if (lang && langs.includes(lang || "")) {
          const currentLang = languages.find((item) => {
            const keys = languagesConfig[item.locale].keys.split("|");
            return keys.includes(lang);
          });

          if (currentLang?.locale) {
            dispatch(
              globalActions.changeLanguage(currentLang.locale as Locale)
            );
          }
        }
        return await appLoader({ store, request, params, me });
      },
      errorElement: <PageError />,
    },
  ]);
};
