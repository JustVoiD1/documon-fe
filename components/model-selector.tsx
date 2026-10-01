import { IconChevronDown, IconGlobe } from "@tabler/icons-react";
import { DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function ModelSelector({ isBusy }: { isBusy: boolean }) {
    return <DropdownMenuTrigger
        render={
            <button
                type="button"
                disabled={isBusy}
                className="h-9 px-3.5 rounded-full bg-secondary/80 hover:bg-secondary flex items-center gap-1.5 text-xs font-medium text-foreground transition-all border border-border/30"
            >
                <IconGlobe className="h-3.5 w-3.5 text-muted-foreground" />
                <span>GPT-5.4</span>
                <IconChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
            </button>
        }
    />
}