/* eslint-disable @typescript-eslint/ban-types */
import React, { type PropsWithChildren } from "react";
import { type PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, type RenderOptions } from "@testing-library/react";
import { setupStore, type AppStore, type RootState } from "@/store";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import i18nMessages from "@/locales";
import APPThemeProvider from "@/contexts/APPThemeProvider";
import { HelmetProvider } from "react-helmet-async";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <HelmetProvider>
          <IntlProvider messages={i18nMessages?.en_us} locale="en">
            <APPThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </APPThemeProvider>
          </IntlProvider>
        </HelmetProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
