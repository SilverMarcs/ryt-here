import { ChevronDown } from "lucide-react";
import { BottomNavigation, type TabType } from "./bottom-navigation";

type InsightsScreenProps = {
    onTabChange?: (tab: TabType) => void;
};

type InsightCardProps = {
    title: string;
    amount?: string;
    detail?: string;
    chartData?: number[];
};

const InsightCard = ({
    title,
    amount,
    detail,
    chartData,
}: InsightCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">{title}</div>
            {amount ? (
                <div className="text-2xl font-bold mb-1">{amount}</div>
            ) : null}
            {detail ? (
                <p className="text-sm text-gray-700 mb-3">{detail}</p>
            ) : null}
            {chartData && chartData.length ? (
                <div className="flex items-end gap-1 h-12">
                    {chartData.map((value, index) => (
                        <div
                            key={`${title}-${index}`}
                            className="flex-1 bg-gray-200 rounded-t"
                            style={{ height: `${value}%` }}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export const InsightsScreen = ({ onTabChange }: InsightsScreenProps) => {
    const periodLabel = "1 Dec - 7 Dec";
    const incomeAmount = "RM 8,240.00";
    const spendAmount = "RM 5,430.75";
    const interestAmount = "RM 42.18";
    const topCategory = "Dining • RM 1,120.00";

    const spendingBreakdown = [
        { label: "Dining", amount: "RM 1,120.00", percent: 32 },
        { label: "Groceries", amount: "RM 890.40", percent: 25 },
        { label: "Transport", amount: "RM 540.30", percent: 16 },
        { label: "Shopping", amount: "RM 720.05", percent: 21 },
        { label: "Bills", amount: "RM 160.00", percent: 6 },
    ];

    const recentTransactions = [
        { label: "Grab ride", note: "Transport", amount: "- RM 18.50" },
        { label: "Family Mart", note: "Groceries", amount: "- RM 42.10" },
        { label: "Salary", note: "Income", amount: "+ RM 8,240.00" },
    ];

    return (
        <div className="bg-white min-h-full pb-20">
            {/* Header */}
            <div className="px-4 py-6">
                <h1 className="text-4xl font-serif mb-4">Insights</h1>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        <span className="text-sm font-medium">This week</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">{periodLabel}</span>
                </div>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-4">
                <InsightCard
                    title="Income"
                    amount={incomeAmount}
                    chartData={[50, 72, 68, 80, 55, 64, 78]}
                />
                <InsightCard
                    title="Spend"
                    amount={spendAmount}
                    chartData={[65, 58, 62, 70, 60, 66, 68]}
                />
                <InsightCard
                    title="Interest earned"
                    amount={interestAmount}
                    chartData={[10, 12, 13, 11, 9, 10, 12]}
                />
                <InsightCard title="Top category" amount={topCategory} />
            </div>

            {/* Spending Section */}
            <div className="px-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">
                        Spending breakdown
                    </h2>
                    <button className="text-blue-600 text-sm font-medium">
                        See all
                    </button>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="space-y-3">
                        {spendingBreakdown.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-800">
                                        {item.label}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {item.amount}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="px-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">
                        Recent transactions
                    </h2>
                    <button className="text-blue-600 text-sm font-medium">
                        See all
                    </button>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="space-y-3">
                        {recentTransactions.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.note}
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-gray-800">
                                    {item.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNavigation activeTab="insights" onTabChange={onTabChange} />
        </div>
    );
};
