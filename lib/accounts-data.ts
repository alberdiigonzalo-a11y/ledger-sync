export type CategoryKey =
  | "assets"
  | "liabilities"
  | "equity"
  | "revenue"
  | "expenses"

export type Side = "debit" | "credit"

export type AccountType = "heading" | "account" | "subaccount"

export interface AccountNode {
  code: string
  name: { es: string; en: string }
  type: AccountType
  side: Side
  balance?: number
  children?: AccountNode[]
}

export interface CategoryGroup {
  key: CategoryKey
  code: string
  side: Side
  nodes: AccountNode[]
}

// Normal balance side per category:
// Assets & Expenses -> Debit (Debe) | Liabilities, Equity, Revenue -> Credit (Haber)
export const chartOfAccounts: CategoryGroup[] = [
  {
    key: "assets",
    code: "1",
    side: "debit",
    nodes: [
      {
        code: "1.1",
        name: { es: "Activo Corriente", en: "Current Assets" },
        type: "heading",
        side: "debit",
        children: [
          {
            code: "1.1.01",
            name: { es: "Caja y Bancos", en: "Cash and Banks" },
            type: "account",
            side: "debit",
            children: [
              { code: "1.1.01.001", name: { es: "Caja en Pesos", en: "Cash on Hand" }, type: "subaccount", side: "debit", balance: 184500 },
              { code: "1.1.01.002", name: { es: "Banco Cuenta Corriente", en: "Bank Checking Account" }, type: "subaccount", side: "debit", balance: 1245900 },
              { code: "1.1.01.003", name: { es: "Banco Caja de Ahorro USD", en: "Bank Savings USD" }, type: "subaccount", side: "debit", balance: 962300 },
            ],
          },
          {
            code: "1.1.02",
            name: { es: "Créditos por Ventas", en: "Trade Receivables" },
            type: "account",
            side: "debit",
            children: [
              { code: "1.1.02.001", name: { es: "Deudores por Ventas", en: "Accounts Receivable" }, type: "subaccount", side: "debit", balance: 738400 },
              { code: "1.1.02.002", name: { es: "Documentos a Cobrar", en: "Notes Receivable" }, type: "subaccount", side: "debit", balance: 214000 },
            ],
          },
          {
            code: "1.1.03",
            name: { es: "Bienes de Cambio", en: "Inventory" },
            type: "account",
            side: "debit",
            children: [
              { code: "1.1.03.001", name: { es: "Mercaderías", en: "Merchandise" }, type: "subaccount", side: "debit", balance: 512700 },
            ],
          },
        ],
      },
      {
        code: "1.2",
        name: { es: "Activo No Corriente", en: "Non-Current Assets" },
        type: "heading",
        side: "debit",
        children: [
          {
            code: "1.2.01",
            name: { es: "Bienes de Uso", en: "Property & Equipment" },
            type: "account",
            side: "debit",
            children: [
              { code: "1.2.01.001", name: { es: "Rodados", en: "Vehicles" }, type: "subaccount", side: "debit", balance: 890000 },
              { code: "1.2.01.002", name: { es: "Muebles y Útiles", en: "Furniture & Fixtures" }, type: "subaccount", side: "debit", balance: 176500 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "liabilities",
    code: "2",
    side: "credit",
    nodes: [
      {
        code: "2.1",
        name: { es: "Pasivo Corriente", en: "Current Liabilities" },
        type: "heading",
        side: "credit",
        children: [
          {
            code: "2.1.01",
            name: { es: "Deudas Comerciales", en: "Trade Payables" },
            type: "account",
            side: "credit",
            children: [
              { code: "2.1.01.001", name: { es: "Proveedores", en: "Suppliers" }, type: "subaccount", side: "credit", balance: 623400 },
              { code: "2.1.01.002", name: { es: "Documentos a Pagar", en: "Notes Payable" }, type: "subaccount", side: "credit", balance: 158000 },
            ],
          },
          {
            code: "2.1.02",
            name: { es: "Deudas Fiscales", en: "Tax Payables" },
            type: "account",
            side: "credit",
            children: [
              { code: "2.1.02.001", name: { es: "IVA a Pagar", en: "VAT Payable" }, type: "subaccount", side: "credit", balance: 142900 },
              { code: "2.1.02.002", name: { es: "Impuesto a las Ganancias", en: "Income Tax Payable" }, type: "subaccount", side: "credit", balance: 208600 },
            ],
          },
        ],
      },
      {
        code: "2.2",
        name: { es: "Pasivo No Corriente", en: "Non-Current Liabilities" },
        type: "heading",
        side: "credit",
        children: [
          {
            code: "2.2.01",
            name: { es: "Préstamos Bancarios", en: "Bank Loans" },
            type: "account",
            side: "credit",
            children: [
              { code: "2.2.01.001", name: { es: "Préstamo Hipotecario", en: "Mortgage Loan" }, type: "subaccount", side: "credit", balance: 1120000 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "equity",
    code: "3",
    side: "credit",
    nodes: [
      {
        code: "3.1",
        name: { es: "Capital", en: "Capital" },
        type: "heading",
        side: "credit",
        children: [
          {
            code: "3.1.01",
            name: { es: "Capital Social", en: "Share Capital" },
            type: "account",
            side: "credit",
            children: [
              { code: "3.1.01.001", name: { es: "Aportes de los Socios", en: "Shareholder Contributions" }, type: "subaccount", side: "credit", balance: 1500000 },
            ],
          },
        ],
      },
      {
        code: "3.2",
        name: { es: "Resultados", en: "Retained Earnings" },
        type: "heading",
        side: "credit",
        children: [
          {
            code: "3.2.01",
            name: { es: "Resultados Acumulados", en: "Accumulated Results" },
            type: "account",
            side: "credit",
            children: [
              { code: "3.2.01.001", name: { es: "Resultados No Asignados", en: "Unappropriated Earnings" }, type: "subaccount", side: "credit", balance: 812900 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "revenue",
    code: "4",
    side: "credit",
    nodes: [
      {
        code: "4.1",
        name: { es: "Ingresos Operativos", en: "Operating Revenue" },
        type: "heading",
        side: "credit",
        children: [
          {
            code: "4.1.01",
            name: { es: "Ventas", en: "Sales" },
            type: "account",
            side: "credit",
            children: [
              { code: "4.1.01.001", name: { es: "Ventas de Mercaderías", en: "Merchandise Sales" }, type: "subaccount", side: "credit", balance: 3480000 },
              { code: "4.1.01.002", name: { es: "Ventas de Servicios", en: "Service Sales" }, type: "subaccount", side: "credit", balance: 1260000 },
            ],
          },
        ],
      },
      {
        code: "4.2",
        name: { es: "Ingresos Financieros", en: "Financial Income" },
        type: "heading",
        side: "credit",
        children: [
          {
            code: "4.2.01",
            name: { es: "Intereses Ganados", en: "Interest Earned" },
            type: "account",
            side: "credit",
            children: [
              { code: "4.2.01.001", name: { es: "Intereses por Plazo Fijo", en: "Time Deposit Interest" }, type: "subaccount", side: "credit", balance: 96500 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "expenses",
    code: "5",
    side: "debit",
    nodes: [
      {
        code: "5.1",
        name: { es: "Costos", en: "Cost of Sales" },
        type: "heading",
        side: "debit",
        children: [
          {
            code: "5.1.01",
            name: { es: "Costo de Mercaderías Vendidas", en: "Cost of Goods Sold" },
            type: "account",
            side: "debit",
            children: [
              { code: "5.1.01.001", name: { es: "CMV", en: "COGS" }, type: "subaccount", side: "debit", balance: 1890000 },
            ],
          },
        ],
      },
      {
        code: "5.2",
        name: { es: "Gastos Operativos", en: "Operating Expenses" },
        type: "heading",
        side: "debit",
        children: [
          {
            code: "5.2.01",
            name: { es: "Gastos de Administración", en: "Administrative Expenses" },
            type: "account",
            side: "debit",
            children: [
              { code: "5.2.01.001", name: { es: "Sueldos y Jornales", en: "Salaries & Wages" }, type: "subaccount", side: "debit", balance: 640000 },
              { code: "5.2.01.002", name: { es: "Alquileres", en: "Rent" }, type: "subaccount", side: "debit", balance: 185000 },
              { code: "5.2.01.003", name: { es: "Servicios Públicos", en: "Utilities" }, type: "subaccount", side: "debit", balance: 72400 },
            ],
          },
          {
            code: "5.2.02",
            name: { es: "Gastos de Comercialización", en: "Selling Expenses" },
            type: "account",
            side: "debit",
            children: [
              { code: "5.2.02.001", name: { es: "Publicidad", en: "Advertising" }, type: "subaccount", side: "debit", balance: 128000 },
            ],
          },
        ],
      },
    ],
  },
]

export interface Transaction {
  id: string
  date: string
  reference: string
  accountCode: string
  account: { es: string; en: string }
  category: CategoryKey
  side: Side
  amount: number
}

export const recentTransactions: Transaction[] = [
  { id: "t1", date: "2026-08-31", reference: "AS-004821", accountCode: "1.1.01.002", account: { es: "Banco Cuenta Corriente", en: "Bank Checking Account" }, category: "assets", side: "debit", amount: 245000 },
  { id: "t2", date: "2026-08-30", reference: "AS-004820", accountCode: "4.1.01.001", account: { es: "Ventas de Mercaderías", en: "Merchandise Sales" }, category: "revenue", side: "credit", amount: 245000 },
  { id: "t3", date: "2026-08-29", reference: "AS-004818", accountCode: "5.2.01.001", account: { es: "Sueldos y Jornales", en: "Salaries & Wages" }, category: "expenses", side: "debit", amount: 96000 },
  { id: "t4", date: "2026-08-28", reference: "AS-004815", accountCode: "2.1.01.001", account: { es: "Proveedores", en: "Suppliers" }, category: "liabilities", side: "credit", amount: 132400 },
  { id: "t5", date: "2026-08-27", reference: "AS-004811", accountCode: "1.1.02.001", account: { es: "Deudores por Ventas", en: "Accounts Receivable" }, category: "assets", side: "debit", amount: 78900 },
  { id: "t6", date: "2026-08-26", reference: "AS-004809", accountCode: "5.2.02.001", account: { es: "Publicidad", en: "Advertising" }, category: "expenses", side: "debit", amount: 41000 },
  { id: "t7", date: "2026-08-25", reference: "AS-004804", accountCode: "2.1.02.001", account: { es: "IVA a Pagar", en: "VAT Payable" }, category: "liabilities", side: "credit", amount: 51450 },
  { id: "t8", date: "2026-08-24", reference: "AS-004801", accountCode: "4.2.01.001", account: { es: "Intereses por Plazo Fijo", en: "Time Deposit Interest" }, category: "revenue", side: "credit", amount: 18600 },
]

function sumLeaves(nodes: AccountNode[]): number {
  return nodes.reduce((acc, node) => {
    if (node.children?.length) return acc + sumLeaves(node.children)
    return acc + (node.balance ?? 0)
  }, 0)
}

export function categoryTotal(key: CategoryKey): number {
  const group = chartOfAccounts.find((g) => g.key === key)
  return group ? sumLeaves(group.nodes) : 0
}

export function nodeTotal(node: AccountNode): number {
  if (node.children?.length) return sumLeaves(node.children)
  return node.balance ?? 0
}

export const metrics = {
  totalAssets: categoryTotal("assets"),
  totalLiabilities: categoryTotal("liabilities"),
  totalEquity: categoryTotal("equity"),
  netResult: categoryTotal("revenue") - categoryTotal("expenses"),
  deltas: {
    totalAssets: 4.2,
    totalLiabilities: -1.8,
    totalEquity: 2.6,
    netResult: 8.9,
  },
}

export function formatCurrency(value: number, lang: "es" | "en"): string {
  const locale = lang === "es" ? "es-AR" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}
