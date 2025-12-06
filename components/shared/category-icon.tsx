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
  food: "bg-orange-500/20 text-orange-400",
  transport: "bg-sky-500/20 text-sky-400",
  utilities: "bg-amber-500/20 text-amber-400",
  entertainment: "bg-fuchsia-500/20 text-fuchsia-400",
  shopping: "bg-emerald-500/20 text-emerald-400",
  transfer: "bg-blue-500/20 text-blue-400",
  income: "bg-lime-500/20 text-lime-400",
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
