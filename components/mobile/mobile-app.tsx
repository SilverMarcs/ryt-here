"use client";

import { useState } from "react";
import { HomeScreen } from "./home-screen";
import { InsightsScreen } from "./insights-screen";
import { ProfileScreen } from "./profile-screen";
import { RewardsScreen } from "./rewards-screen";
import { CardsScreen } from "./cards-screen";
import { type TabType } from "./bottom-navigation";

export function MobileApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onTabChange={handleTabChange} />;
      case "insights":
        return <InsightsScreen onTabChange={handleTabChange} />;
      case "accounts":
        return <ProfileScreen onTabChange={handleTabChange} />;
      case "cards":
        return <CardsScreen onTabChange={handleTabChange} />;
      case "rewards":
        return <RewardsScreen onTabChange={handleTabChange} />;
      default:
        return <HomeScreen onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
}
