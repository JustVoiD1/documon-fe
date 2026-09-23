"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconMoon, IconSun } from "@tabler/icons-react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => setTheme((theme === "light") ? "dark" : "light")
    return (
        <Button onClick={toggleTheme}>
            {theme === "light" ? <IconSun /> : <IconMoon />}
        </Button>
    )
}
