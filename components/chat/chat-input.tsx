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
                // className="bg-white/10 backdrop-blur-md border border-white/20 text-white/60 hover:bg-white/20"
            >
                <Zap className="h-4 w-4" />
            </Button>
            <Input
                placeholder="I am Ryt Here..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 focus-visible:border-white/40 focus-visible:ring-white/20"
            />
            <Button
                type="submit"
                size="icon"
                variant="secondary"
                disabled={disabled || !value.trim()}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
            >
                <SendHorizonal className="h-4 w-4" />
            </Button>
        </form>
    );
};
