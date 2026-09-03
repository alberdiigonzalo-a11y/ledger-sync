"use client"

import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import {
  formatCurrency,
  nodeTotal,
  type AccountNode as AccountNodeType,
} from "@/lib/accounts-data"

interface AccountNodeProps {
  node: AccountNodeType
  depth: number
  expanded: Set<string>
  onToggle: (code: string) => void
}

export function AccountNode({
  node,
  depth,
  expanded,
  onToggle,
}: AccountNodeProps) {
  const { t, lang } = useDashboard()
  const hasChildren = !!node.children?.length
  const isOpen = expanded.has(node.code)
  const total = nodeTotal(node)

  const typeLabel =
    node.type === "heading"
      ? t.heading_type
      : node.type === "account"
        ? t.account_type
        : t.subaccount_type

  return (
    <div>
      <div
        role={hasChildren ? "button" : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onClick={() => hasChildren && onToggle(node.code)}
        onKeyDown={(e) => {
          if (hasChildren && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            onToggle(node.code)
          }
        }}
        aria-expanded={hasChildren ? isOpen : undefined}
        className={cn(
          "group flex items-center gap-3 border-b border-border/60 py-2.5 pr-3 transition-colors",
          hasChildren && "cursor-pointer hover:bg-muted/50",
          node.type === "heading" && "bg-muted/30",
        )}
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !hasChildren && "opacity-0",
            isOpen && "rotate-90",
          )}
        />

        <span className="w-24 shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:w-28 sm:text-sm">
          {node.code}
        </span>

        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            node.type === "heading"
              ? "font-semibold"
              : node.type === "account"
                ? "font-medium"
                : "text-muted-foreground",
          )}
        >
          {node.name[lang]}
        </span>

        <Badge
          variant="outline"
          className="hidden shrink-0 text-[0.7rem] text-muted-foreground md:inline-flex"
        >
          {typeLabel}
        </Badge>

        <Badge
          variant={node.side === "debit" ? "debit" : "credit"}
          className="shrink-0"
        >
          {node.side === "debit" ? t.debit : t.credit}
        </Badge>

        <span className="w-24 shrink-0 text-right font-mono text-xs font-medium tabular-nums sm:w-32 sm:text-sm">
          {formatCurrency(total, lang)}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <AccountNode
              key={child.code}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
