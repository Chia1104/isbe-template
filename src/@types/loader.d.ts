import type { EnhancedStore } from "@reduxjs/toolkit";
import type { Params } from "react-router-dom";
import type { MeResponse } from "@/services/globalService";

interface LoaderRequest {
  store: EnhancedStore;
  request: Request;
  params: Params;
  me?: MeResponse | null;
}
