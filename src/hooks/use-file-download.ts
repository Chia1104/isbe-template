import { useRef } from "react";

export interface FileDownloadOptions {
  apiDefinition?: () => Promise<Blob>;
  data?: Blob;
  preDownloading?: () => void;
  postDownloading?: () => void;
  onError?: () => void;
  onFinished?: () => void;
  fileName?: string;
}

const useFileDownload = (options?: FileDownloadOptions) => {
  options ??= {};
  const {
    data,
    apiDefinition,
    preDownloading,
    postDownloading,
    onError,
    fileName = "file",
    onFinished,
  } = options;
  const refAnchorElement = useRef<HTMLAnchorElement | null>(null);
  const download = async () => {
    try {
      preDownloading?.();
      const blob = data ?? (await apiDefinition?.());
      const url = blob ? URL.createObjectURL(new Blob([blob])) : "";
      refAnchorElement.current?.setAttribute("href", url);
      refAnchorElement.current?.setAttribute("download", fileName);
      refAnchorElement.current?.click();
      postDownloading?.();
      URL.revokeObjectURL(url);
    } catch (error) {
      onError?.();
    } finally {
      onFinished?.();
    }
  };

  return {
    download,
    refAnchorElement,
  };
};

export default useFileDownload;
