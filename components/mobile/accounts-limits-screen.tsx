import { useState } from "react";
import {
    ArrowLeft,
    FileText,
    Zap,
    Smartphone,
    ChevronRight,
} from "lucide-react";
import { TransactionLimitControl } from "@/components/tools/transaction-limit";
import { useBank } from "@/contexts/bank-context";

type AccountsLimitsScreenProps = {
    onClose?: () => void;
};

type SubScreen = null | "transaction-limits";

export const AccountsLimitsScreen = ({ onClose }: AccountsLimitsScreenProps) => {
    const { state, setTransactionLimit } = useBank();
    const [subScreen, setSubScreen] = useState<SubScreen>(null);
    const [pendingLimit, setPendingLimit] = useState<number | undefined>(
        state.user.card.transactionLimit
    );

    if (subScreen === "transaction-limits") {
        return (
            <div className="bg-background min-h-full pb-20">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => setSubScreen(null)}>
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <h1 className="text-lg font-semibold text-foreground">
                        Manage Transaction Limits
                    </h1>
                </div>

                {/* Transaction Limit Control */}
                <div className="p-4">
                    <TransactionLimitControl
                        currentLimit={state.user.card.transactionLimit}
                        currency={state.user.currency}
                        usedToday={0}
                        pendingLimit={pendingLimit}
                        onChange={(value) => setPendingLimit(value)}
                        onConfirm={() => {
                            if (pendingLimit !== undefined) {
                                setTransactionLimit(pendingLimit);
                                setSubScreen(null);
                            }
                        }}
                        confirmLabel="Apply New Limit"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-full pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={onClose}>
                    <ArrowLeft className="w-6 h-6 text-foreground" />
                </button>
                <h1 className="text-lg font-semibold text-foreground">
                    Accounts and Limits
                </h1>
            </div>

            {/* Settings Section */}
            <div className="p-4">
                <div className="bg-muted rounded-2xl p-4 space-y-1">
                    {[
                        {
                            icon: FileText,
                            label: "View account statements",
                            description: "Download and view your account statements",
                        },
                        {
                            icon: Zap,
                            label: "Manage transaction limits",
                            description: "Set daily, monthly, or transaction limits",
                            action: "transaction-limits" as const,
                        },
                        {
                            icon: Smartphone,
                            label: "Manage DuitNow ID",
                            description: "Register or update your DuitNow ID",
                        },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-muted"
                            onClick={() => {
                                if ("action" in item && item.action) {
                                    setSubScreen(item.action as SubScreen);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-foreground" />
                                <div className="text-left">
                                    <span className="text-sm font-medium text-foreground block">
                                        {item.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground block">
                                        {item.description}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
