type RoundButtonProps = {
  icon: React.ReactNode;
  label: string;
};

export const RoundButton = ({ icon, label }: RoundButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
        {icon}
      </button>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};
