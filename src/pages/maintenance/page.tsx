import PageTransition from "@/components/PageTransition";
import useSelector from "@/hooks/use-app-selector";
import type { LoaderRequest } from "@/@types/loader";
import { redirect } from "react-router-dom";
import { type FC, type ReactNode, useMemo } from "react";
import { cn } from "@/utils";
import { type ClassValue } from "clsx";
import maintenance from "@/assets/images/maintenance.svg";
import dayjs from "dayjs";
import Button from "@/components/Button";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/Accordion";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const loader = (request: LoaderRequest) => {
  if (!request.store.getState().global.maintenanceMode) {
    return redirect("/");
  }
  return null;
};

interface Props extends Omit<BoxProps, "className"> {
  useButton?: {
    onClick: () => void;
  };
  className?: ClassValue;
}

const ShowMore: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="see-more"
        className="flex w-full flex-col items-center justify-center">
        <AccordionTrigger className="max-w-fit justify-center pb-0">
          <Typography variant="body2" className="text-center">
            顯示更多
          </Typography>
        </AccordionTrigger>
        <AccordionContent slow className="w-full" wrapperClassName="px-0 py-5">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const MaintenanceMode: FC<Props> = ({
  useButton,
  className,
  ...props
}) => {
  const maintenanceMode = useSelector((state) => state.global.maintenanceMode);
  const hasMore = useMemo(() => {
    return (
      maintenanceMode?.message ||
      Object.keys(maintenanceMode?.meta ?? {}).length
    );
  }, [maintenanceMode]);
  return (
    <Box
      {...props}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 px-8 py-[56px] md:px-[64px]",
        className
      )}>
      <img src={maintenance} alt="maintenance" />
      <h2 className="m-0">服務維護公告</h2>
      <p className="m-0 text-black/60">
        親愛的會員您好，
        <br />
        <span className="font-bold">
          {dayjs(maintenanceMode?.startTimestamp).format("YYYY/MM/DD HH:mm")} -{" "}
          {dayjs(maintenanceMode?.endTimestamp).format("HH:mm")}{" "}
        </span>
        系統將進行維護， 此期間受影響之服務範圍包含：
        <br />
        <span className="font-bold">
          {maintenanceMode?.scope?.join("、") ?? "無"}
        </span>
        <br />
        若提早完成維護作業，服務功能即恢復正常，不再另行公告。造成不便，敬請見諒！
      </p>
      {hasMore ? (
        <ShowMore>
          {maintenanceMode?.message && (
            <p className="m-0 mb-3 text-base text-black/60">
              {maintenanceMode?.message}
            </p>
          )}
          {Object.keys(maintenanceMode?.meta ?? {}).map((key) => (
            <Table className="w-full border-collapse" key={key}>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/3 border px-1 py-3 font-bold text-black/60">
                    {key}：
                  </TableCell>
                  <TableCell className="w-2/3 border px-1 py-3 text-black/60">
                    {maintenanceMode?.meta?.[key]}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ))}
        </ShowMore>
      ) : null}
      {useButton && (
        <Button
          variant="contained"
          fullWidth
          className="mt-4 w-full"
          onClick={useButton?.onClick}>
          關閉
        </Button>
      )}
    </Box>
  );
};

export default function Page() {
  const maintenanceMode = useSelector((state) => state.global.maintenanceMode);
  return (
    <PageTransition className="main y-container p-4">
      <MaintenanceMode
        className="max-w-[450px]"
        sx={{
          border: "1px solid #E5E5E5",
          borderRadius: "16px",
        }}
      />
    </PageTransition>
  );
}
