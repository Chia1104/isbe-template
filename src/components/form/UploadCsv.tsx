import { type FC, useId } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Typography, Box } from "@mui/material";

const UploadCsv: FC = () => {
  const id = useId();
  return (
    <Box className="relative flex h-[150px] w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-[#DEDEDE] bg-[#EFF4F8]">
      <CloudUploadOutlinedIcon />
      <Typography className="mt-2">上傳 CSV 檔案</Typography>
      <label htmlFor={id} className="absolute inset-0 z-10 cursor-pointer" />
      <input id={id} className="hidden" type="file" />
    </Box>
  );
};

export default UploadCsv;
