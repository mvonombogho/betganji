'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const mainNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Predictions",
    href: "/predictions",
  },
  {
    title: "Matches",
    href: "/matches",
  },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center space-x-2 md:mr-6">
          <Link href="/dashboard" className="font-bold">
            BetGanji
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}