import dayjs from "dayjs";
import type { MaintenanceMode } from "@/@types/maintenance-mode";

export default [
  {
    id: "now",
    enabled: false,
    startTimestamp: dayjs().valueOf(),
    endTimestamp: dayjs().valueOf() + 1000 * 60 * 60 * 5,
    offset: 10,
    threshold: {
      time: 1,
      unit: "minute",
    },
    message: "this is now",
    scope: ["test now"],
    meta: {
      foo: "bar",
      baz: "qux",
    },
  },
  {
    id: "test-1",
    enabled: false,
    startTimestamp: dayjs().valueOf() - 1000 * 60 * 60 * 6,
    endTimestamp: dayjs().valueOf() + 1000 * 60 * 60 * 5,
    offset: 10,
    threshold: {
      time: 6,
      unit: "hour",
    },
    message: "this is dayjs().valueOf() - 1000 * 60 * 60 * 6",
    scope: ["test"],
    meta: {
      foo: "bar",
      baz: "qux",
    },
  },
  {
    id: "test-2",
    enabled: false,
    startTimestamp: dayjs().valueOf() + 1000 * 60 * 60 * 6,
    endTimestamp: dayjs().valueOf() + 1000 * 60 * 60 * 6 * 2,
    offset: 1000 * 60 * 60 * 6,
    threshold: {
      time: 6,
      unit: "hour",
    },
    message: "this is  dayjs().valueOf() + 1000 * 60 * 60 * 6",
    scope: ["test"],
    meta: {
      foo: "bar",
      baz: "qux",
    },
  },
  {
    id: "test-3",
    enabled: false,
    startTimestamp: dayjs().valueOf() - 1000 * 60 * 60 * 6,
    endTimestamp: dayjs().valueOf() - 1000 * 60 * 60 * 5,
    offset: 10,
    message: "Test 3",
    scope: ["test 3"],
    meta: {
      foo: "bar",
    },
  },
] satisfies MaintenanceMode[];
