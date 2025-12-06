import { FormEvent } from "react";
import { SendHorizonal, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  onQuickActionsClick?: () => void;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  onQuickActionsClick,
}: ChatInputProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="flex items-center gap-2 mx-2"
    >
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={onQuickActionsClick}
        aria-label="Quick actions"
        className="transition-all hover:scale-105 active:scale-95"
      >
        <Zap className="h-4 w-4" />
      </Button>
      <Input
        placeholder="I am Ryt Here..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        variant="secondary"
        disabled={disabled || !value.trim()}
      >
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  );
};
