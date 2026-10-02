"use client"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { IconMoon, IconSun } from "@tabler/icons-react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => setTheme((theme === "light") ? "dark" : "light")
    return (
        <Button variant={'ghost'} onClick={toggleTheme}>
            {theme === "light" ? <IconSun /> : <IconMoon />}
        </Button>
    )
}
