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
    <div 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background border-t border-border z-50" 
      style={{
        height: "calc(3.5rem + max(0.5rem, env(safe-area-inset-bottom)))"
      }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex flex-col items-center justify-center gap-1 h-full min-w-0 flex-1"
            >
              {tab.id === "accounts" ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div
                    className={`text-xs font-semibold leading-tight ${
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                    }`}
                  >
                    Ryt
                  </div>
                  <div
                    className={`text-[10px] leading-tight ${
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                    }`}
                  >
                    Accounts
                  </div>
                </div>
              ) : (
                <>
                  {tab.icon && (
                    <tab.icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <span
                    className={`text-[10px] leading-tight ${
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
