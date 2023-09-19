interface IntlOptions {
  locales?: Intl.LocalesArgument;
  options?: Intl.NumberFormatOptions;
}

const roundDecimal = (
  value: number,
  decimal: number = 0,
  intlOptions?: IntlOptions
) => {
  const { locales = "zh-TW", options } = intlOptions ?? {};
  const { style = "decimal", ...rest } = options ?? {};
  return (
    Math.round(Math.round(value * Math.pow(10, decimal + 1)) / 10) /
    Math.pow(10, decimal)
  ).toLocaleString(locales, {
    style,
    ...rest,
  });
};

export default roundDecimal;
