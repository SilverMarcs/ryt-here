import {
    ArrowDown,
    ArrowUpRight,
    Plus,
    QrCode,
    Bell,
    Sparkles,
} from "lucide-react";
import { BottomNavigation, type TabType } from "./bottom-navigation";
import { RoundButton } from "./ui/round-button";

type HomeScreenProps = {
    onTabChange?: (tab: TabType) => void;
    onOpenChat?: (buttonRect: DOMRect) => void;
    onOpenProfile?: () => void;
};

export const HomeScreen = ({
    onTabChange,
    onOpenChat,
    onOpenProfile,
}: HomeScreenProps) => {
    const balance = "RM 12,340.25";
    const interestEarned = "RM 45.12";
    const readyToSpendRate = "3.00% p.a.";
    const bonusRate = "1.0% p.a.";

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onOpenChat) {
            const buttonRect = event.currentTarget.getBoundingClientRect();
            onOpenChat(buttonRect);
        }
    };

    const handleProfileClick = () => {
        if (onOpenProfile) {
            onOpenProfile();
        }
    };

    return (
        <div className="bg-white min-h-full pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3">
                <div
                    className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                    onClick={handleProfileClick}
                >
                    <span className="text-blue-600 font-semibold text-sm">
                        LT
                    </span>
                </div>
                <button
                    onClick={handleButtonClick}
                    className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors active:scale-95"
                >
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium text-sm">
                        I'm Ryt Here
                    </span>
                </button>
                <div className="relative">
                    <Bell className="w-6 h-6 text-gray-700" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white mx-4 rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-gray-600 text-sm">
                            Total balance
                        </span>
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-4xl font-bold mb-2">{balance}</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-600 text-sm">
                            Interest earned
                        </span>
                        <span className="text-green-600 font-semibold">
                            +{interestEarned}
                        </span>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center justify-between px-4">
                    <RoundButton
                        icon={<QrCode className="w-6 h-6 text-white" />}
                        label="Scan"
                    />
                    <RoundButton
                        icon={<Plus className="w-6 h-6 text-white" />}
                        label="Add money"
                    />
                    <RoundButton
                        icon={<ArrowDown className="w-6 h-6 text-white" />}
                        label="Receive"
                    />
                    <RoundButton
                        icon={<ArrowUpRight className="w-6 h-6 text-white" />}
                        label="Transfer"
                    />
                </div>
            </div>

            {/* Info Cards */}
            <div className="flex gap-4 px-4 mb-4">
                <div className="flex-1 bg-green-50 dark:bg-gray-700 rounded-2xl p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full mb-3 flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">
                            RM
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">
                        Earn high interest paid every day
                    </p>
                    <a href="#" className="text-blue-600 text-xs font-medium">
                        Learn more &gt;
                    </a>
                </div>
                <div className="flex-1 bg-green-50 dark:bg-gray-700 rounded-2xl p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Ryt PayLater
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                        Get credit limit up to RM 1,499
                    </p>
                    <div className="w-16 h-16 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">
                            RM
                        </span>
                    </div>
                    <a href="#" className="text-blue-600 text-xs font-medium">
                        Apply now &gt;
                    </a>
                </div>
            </div>

            {/* Account Activation */}
            <div className="flex items-center justify-between mx-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xs">
                                RM
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">
                            Activate your account
                        </p>
                        <p className="text-xs text-gray-600">
                            1 of 6 completed &gt;
                        </p>
                    </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Add money
                </button>
            </div>

            {/* Bonus Interest */}
            <div className="flex items-center justify-between mx-4 px-4 py-2">
                <span className="text-sm font-medium text-gray-800">
                    Bonus Interest
                </span>
                <div className="flex items-center gap-1">
                    <span className="text-blue-600 font-semibold">
                        {readyToSpendRate}
                    </span>
                    <span className="text-gray-400">+</span>
                    <span className="text-gray-500 text-sm">{bonusRate}</span>
                </div>
            </div>

            <BottomNavigation activeTab="home" onTabChange={onTabChange} />
        </div>
    );
};
