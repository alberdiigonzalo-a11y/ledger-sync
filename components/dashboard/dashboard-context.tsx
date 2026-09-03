"use client"

import * as React from "react"
import { getDict, type Dict, type Lang } from "@/lib/i18n"

type Theme = "light" | "dark"

interface DashboardContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  t: Dict
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("es")
  const [theme, setThemeState] = React.useState<Theme>("light")

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    const root = document.documentElement
    root.classList.toggle("dark", next === "dark")
    root.classList.toggle("light", next === "light")
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const toggleLang = React.useCallback(() => {
    setLang((prev) => (prev === "es" ? "en" : "es"))
  }, [])

  const value = React.useMemo<DashboardContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      theme,
      setTheme,
      toggleTheme,
      t: getDict(lang),
    }),
    [lang, theme, setTheme, toggleTheme, toggleLang],
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = React.useContext(DashboardContext)
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return ctx
}
