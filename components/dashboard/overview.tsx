"use client"

import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import {
  formatCurrency,
  metrics,
  recentTransactions,
} from "@/lib/accounts-data"

export function Overview() {
  const { t, lang } = useDashboard()

  const cards = [
    {
      key: "assets",
      label: t.totalAssets,
      sub: "Activos / Assets",
      value: metrics.totalAssets,
      delta: metrics.deltas.totalAssets,
      icon: Wallet,
    },
    {
      key: "liabilities",
      label: t.totalLiabilities,
      sub: "Pasivos / Liabilities",
      value: metrics.totalLiabilities,
      delta: metrics.deltas.totalLiabilities,
      icon: Landmark,
    },
    {
      key: "equity",
      label: t.totalEquity,
      sub: "Patrimonio Neto / Equity",
      value: metrics.totalEquity,
      delta: metrics.deltas.totalEquity,
      icon: Scale,
    },
    {
      key: "net",
      label: t.netResult,
      sub: "Resultado / Net Result",
      value: metrics.netResult,
      delta: metrics.deltas.netResult,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics */}
      <section
        aria-label={t.overview}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon
          const positive = card.delta >= 0
          return (
            <Card key={card.key} className="gap-0 py-0">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground/70">
                      {card.sub}
                    </span>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <span className="min-w-0 truncate font-mono text-xl font-semibold tabular-nums tracking-tight">
                    {formatCurrency(card.value, lang)}
                  </span>
                  <span
                    className={cn(
                      "mb-0.5 inline-flex shrink-0 items-center gap-0.5 text-xs font-medium",
                      positive ? "text-credit" : "text-destructive",
                    )}
                  >
                    {positive ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : (
                      <ArrowDownRight className="size-3.5" />
                    )}
                    {Math.abs(card.delta).toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t.vsLastMonth}
                </span>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>{t.recentTransactions}</CardTitle>
          <CardDescription>{t.recentTransactionsSub}</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">{t.date}</TableHead>
                  <TableHead>{t.reference}</TableHead>
                  <TableHead>{t.account}</TableHead>
                  <TableHead>{t.side}</TableHead>
                  <TableHead className="pr-6 text-right">{t.amount}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground tabular-nums">
                      {new Intl.DateTimeFormat(
                        lang === "es" ? "es-AR" : "en-US",
                        { day: "2-digit", month: "short", year: "numeric" },
                      ).format(new Date(tx.date))}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {tx.reference}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {tx.account[lang]}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {tx.accountCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.side === "debit" ? "debit" : "credit"}>
                        {tx.side === "debit" ? t.debit : t.credit}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right font-mono text-sm font-medium tabular-nums">
                      {formatCurrency(tx.amount, lang)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
