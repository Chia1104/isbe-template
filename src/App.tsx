import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { getGlobal } from "./store/states";
import AppPlugins from "@/components/AppPlugins";
import { Outlet } from "react-router-dom";
import locales from "./locales";
import { HelmetProvider } from "react-helmet-async";
import { ScrollRestoration } from "react-router-dom";
import type { LoaderRequest } from "@/@types/loader";

export const appLoader = async (loaderRequest: LoaderRequest) => {
  return loaderRequest;
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
