import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Button, { type ButtonProps } from "./Button";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { type HTTPError } from "ky";

interface Props<TData = unknown> extends ButtonProps {
  request: TData;
  delay?: number;
  mutationOptions?: UseMutationOptions<void, HTTPError, TData>;
  enableInterval?: boolean;
}

function CountDownButton<TData = unknown>(props: Props<TData>) {
  const {
    request,
    enableInterval = true,
    delay: delayProp = 180,
    mutationOptions,
    onClick,
    children,
    disabled,
    loading,
    ...rest
  } = props;
  const [isSent, setIsSent] = useState(false);
  const [delay, setDelay] = useState(0);
  const timer = useRef<NodeJS.Timeout>();
  const signal = useRef<AbortController>();
  /**
   * Start the timer when the delay is greater than 0 and isSent is true
   */
  useEffect(() => {
    signal.current = new AbortController();
    if (delay > 0 && isSent && enableInterval) {
      timer.current = setInterval(() => {
        setDelay((prev) => prev - 1);
      }, 1000);
    }
    if (delay === 0 && isSent) {
      setIsSent(false);
    }
    return () => {
      clearInterval(timer.current);
      signal.current?.abort();
    };
  }, [delay]);

  const { isLoading, mutate } = useMutation<void, HTTPError, TData>({
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      setIsSent(true);
      enableInterval && setDelay(delayProp);
      mutationOptions?.onSuccess?.(data, variables, context);
    },
    onError: async (error, variables, context) => {
      setIsSent(true);
      enableInterval && setDelay(delayProp);
      mutationOptions?.onError?.(error, variables, context);
    },
  });

  const handleSend = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      mutate(request);
      onClick?.(e);
    },
    [mutate, onClick, request]
  );

  return (
    <Button
      {...rest}
      loading={loading || isLoading}
      disabled={disabled || isSent}
      onClick={handleSend}>
      {isSent ? (
        <span>
          {children} {!!delay && `(${delay})`}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

export default CountDownButton;
