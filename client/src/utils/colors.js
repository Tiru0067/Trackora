export const opacityToHex = (opacity) => {
  const value = Math.max(0, Math.min(1, opacity));

  return Math.round(value * 255)
    .toString(16)
    .padStart(2, "0");
};
