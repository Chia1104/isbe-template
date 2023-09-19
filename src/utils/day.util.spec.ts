import { getStartAndEndOfDate } from "./day.util";
import dayjs from "dayjs";

describe("getStartAndEndOfDate", () => {
  test("should return start and end of day", () => {
    const { start, end, startTimestamp, endTimestamp } =
      getStartAndEndOfDate(5);
    console.log(start, end, startTimestamp, endTimestamp);
    expect(start).toBe("2023-09-01T00:00:00+08:00");
    expect(end).toBe("2023-09-01T23:59:59+08:00");
  });

  test("should return start and end of day with custom time", () => {
    const { start, end, startTimestamp, endTimestamp } = getStartAndEndOfDate(
      5,
      {
        start: {
          hour: 10,
          minute: 30,
          second: 0,
        },
        end: {
          hour: 20,
          minute: 30,
          second: 0,
        },
      }
    );
    console.log(start, end, startTimestamp, endTimestamp);
    expect(start).toBe("2023-09-01T10:30:00+08:00");
    expect(end).toBe("2023-09-01T20:30:00+08:00");
  });

  test("compare dayjs and new Date()", () => {
    const now = new Date().getTime();
    const dayjsNow = dayjs().unix();
    const formatNow = dayjs(now).format("YYYY/MM/DD HH:mm");
    const formatDayjsNow = dayjs(dayjsNow).format("YYYY/MM/DD HH:mm");
    console.log(now, dayjsNow, formatNow, formatDayjsNow);
  });
});
