import { ChevronDown } from "lucide-react";
import { BottomNavigation, type TabType } from "./bottom-navigation";

type InsightsScreenProps = {
  onTabChange?: (tab: TabType) => void;
};

type InsightCardProps = {
  title: string;
  amount: string;
  hasChart?: boolean;
  placeholder?: string;
};

const InsightCard = ({
  title,
  amount,
  hasChart,
  placeholder,
}: InsightCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      {placeholder ? (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-3">{placeholder}</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold mb-3">{amount}</div>
          {hasChart && (
            <div className="flex items-end gap-1 h-12">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 rounded-t"
                  style={{
                    height: `${Math.random() * 30 + 10}%`,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const InsightsScreen = ({ onTabChange }: InsightsScreenProps) => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">02:37</span>
          <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <span className="text-xs">22</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="text-4xl font-serif mb-4">Insights</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">This week</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">1 Dec - 7 Dec</span>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-4">
        <InsightCard title="Income" amount="RM 0.00" hasChart />
        <InsightCard title="Spend" amount="RM 0.00" hasChart />
        <InsightCard title="Interest earned" amount="RM 0.00" hasChart />
        <InsightCard
          title="Top category"
          amount=""
          placeholder="Spend to reveal your top category."
        />
      </div>

      {/* Spending Section */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Spending breakdown</h2>
          <button className="text-blue-600 text-sm font-medium">See all</button>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 text-center py-8">
            No spending yet this week
          </p>
        </div>
      </div>

      <BottomNavigation activeTab="insights" onTabChange={onTabChange} />
    </div>
  );
};
