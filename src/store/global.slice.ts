/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { type Dispatch } from "redux";
import { type AlertColor } from "@mui/material/Alert";
import { type ReactNode } from "react";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MaintenanceMode } from "@/@types/maintenance-mode";
import type { MeResponse } from "@/services/globalService";

export const GLOBAL_FEATURE_KEY = "global";

export type Locale = "en_us" | "zh_tw";

export interface GlobalState {
  locale?: Locale;
  dialog: {
    confirm?: boolean;
    visible?: boolean;
    close?: boolean;
    closeHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
    backdropClose?: boolean;
    fullScreen?: boolean;
    mobileFullScreen?: boolean;
    mobileVertical?: "flex-start" | "center" | "flex-end";
    title?: string | ReactNode;
    content?: string | ReactNode;
    contentComponent?: ReactNode;
    loading?: boolean;
    confirmHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
    confirmVariant?: "contained" | "outlined";
    confirmColor?: "primary" | "secondary";
    confirmText?: string;
    cancelHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
    cancelVariant?: "contained" | "outlined";
    cancelColor?: "primary" | "secondary";
    cancelText?: string;
    maxWidth?: "xs" | "sm" | "md" | "lg";
  };
  snackbar: {
    visible: boolean;
    close?: boolean;
    variant: "default" | "success" | "error" | "warning" | "info";
    anchorOrigin?: {
      vertical: "bottom" | "top";
      horizontal: "left" | "center" | "right";
    };
    icon?: string;
    content?: string | ReactNode;
    snackbarComponent?: ReactNode;
    action?: ReactNode;
    persist?: boolean;
    preventDuplicate?: boolean;
    hideIconVariant?: boolean;
    dense?: boolean;
    autoHideDuration?: number;
    closeHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
  };
  alert: {
    visible: boolean;
    position?: "fixed" | "relative" | "absolute" | "initial";
    severity: AlertColor;
    variant?: "standard" | "filled" | "outlined";
    Icon?: ReactNode;
    close?: boolean;
    closeHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
    vertical?: "top" | "bottom";
    top?: number;
    bottom?: number;
    content?: string | ReactNode;
    animationBackground?: {
      leftColor?: string;
      rightColor?: string;
      deg?: string;
    };
  };
  breadcrumbName: any;
  isDrawerOpen?: boolean;
  maintenanceMode?:
    | (MaintenanceMode & {
        isNear?: boolean;
      })
    | null;
  me?: MeResponse | null;
  unAuthorized?: boolean;
}

export const initialGlobalState: GlobalState = {
  locale: "zh_tw",
  dialog: {
    confirm: false,
    visible: false,
    close: false,
    backdropClose: false,
    fullScreen: false,
    mobileFullScreen: false,
    loading: false,
    confirmVariant: "contained",
    confirmColor: "primary",
    confirmText: "action.confirm",
    cancelVariant: "outlined",
    cancelColor: "secondary",
    cancelText: "action.cancel",
    maxWidth: "xs",
  },
  snackbar: {
    autoHideDuration: 3000,
    visible: false,
    persist: false,
    close: true,
    variant: "default",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
  },
  alert: {
    visible: false,
    position: "fixed",
    severity: "success",
    variant: "filled",
    Icon: null,
    close: true,
    vertical: "top",
    content: "",
  },
  breadcrumbName: {},
  isDrawerOpen: true,
  maintenanceMode: null,
  me: null,
  unAuthorized: false,
};

export const globalSlice = createSlice({
  name: GLOBAL_FEATURE_KEY,
  initialState: initialGlobalState,
  reducers: {
    toggleDialog(state, action: PayloadAction<Partial<GlobalState["dialog"]>>) {
      const isVisible = action.payload.visible;
      state.dialog = {
        ...state.dialog,
        ...action.payload,
        backdropClose: isVisible
          ? action.payload.backdropClose
          : initialGlobalState.dialog.backdropClose,
      } satisfies GlobalState["dialog"];
    },
    snackbarRequest(
      state,
      action: PayloadAction<Partial<GlobalState["snackbar"]>>
    ) {
      if (action.payload.visible) {
        state.snackbar = {
          ...state.snackbar,
          ...action.payload,
          close: false,
        } satisfies GlobalState["snackbar"];
        return;
      }

      state.snackbar = {
        ...state.snackbar,
        ...action.payload,
      } satisfies GlobalState["snackbar"];
    },
    changeLanguage(state, action: PayloadAction<Locale | undefined>) {
      state.locale = action.payload;
    },
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setMaintenanceMode(
      state,
      action: PayloadAction<(MaintenanceMode & { isNear?: boolean }) | null>
    ) {
      state.maintenanceMode = action.payload;
    },
    setMe(state, action: PayloadAction<MeResponse | null>) {
      state.me = action.payload;
    },
    resetGlobalState() {
      return initialGlobalState;
    },
    /**
     * @description THE ACTION SHOULD BE DISPATCHED WHEN THE USER LOGGED IN OR LOGGED OUT.
     * @param state
     * @param action
     */
    setAuthorized(state, action: PayloadAction<boolean>) {
      state.unAuthorized = !action.payload;
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const globalReducer = globalSlice.reducer;
export const globalActions = globalSlice.actions;
