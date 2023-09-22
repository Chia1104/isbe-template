import { type FC, useState, useRef } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import Card from "@/components/Card";
import Input, { type InputRef } from "@/components/form/Input";
import { Link, useNavigate } from "react-router-dom";
import { emailSchema } from "@/utils/validator";
import { useToken } from "@/services/authServices";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { get, handleKyError } from "@/utils/request";
import LoadingButton from "@mui/lab/LoadingButton";
import { Helmet } from "react-helmet-async";
import { queryClient } from "@/contexts/ReactQueryProvider";
import { MeResponse } from "@/services/globalService";
import useSnackbar from "@/hooks/use-snackbar";
import { queryKey } from "@/constants";

const Form: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const showSnackbar = useSnackbar();
  const formSchema = z
    .object({
      email: emailSchema,
      password: z.string().min(1, "請輸入密碼"),
    })
    .required();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  const emailRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);
  const [callbackError, setCallbackError] = useState<boolean>(false);
  const [callbackMessage, setCallbackMessage] = useState<string>("");
  const navigate = useNavigate();
  const { mutate, isLoading } = useToken({
    onSuccess: async (data) => {
      setCallbackError(false);
      setCallbackMessage("");
      showSnackbar({
        visible: true,
        variant: "success",
        content: `登入成功`,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      await queryClient.ensureQueryData({
        queryKey: [queryKey.me],
        queryFn: async () => {
          return await get<MeResponse>("/v1/me");
        },
        retry: false,
      });
      navigate("/");
    },
    onError: async (error) => {
      const data = await handleKyError(error);
      setCallbackError(true);
      switch (data.errors[0].message.toLowerCase()) {
        case "unauthorized":
          setCallbackMessage("帳號或密碼錯誤，請重新輸入");
          break;
        default:
          setCallbackMessage("發生錯誤");
      }
    },
  });
  const onSubmit = () => {
    setCallbackError(false);
    mutate({
      account: emailRef.current?.value ?? "",
      password: passwordRef.current?.value ?? "",
    });
  };
  return (
    <Card className="mx-3 px-[20px] py-[56px] lg:px-[64px]">
      <form
        noValidate
        className="flex w-full flex-col gap-[16px]"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <Input
                error={callbackError || invalid}
                ref={emailRef}
                type="email"
                size="small"
                label="*Email"
                placeholder="請輸入 Email"
                value={value}
                onChange={(e) => {
                  onChange(e);
                  setCallbackError(false);
                  setCallbackMessage("");
                }}
                onBlur={onBlur}
                errorMessage={
                  callbackMessage || error?.message || "請輸入 Email"
                }
              />
            )}
            name="email"
          />
        </div>
        <div className="flex w-full flex-col">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { invalid, error },
            }) => (
              <Input
                ref={passwordRef}
                error={invalid}
                autoComplete="off"
                size="small"
                label="*密碼"
                placeholder="請輸入密碼"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                errorMessage={error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end">
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showPassword ? "text" : "password"}
              />
            )}
            name="password"
          />
        </div>
        <div className="flex justify-end">
          <Link
            to="/auth/reset-password:send"
            className="w-fit text-primary-main">
            忘記密碼
          </Link>
        </div>
        <LoadingButton
          variant="contained"
          loadingPosition="start"
          startIcon={<i className="icon-login" />}
          type="submit"
          className="rounded-[8px]"
          loading={isLoading}>
          登入
        </LoadingButton>
      </form>
    </Card>
  );
};

const LoginPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>登入</title>
      </Helmet>
      <Form />
    </>
  );
};

export default LoginPage;
