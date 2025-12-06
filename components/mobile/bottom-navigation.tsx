import { Home, TrendingUp, CreditCard, Gift } from "lucide-react";

export type TabType = "home" | "insights" | "accounts" | "cards" | "rewards";

type BottomNavigationProps = {
  activeTab: TabType;
  onTabChange?: (tab: TabType) => void;
};

export const BottomNavigation = ({
  activeTab,
  onTabChange,
}: BottomNavigationProps) => {
  const tabs = [
    { id: "home" as TabType, label: "Home", icon: Home },
    { id: "insights" as TabType, label: "Insights", icon: TrendingUp },
    {
      id: "accounts" as TabType,
      label: "Accounts",
      icon: null,
      custom: null,
    },
    { id: "cards" as TabType, label: "Cards", icon: CreditCard },
    { id: "rewards" as TabType, label: "Rewards", icon: Gift },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-3"
            >
              {tab.id === "accounts" ? (
                <div className="flex flex-col items-center">
                  <div
                    className={`text-xs font-semibold mb-0.5 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    Ryt
                  </div>
                  <div
                    className={`text-[10px] ${
                      isActive ? "text-blue-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    Accounts
                  </div>
                  {isActive && (
                    <div className="w-8 h-0.5 bg-blue-600 rounded-full mt-1" />
                  )}
                </div>
              ) : (
                <>
                  {tab.icon && (
                    <tab.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  )}
                  <span
                    className={`text-[10px] ${
                      isActive ? "text-blue-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="w-8 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
