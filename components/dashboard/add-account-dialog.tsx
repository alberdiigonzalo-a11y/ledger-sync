"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import type {
  AccountType,
  CategoryKey,
  Side,
} from "@/lib/accounts-data"

export interface NewAccountInput {
  code: string
  name: string
  category: CategoryKey
  type: AccountType
}

interface AddAccountDialogProps {
  onAdd: (account: NewAccountInput) => void
}

// Normal balance side per category.
const categorySide: Record<CategoryKey, Side> = {
  assets: "debit",
  liabilities: "credit",
  equity: "credit",
  revenue: "credit",
  expenses: "debit",
}

export function AddAccountDialog({ onAdd }: AddAccountDialogProps) {
  const { t } = useDashboard()
  const [open, setOpen] = React.useState(false)
  const [code, setCode] = React.useState("")
  const [name, setName] = React.useState("")
  const [category, setCategory] = React.useState<CategoryKey | "">("")
  const [type, setType] = React.useState<AccountType | "">("")

  const categoryOptions: { value: CategoryKey; label: string }[] = [
    { value: "assets", label: t.assets },
    { value: "liabilities", label: t.liabilities },
    { value: "equity", label: t.equity },
    { value: "revenue", label: t.revenue },
    { value: "expenses", label: t.expenses },
  ]

  const typeOptions: { value: AccountType; label: string }[] = [
    { value: "heading", label: t.heading_type },
    { value: "account", label: t.account_type },
    { value: "subaccount", label: t.subaccount_type },
  ]

  const valid = code.trim() && name.trim() && category && type

  function reset() {
    setCode("")
    setName("")
    setCategory("")
    setType("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onAdd({
      code: code.trim(),
      name: name.trim(),
      category: category as CategoryKey,
      type: type as AccountType,
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus data-icon="inline-start" />
            {t.addAccount}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.addAccountTitle}</DialogTitle>
          <DialogDescription>{t.addAccountDesc}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="add-account-form">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="account-code">{t.code}</FieldLabel>
                <Input
                  id="account-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t.codePlaceholder}
                  className="font-mono"
                  autoComplete="off"
                />
              </Field>

              <Field>
                <FieldLabel>{t.category}</FieldLabel>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as CategoryKey)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.selectCategory}>
                      {(v: string) =>
                        categoryOptions.find((o) => o.value === v)?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="account-name">{t.name}</FieldLabel>
              <Input
                id="account-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                autoComplete="off"
              />
            </Field>

            <Field>
              <FieldLabel>{t.type}</FieldLabel>
              <Select
                value={type}
                onValueChange={(v) => setType(v as AccountType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t.selectType}>
                    {(v: string) =>
                      typeOptions.find((o) => o.value === v)?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {category && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                <span>{t.side}:</span>
                <Badge
                  variant={
                    categorySide[category as CategoryKey] === "debit"
                      ? "debit"
                      : "credit"
                  }
                >
                  {categorySide[category as CategoryKey] === "debit"
                    ? t.debit
                    : t.credit}
                </Badge>
              </div>
            )}
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.cancel}
          </DialogClose>
          <Button type="submit" form="add-account-form" disabled={!valid}>
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
