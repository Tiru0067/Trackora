import { useEffect, useMemo } from "react";
import {
  animate,
  motion as Motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { BASE_CURRENCY } from "@/constants/currency";
import { getLocale } from "@/utils/currency";

/**
 * Animates a number from a previous value to a target value
 * @param {React.RefObject<number>} from - Ref holding the previous value to animate from
 * @param {number} to - Target value to animate to
 * @param {string} currency - ISO currency code for locale formatting
 * @param {number} delay - Animation delay in seconds
 */

export default function AnimatedNumber({
  from,
  to,
  currency = BASE_CURRENCY,
  delay = 0,
}) {
  const count = useMotionValue(from.current ?? 0);

  const target = to;
  const decimalLength = String(target).split(".")[1]?.length ?? 0;
  const locale = getLocale(currency);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalLength,
        maximumFractionDigits: decimalLength,
      }),
    [decimalLength, locale],
  );

  const display = useTransform(() => {
    const value = count.get();

    return formatter.format(decimalLength ? value : Math.round(value));
  });

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 0.8,
      delay,
    });

    // Update ref in cleanup so next animation starts from the last value
    return () => {
      controls.stop();
      from.current = target;
    };
  }, [count, target, from, delay]);

  return <Motion.span aria-hidden="true">{display}</Motion.span>;
}
