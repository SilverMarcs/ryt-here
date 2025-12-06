import {
    ArrowLeft,
    Copy,
    Shield,
    ArrowLeftRight,
    Lock,
    Settings,
    ChevronRight,
    TriangleAlert,
    CircleQuestionMark,
    MessageSquareText,
    LogOut,
} from "lucide-react";

type UserProfileScreenProps = {
    onClose?: () => void;
};

export const UserProfileScreen = ({ onClose }: UserProfileScreenProps) => {
    return (
        <div className="bg-white min-h-full pb-20">
            {/* Header */}
            <div className="flex items-center px-4 py-3">
                <button onClick={onClose}>
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center px-4 py-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold text-2xl">
                        LT
                    </span>
                </div>
                <div className="w-32 h-4 bg-gray-300 rounded mb-2" />
                <div className="flex items-center gap-2 mb-6">
                    <a href="#" className="text-blue-600 text-sm font-medium">
                        View profile
                    </a>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
            </div>

            {/* Info Cards */}
            <div className="flex gap-4 px-4 mb-4">
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-1">
                        Member since
                    </div>
                    <div className="text-sm font-medium">Dec 2025</div>
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">
                                Your account no.
                            </div>
                            <div className="w-24 h-4 bg-gray-300 rounded" />
                        </div>
                        <button>
                            <Copy className="w-5 h-5 text-blue-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Banner */}
            <div className="mx-4 mb-6 bg-blue-50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800 flex-1">
                        Verify your email to keep your account extra secure.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium text-sm ml-4">
                        Verify
                    </button>
                </div>
            </div>

            {/* Account Section */}
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Account</h2>
                <div className="bg-gray-100 rounded-2xl p-4 space-y-1">
                    {[
                        { icon: Shield, label: "Ryt Secure" },
                        { icon: ArrowLeftRight, label: "Accounts and limits" },
                        { icon: Lock, label: "Security" },
                        { icon: Settings, label: "General" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-gray-700" />
                                <span className="text-sm font-medium text-gray-800">
                                    {item.label}
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Support Section */}
            <div className="p-4 ">
                <h2 className="text-lg font-semibold mb-4">Support</h2>
                <div className="bg-gray-100 rounded-2xl p-4 space-y-1">
                    {[
                        { icon: TriangleAlert, label: "Report a problem" },
                        { icon: CircleQuestionMark, label: "Help Center" },
                        { icon: MessageSquareText, label: "Chat with us" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-gray-700" />
                                <span className="text-sm font-medium text-gray-800">
                                    {item.label}
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 space-y-1 mx-4">
                {[{ icon: LogOut, label: "Delete account" }].map((item) => (
                    <button
                        key={item.label}
                        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-gray-700" />
                            <span className="text-sm font-medium text-gray-800">
                                {item.label}
                            </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                ))}
            </div>
        </div>
    );
};
