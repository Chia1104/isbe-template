import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { getGlobal } from "./store/states";
import AppPlugins from "@/components/AppPlugins";
import { Outlet, type Params } from "react-router-dom";
import locales from "./locales";
import type { EnhancedStore } from "@reduxjs/toolkit";
import { HelmetProvider } from "react-helmet-async";
import { ScrollRestoration } from "react-router-dom";

export const appLoader = async ({
  store,
  request,
  params,
}: {
  store: EnhancedStore;
  request: Request;
  params: Params;
}) => {
  return { store, request, params };
};

export const App = () => {
  const { locale } = useSelector(getGlobal);
  const i8nMessages = locales;

  return (
    <IntlProvider locale="en" messages={i8nMessages?.[locale ?? "zh_tw"] || {}}>
      <HelmetProvider>
        <ScrollRestoration />
        <Outlet />
        <AppPlugins />
      </HelmetProvider>
    </IntlProvider>
  );
};

export default App;
