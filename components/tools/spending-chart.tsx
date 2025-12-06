import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AmountDisplay } from "@/components/shared/amount-display";
import { TransactionCategory } from "@/types/bank";

interface SpendingChartProps {
  periodLabel: string;
  totalSpent: number;
  totals: { category: TransactionCategory; amount: number }[];
  chartType?: "pie" | "bar";
  insight?: string;
  currency?: string;
}

const palette = [
  "#2563eb",
  "#38bdf8",
  "#fbbf24",
  "#a855f7",
  "#22c55e",
  "#ef4444",
  "#f97316",
];

export const SpendingChart = ({
  periodLabel,
  totalSpent,
  totals,
  chartType = "pie",
  insight,
  currency = "MYR",
}: SpendingChartProps) => {
  const data = totals.map((item, index) => ({
    ...item,
    fill: palette[index % palette.length],
  }));
  const hasData = data.some((item) => item.amount > 0);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Spending Analysis
          </p>
          <p className="text-lg font-semibold">{periodLabel}</p>
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
          Total{" "}
          <AmountDisplay amount={totalSpent} currency={currency} emphasize />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-56 w-full">
          {!hasData ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              No spending data available for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={data} margin={{ left: -18, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => value.slice(0, 6)}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    cursor={{ fill: "rgba(37,99,235,0.05)" }}
                    formatter={(value: number, name: string) => [
                      value.toFixed(2),
                      name,
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    radius={[8, 8, 4, 4]}
                    isAnimationActive={false}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value.toFixed(2),
                      name,
                    ]}
                  />
                  <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={86}
                    paddingAngle={4}
                    stroke="white"
                    isAnimationActive={false}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-primary">
          {data.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="font-semibold">{item.category}</span>
              </div>
              <AmountDisplay amount={item.amount} currency={currency} />
            </div>
          ))}
        </div>

        {insight ? (
          <div className="text-sm px-1 font-semibold">💡 {insight}</div>
        ) : null}
      </CardContent>
    </Card>
  );
};
