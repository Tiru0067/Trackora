const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });

export const currencyList = Intl.supportedValuesOf("currency").map((code) => ({
  label: code,
  value: code,
  name: displayNames.of(code),
}));
