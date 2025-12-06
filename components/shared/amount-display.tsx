import { formatCurrency } from "@/lib/bank";

export const AmountDisplay = ({
  amount,
  currency = "MYR",
  emphasize = false,
  hideDecimals = false,
}: {
  amount: number;
  currency?: string;
  emphasize?: boolean;
  hideDecimals?: boolean;
}) => {
  let formatted = formatCurrency(amount, currency);
  if (hideDecimals) {
    formatted = formatted.replace(/\.\d+$/, "");
  }
  const isNegative = amount < 0;
  return (
    <span
      className={
        emphasize
          ? isNegative
            ? "text-rose-500 font-semibold"
            : "text-emerald-600 font-semibold"
          : "text-primary"
      }
    >
      {formatted}
    </span>
  );
};
