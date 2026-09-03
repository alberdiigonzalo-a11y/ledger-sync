"use client"

import * as React from "react"
import { LayoutDashboard, ListTree, Moon, Scale, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Overview } from "@/components/dashboard/overview"
import { ChartOfAccounts } from "@/components/dashboard/chart-of-accounts"

type View = "overview" | "accounts"

export function DashboardShell() {
  const { t, lang, toggleLang, theme, toggleTheme } = useDashboard()
  const [view, setView] = React.useState<View>("overview")

  const nav: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: t.overview, icon: LayoutDashboard },
    { key: "accounts", label: t.chartOfAccounts, icon: ListTree },
  ]

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Scale className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{t.appName}</span>
            <span className="text-xs text-muted-foreground">{t.appTagline}</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon
            const active = view === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setView(item.key)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs font-medium text-sidebar-accent-foreground">
              Nexus Corp S.A.
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {lang === "es" ? "Ejercicio 2026" : "Fiscal Year 2026"}
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scale className="size-4" />
            </div>
            <span className="text-sm font-semibold">{t.appName}</span>
          </div>

          <h1 className="hidden text-base font-semibold lg:block">
            {view === "overview" ? t.overview : t.chartOfAccounts}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border p-0.5">
              <button
                type="button"
                onClick={() => lang !== "es" && toggleLang()}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
                  lang === "es"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={lang === "es"}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => lang !== "en" && toggleLang()}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
                  lang === "en"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={lang === "en"}
              >
                EN
              </button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t.lightMode : t.darkMode}
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="border-b border-border px-4 py-2 lg:hidden">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {nav.map((item) => {
              const Icon = item.icon
              const active = view === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setView(item.key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          {view === "overview" ? <Overview /> : <ChartOfAccounts />}
        </main>
      </div>
    </div>
  )
}
