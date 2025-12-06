import { BottomNavigation, type TabType } from "./bottom-navigation";

type RewardsScreenProps = {
    onTabChange?: (tab: TabType) => void;
};

type RewardCardProps = {
    bgColor: string;
    title: string;
    illustration?: React.ReactNode;
    image?: string;
};

const RewardCard = ({
    bgColor,
    title,
    illustration,
    image,
}: RewardCardProps) => {
    return (
        <div
            className={`${bgColor} rounded-2xl p-4 aspect-square flex flex-col`}
        >
            {illustration && (
                <div className="flex-1 flex items-center justify-center mb-2">
                    {illustration}
                </div>
            )}
            {image && (
                <div className="flex-1 bg-muted rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Image</span>
                </div>
            )}
            <p className="text-xs font-medium text-foreground line-clamp-2">
                {title}
            </p>
        </div>
    );
};

export const RewardsScreen = ({ onTabChange }: RewardsScreenProps) => {
    const rewards = [
        {
            bgColor: "bg-green-50 dark:bg-green-900/20",
            title: "Boost up to 4% p.a., paid daily",
            illustration: (
                <div className="w-16 h-16 flex items-center justify-center">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl">
                        🚀
                    </div>
                </div>
            ),
        },
        {
            bgColor: "bg-pink-50 dark:bg-pink-900/20",
            title: "Snap and pay via Ryt AI, get up to R...",
            illustration: (
                <div className="w-16 h-16 flex items-center justify-center">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl">
                        📱
                    </div>
                </div>
            ),
        },
        {
            bgColor: "bg-card border border-border",
            title: "Get up to RM 12 cashback with Ry...",
            image: "ryt-payment",
        },
        {
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
            title: "Earn 1.2% unlimited cashback overse...",
            illustration: (
                <div className="w-16 h-16 flex items-center justify-center">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl">
                        🌴
                    </div>
                </div>
            ),
        },
        {
            bgColor: "bg-green-50 dark:bg-green-900/20",
            title: "Free upsize at Koppiku",
            illustration: (
                <div className="w-16 h-16 flex items-center justify-center">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl">
                        ☕
                    </div>
                </div>
            ),
        },
        {
            bgColor: "bg-card border border-border",
            title: "20% off at Kami Hair Salon",
            image: "kami-salon",
        },
    ];

    return (
        <div className="bg-background min-h-full pb-24 safe-area-inset-bottom">
            {/* Header */}
            <div className="px-4 py-6">
                <h1 className="text-4xl font-serif text-foreground mb-4">
                    Rewards
                </h1>
                <h2 className="text-lg font-semibold text-foreground">
                    All offers
                </h2>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 gap-4 px-4">
                {rewards.map((reward, index) => (
                    <RewardCard key={index} {...reward} />
                ))}
            </div>

            <BottomNavigation activeTab="rewards" onTabChange={onTabChange} />
        </div>
    );
};
