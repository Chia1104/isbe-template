import {
  forwardRef,
  useCallback,
  type ChangeEvent,
  useImperativeHandle,
  useRef,
  Fragment,
  useState,
  useMemo,
} from "react";
import {
  TextField,
  type TextFieldProps,
  FormHelperText,
  type FormHelperTextProps,
} from "@mui/material";
import { type ZodTypeAny } from "zod";
import { cn } from "@/utils";
import { handleZodError } from "@/utils/validator";
import { FormattedMessage } from "react-intl";

export interface Props {
  schema?: ZodTypeAny;
  errorMessage?: string | string[];
  prefixErrorMessage?: string;
  isValid?: boolean;
  FormHelperTextProps?: FormHelperTextProps;
  onParse?: (
    value: string,
    isValid: boolean,
    message: string,
    multiMessage: string[]
  ) => void;
  useMultiMessage?: boolean;
  helperText?: string;
  disableZodErrorMessages?: boolean;
}

export interface InputRef extends Partial<HTMLInputElement> {
  isValid: () => boolean;
}

export type InputProps = Props & TextFieldProps;

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    schema,
    InputProps,
    onChange,
    isValid,
    errorMessage,
    FormHelperTextProps,
    prefixErrorMessage,
    onParse,
    error,
    useMultiMessage,
    helperText,
    disableZodErrorMessages,
    ...rest
  } = props;
  useImperativeHandle(ref, () => ({
    isValid: () => state.isValid,
    ...inputRef.current,
  }));
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{
    isValid: boolean;
    message: string;
    multiMessage: string[];
  }>({
    isValid: true,
    message: "",
    multiMessage: [],
  });
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (schema) {
        handleZodError({
          schema,
          data: e.target.value,
          postParse: () => {
            setState({
              isValid: true,
              message: "",
              multiMessage: [],
            });
            onParse?.(e.target.value, true, "", []);
          },
          onError: (msg, issues) => {
            const multiMessage =
              errorMessage instanceof Array
                ? errorMessage
                : issues.map((issue) => issue.message);
            const message =
              typeof errorMessage === "string" ? errorMessage : msg;
            setState({
              isValid: false,
              message,
              multiMessage,
            });
            onParse?.(e.target.value, isValid ?? false, message, multiMessage);
          },
          prefixErrorMessage,
        });
      }
      onChange?.(e);
    },
    [schema, onChange, isValid, errorMessage, prefixErrorMessage, state]
  );

  const [message, multiMessage] = useMemo(() => {
    const msg = typeof errorMessage === "string" ? errorMessage : state.message;
    const multiMsg =
      errorMessage instanceof Array ? errorMessage : state.multiMessage;
    return [msg, multiMsg];
  }, [errorMessage, state.message, state.multiMessage]);

  return (
    <>
      <TextField
        {...rest}
        inputRef={inputRef}
        error={error ?? !state.isValid}
        onChange={handleChange}
        InputProps={{
          ...InputProps,
          className: cn("rounded-[8px]", InputProps?.className),
        }}
      />
      {(error ?? !state.isValid) && !disableZodErrorMessages && (
        <FormHelperText
          error
          className={cn("m-0 mt-1", FormHelperTextProps?.className)}
          {...FormHelperTextProps}>
          {useMultiMessage ? (
            multiMessage.map((message, index) => (
              <Fragment key={message}>
                <FormattedMessage id={message} defaultMessage={message} />
                {index !== state.multiMessage.length - 1 && ", "}
              </Fragment>
            ))
          ) : (
            <FormattedMessage id={message} defaultMessage={message} />
          )}
        </FormHelperText>
      )}
      {helperText && (
        <FormHelperText
          className={cn("m-0 mt-1", FormHelperTextProps?.className)}
          {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
});
Input.displayName = "Input";

export default Input;
