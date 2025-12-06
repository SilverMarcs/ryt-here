import {
  Bus,
  Film,
  HandCoins,
  ShoppingBag,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionCategory } from "@/types/bank";
import { JSX } from "react";

const iconMap: Record<TransactionCategory, JSX.Element> = {
  food: <Utensils className="h-4 w-4" />,
  transport: <Bus className="h-4 w-4" />,
  utilities: <Zap className="h-4 w-4" />,
  entertainment: <Film className="h-4 w-4" />,
  shopping: <ShoppingBag className="h-4 w-4" />,
  transfer: <HandCoins className="h-4 w-4" />,
  income: <Sparkles className="h-4 w-4" />,
};

const colors: Record<TransactionCategory, string> = {
  food: "bg-orange-100 text-orange-700",
  transport: "bg-sky-100 text-sky-700",
  utilities: "bg-amber-100 text-amber-700",
  entertainment: "bg-fuchsia-100 text-fuchsia-700",
  shopping: "bg-emerald-100 text-emerald-700",
  transfer: "bg-blue-100 text-blue-700",
  income: "bg-lime-100 text-lime-700",
};

export const CategoryIcon = ({
  category,
  className,
}: {
  category: TransactionCategory;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
        colors[category],
        className,
      )}
    >
      {iconMap[category]}
    </span>
  );
};
