import roundDecimal from "@/utils/round-decimal";
import { expect } from "vitest";

describe("roundDecimal", () => {
  it("should round decimal", () => {
    expect(roundDecimal(1.234)).toBe("1");
    expect(roundDecimal(1.234, 1)).toBe("1.2");
    expect(roundDecimal(1.234, 2)).toBe("1.23");
    expect(roundDecimal(1.235, 2)).toBe("1.24");
    expect(roundDecimal(1.0, 2)).toBe("1");
    expect(roundDecimal(51234.0, 2)).toBe("51,234");
    expect(roundDecimal(51234.123, 2)).toBe("51,234.12");
    expect(roundDecimal(Number("NaN"), 2)).toBe("非數值");
    expect(roundDecimal(-30, 2)).toBe("-30");
    expect(roundDecimal(-30.123, 2)).toBe("-30.12");
  });
});
