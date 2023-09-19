import { type DurationUnitType } from "dayjs/plugin/duration";

interface MaintenanceMode {
  id: string;
  enabled: boolean;
  /**
   * milliseconds since the Unix Epoch
   */
  startTimestamp: number;
  /**
   * milliseconds since the Unix Epoch
   */
  endTimestamp: number;
  /**
   * @description
   * The message to be displayed when the maintenance mode is enabled, optional.
   */
  message?: string;
  /**
   * @description
   * Used to describe the scope of the maintenance mode`.
   * @example ["backend", "sso"]
   */
  scope: string[];
  /**
   * @deprecated Use threshold instead
   */
  offset?: number;
  /**
   * @param time
   * @param unit
   * @description
   * The threshold is used to determine if the maintenance mode should be warned.
   * @example
   * {
   *    time: 1,
   *    unit: "minute",
   *  }
   */
  threshold?: {
    time: number;
    unit: DurationUnitType;
  };
  /**
   * @description
   * The meta is used to describe the maintenance mode, optional.
   */
  meta?: Partial<Record<string, string>>;
}

/**
 * @deprecated Use MaintenanceMode[] instead
 */
interface MaintenanceModes {
  id: string;
  enabled: boolean;
  message: string;
  startTimestamp?: number;
  endTimestamp?: number;
  scope: string[];
  offset: number;
  meta?: Record<string, unknown>;
  modes: MaintenanceMode[];
}
