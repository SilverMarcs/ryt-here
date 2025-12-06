import { Shield, Check } from "lucide-react";
import { BottomNavigation, type TabType } from "./bottom-navigation";

type ProfileScreenProps = {
    onTabChange?: (tab: TabType) => void;
};

export const ProfileScreen = ({ onTabChange }: ProfileScreenProps) => {
    return (
        <div className="bg-background min-h-full pb-24 safe-area-inset-bottom">
            {/* Header */}
            <div className="px-4 py-6">
                <h1 className="text-4xl font-serif text-foreground mb-2">
                    Accounts
                </h1>
                <p className="text-muted-foreground">Total balance: RM 0.00</p>
            </div>

            {/* Ready to spend section */}
            <div className="flex items-center justify-between px-4 mb-4">
                <span className="text-foreground font-medium">
                    Ready to spend
                </span>
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        3.00% p.a.
                    </span>
                    <span className="text-foreground font-medium">RM 0.00</span>
                </div>
            </div>

            {/* Main Account Card */}
            <div className="mx-4 mb-6">
                <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                Ryt
                            </span>
                        </div>
                        <span className="text-foreground font-medium">
                            Main Account
                        </span>
                    </div>
                    <span className="text-foreground font-medium">RM 0.00</span>
                </div>
            </div>

            {/* PIDM Protection Footer */}
            <div className="px-4 mb-4">
                <div className="flex items-start gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <p className="text-xs text-muted-foreground flex-1">
                        Protected by PIDM up to RM 250,000 for each depositor
                    </p>
                </div>
                <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 text-xs font-medium"
                >
                    *Interest rate details
                </a>
            </div>

            <BottomNavigation activeTab="accounts" onTabChange={onTabChange} />
        </div>
    );
};
