import { BottomNavigation, type TabType } from "./bottom-navigation";

type CardsScreenProps = {
  onTabChange?: (tab: TabType) => void;
};

export const CardsScreen = ({ onTabChange }: CardsScreenProps) => {
  return (
    <div className="bg-white min-h-full pb-20">

      {/* Page Indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full" />
        <div className="w-2 h-2 bg-gray-300 rounded-full" />
        <div className="w-2 h-2 bg-gray-300 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Zero-fees with your Ryt Card
        </h1>
        <div className="space-y-2 mb-8">
          <p className="text-gray-800">Zero local ATM withdrawal fees.</p>
          <p className="text-gray-800">Zero foreign transaction fees.</p>
        </div>

        {/* Card Display */}
        <div className="relative mb-8">
          <div className="relative w-full aspect-[1.6] transform rotate-[-3deg]">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-300 rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div className="transform -rotate-90 origin-left">
                  <span className="text-white font-semibold text-sm">
                    Ryt Bank
                  </span>
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-md" />
              </div>

              {/* Middle Section */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 transform -rotate-90 origin-left">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-xs font-medium">
                      MyDebit
                    </span>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-white text-lg font-bold">VISA</span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex justify-center">
                <span className="text-blue-600 text-3xl font-bold">Ryt</span>
              </div>
            </div>
          </div>
          <p className="text-right text-xs text-gray-400 mt-2">Terms apply.</p>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg">
          Get Ryt Card
        </button>
      </div>

      <BottomNavigation activeTab="cards" onTabChange={onTabChange} />
    </div>
  );
};
