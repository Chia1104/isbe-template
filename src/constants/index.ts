import { RolesEnum, type Role } from "@/@types/roles";

export const IS_PRODUCTION = window.Config.ENV === "production";

export const IS_LOCAL = window.Config.ENV === "local";

export const TOKEN = "auth-token";

export const FORBIDDEN_ERROR = "ForbiddenError";

export const queryKey = {
  me: "me",
  meta: "meta",
};
