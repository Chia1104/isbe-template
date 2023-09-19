import { z, type ZodTypeAny, ZodError, type ZodIssue } from "zod";
import validator from "validator";
import { type Locale } from "@/store/global.slice";

export interface HandleZodErrorReturn {
  message: string;
  issues?: ZodIssue[];
  isError: boolean;
}

export interface HandleZodErrorOptions<T> {
  schema: ZodTypeAny;
  /**
   * @deprecated use data instead
   */
  value?: string;
  data?: T;
  prefixErrorMessage?: string;
  preParse?: (data: T | string) => void;
  postParse?: (data: T | string) => void;
  onError?: (message: string, issues: ZodIssue[]) => void;
  onFinally?: () => void | HandleZodErrorReturn;
}

export const handleZodError = <T = unknown>({
  schema,
  value,
  data,
  prefixErrorMessage = "",
  preParse,
  postParse,
  onError,
  onFinally,
}: HandleZodErrorOptions<T>): HandleZodErrorReturn => {
  try {
    preParse?.((value as string) ?? (data as T));
    schema.parse((value as string) ?? (data as T));
    postParse?.((value as string) ?? (data as T));
    return {
      message: "",
      isError: false,
    };
  } catch (error: any) {
    let message = "";
    if (error instanceof ZodError) {
      const issues = error.issues;
      message = `${prefixErrorMessage}${issues
        .map((issue) => issue.message)
        .join(", ")}`;
      onError?.(message, issues);
      return {
        message,
        issues: error.issues,
        isError: true,
      };
    }
    return {
      message: error?.message,
      isError: true,
    };
  } finally {
    onFinally?.();
  }
};

export const emailSchema = z.string().email({
  message: "Email 格式錯誤",
});

// 需超過 8 個字元，且包含大寫英文、小寫英文、數字與特殊字元其中三項
export const PASSWORD_REGEX =
  /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*[a-z])(?=.*[-!@#$%^&*()_+|~=`{}[\]:";'<>?,./])|(?=.*[A-Z])(?=.*\d)(?=.*[-!@#$%^&*()_+|~=`{}[\]:";'<>?,./])|(?=.*[a-z])(?=.*\d)(?=.*[-!@#$%^&*()_+|~=`{}[\]:";'<>?,./]))[A-Za-z\d-!@#$%^&*()_+|~=`{}[\]:";'<>?,./]{8,}$/;

export const passwordSchema = z.string().regex(PASSWORD_REGEX, {
  message: "需超過 8 個字元，且包含大寫英文、小寫英文、數字與特殊字元其中三項",
});

// export const PASSWORD_REGEX =
//   /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;
//
// export const passwordSchema = z
//   .string()
//   .min(8, {
//     message: "密碼長度須大於 8 個字符",
//   })
//   .regex(PASSWORD_REGEX, {
//     message: "密碼其中有一個數字、一個大寫字母、一個特殊字符",
//   });

export const phoneSchema = z
  .string()
  .min(1, "必填")
  .refine(
    (value) => {
      return validator.isMobilePhone(value, "zh-TW");
    },
    {
      message: "請輸入有效的手機號碼",
    }
  );

export const localePhoneSchema = (
  locale?: Locale,
  options?: validator.IsMobilePhoneOptions
) => {
  return z
    .string()
    .min(1, "error.zod.required")
    .refine(
      (value) => {
        // replace '_' to '-' for validator
        return validator.isMobilePhone(
          value,
          locale?.replace("_", "-") as validator.MobilePhoneLocale,
          options
        );
      },
      {
        message: "error.zod.phone",
      }
    );
};
