"use client"

import * as React from "react"
import { ChevronRight, ChevronsDownUp, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { AccountNode } from "@/components/dashboard/account-node"
import {
  AddAccountDialog,
  type NewAccountInput,
} from "@/components/dashboard/add-account-dialog"
import {
  chartOfAccounts as initialChart,
  formatCurrency,
  nodeTotal,
  type AccountNode as AccountNodeType,
  type CategoryGroup,
  type CategoryKey,
} from "@/lib/accounts-data"

const categoryAccent: Record<CategoryKey, string> = {
  assets: "bg-chart-1",
  liabilities: "bg-chart-4",
  equity: "bg-chart-5",
  revenue: "bg-chart-2",
  expenses: "bg-chart-3",
}

function matches(node: AccountNodeType, q: string): boolean {
  return (
    node.code.toLowerCase().includes(q) ||
    node.name.es.toLowerCase().includes(q) ||
    node.name.en.toLowerCase().includes(q)
  )
}

function filterNodes(nodes: AccountNodeType[], q: string): AccountNodeType[] {
  if (!q) return nodes
  const result: AccountNodeType[] = []
  for (const node of nodes) {
    const filteredChildren = node.children
      ? filterNodes(node.children, q)
      : undefined
    if (matches(node, q) || (filteredChildren && filteredChildren.length)) {
      result.push({
        ...node,
        children: filteredChildren ?? node.children,
      })
    }
  }
  return result
}

function collectExpandable(nodes: AccountNodeType[], acc: Set<string>) {
  for (const node of nodes) {
    if (node.children?.length) {
      acc.add(node.code)
      collectExpandable(node.children, acc)
    }
  }
}

export function ChartOfAccounts() {
  const { t, lang } = useDashboard()
  const [chart, setChart] = React.useState<CategoryGroup[]>(() =>
    structuredClone(initialChart),
  )
  const [query, setQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<CategoryKey | "all">(
    "all",
  )
  const [expanded, setExpanded] = React.useState<Set<string>>(() => {
    const s = new Set<string>()
    initialChart.forEach((g) => {
      s.add(g.code)
      g.nodes.forEach((n) => n.children?.length && s.add(n.code))
    })
    return s
  })

  const q = query.trim().toLowerCase()

  const categoryLabels: Record<CategoryKey, string> = {
    assets: t.assets,
    liabilities: t.liabilities,
    equity: t.equity,
    revenue: t.revenue,
    expenses: t.expenses,
  }

  const allExpandable = React.useMemo(() => {
    const s = new Set<string>()
    chart.forEach((g) => {
      s.add(g.code)
      collectExpandable(g.nodes, s)
    })
    return s
  }, [chart])

  // When searching, force everything open.
  const effectiveExpanded = q ? allExpandable : expanded

  const toggle = React.useCallback(
    (code: string) => {
      if (q) return
      setExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(code)) next.delete(code)
        else next.add(code)
        return next
      })
    },
    [q],
  )

  const expandAll = () => setExpanded(new Set(allExpandable))
  const collapseAll = () => setExpanded(new Set())

  function handleAdd(account: NewAccountInput) {
    setChart((prev) =>
      prev.map((group) => {
        if (group.key !== account.category) return group
        const newNode: AccountNodeType = {
          code: account.code,
          name: { es: account.name, en: account.name },
          type: account.type,
          side: group.side,
          balance: 0,
        }
        return { ...group, nodes: [...group.nodes, newNode] }
      }),
    )
  }

  const visibleGroups = chart
    .filter((g) => categoryFilter === "all" || g.key === categoryFilter)
    .map((g) => ({ group: g, nodes: filterNodes(g.nodes, q) }))
    .filter(({ nodes }) => nodes.length > 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <InputGroup className="lg:max-w-md">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchAccounts}
            aria-label={t.search}
          />
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as CategoryKey | "all")}
          >
            <SelectTrigger className="w-40" aria-label={t.filterByCategory}>
              <SelectValue>
                {(v: string) =>
                  v === "all"
                    ? t.all
                    : categoryLabels[v as CategoryKey]
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="assets">{t.assets}</SelectItem>
                <SelectItem value="liabilities">{t.liabilities}</SelectItem>
                <SelectItem value="equity">{t.equity}</SelectItem>
                <SelectItem value="revenue">{t.revenue}</SelectItem>
                <SelectItem value="expenses">{t.expenses}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={expandAll} aria-label={t.expandAll} disabled={!!q}>
            <ChevronsUpDown />
          </Button>
          <Button variant="outline" size="icon" onClick={collapseAll} aria-label={t.collapseAll} disabled={!!q}>
            <ChevronsDownUp />
          </Button>

          <AddAccountDialog onAdd={handleAdd} />
        </div>
      </div>

      {/* Category sections */}
      {visibleGroups.length === 0 ? (
        <Empty className="rounded-xl border border-dashed py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>{t.noResults}</EmptyTitle>
            <EmptyDescription>{t.noResultsSub}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleGroups.map(({ group, nodes }) => {
            const total = group.nodes.reduce((a, n) => a + nodeTotal(n), 0)
            const open = effectiveExpanded.has(group.code)
            return (
              <Card key={group.key} className="gap-0 overflow-hidden py-0">
                <button
                  type="button"
                  onClick={() => toggle(group.code)}
                  aria-expanded={open}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors sm:px-5",
                    !q && "hover:bg-muted/40",
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform",
                      open && "rotate-90",
                    )}
                  />
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      categoryAccent[group.key],
                    )}
                    aria-hidden
                  />
                  <span className="font-mono text-sm font-semibold tabular-nums text-muted-foreground">
                    {group.code}
                  </span>
                  <span className="text-sm font-semibold">
                    {categoryLabels[group.key]}
                  </span>
                  <Badge
                    variant={group.side === "debit" ? "debit" : "credit"}
                    className="ml-1"
                  >
                    {group.side === "debit" ? t.debit : t.credit}
                  </Badge>
                  <span className="ml-auto font-mono text-sm font-semibold tabular-nums">
                    {formatCurrency(total, lang)}
                  </span>
                </button>

                {open && (
                  <div className="border-t border-border">
                    {nodes.map((node) => (
                      <AccountNode
                        key={node.code}
                        node={node}
                        depth={1}
                        expanded={effectiveExpanded}
                        onToggle={toggle}
                      />
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
