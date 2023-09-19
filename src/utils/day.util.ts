import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

export function getStartAndEndOfDate(
  date: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  options?: {
    start?: {
      hour?: number;
      minute?: number;
      second?: number;
    };
    end?: {
      hour?: number;
      minute?: number;
      second?: number;
    };
  }
) {
  const { start, end } = options || {};

  const now = dayjs();
  let nextWeekDate = now.clone().isoWeekday(date);

  if (now.isAfter(nextWeekDate)) {
    nextWeekDate = nextWeekDate.add(1, "week");
  }

  const startOfDate = nextWeekDate
    .set("hour", start?.hour ?? 0)
    .set("minute", start?.minute ?? 0)
    .set("second", start?.second ?? 0)
    .format();
  const startTimestamp = dayjs(startOfDate).valueOf();
  const endOfDate = nextWeekDate
    .set("hour", end?.hour ?? 23)
    .set("minute", end?.minute ?? 59)
    .set("second", end?.second ?? 59)
    .format();
  const endTimestamp = dayjs(endOfDate).valueOf();

  return {
    start: startOfDate,
    end: endOfDate,
    startTimestamp,
    endTimestamp,
  };
}
