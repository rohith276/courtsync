"use client"

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "All",
  STARTERS: "Starters",
  MAINS: "Mains",
  BOWLS: "Bowls",
  BEVERAGES: "Beverages",
  DESSERTS: "Desserts",
  QUICK_BITES: "Quick Bites",
}

interface CategoryBarProps {
  categories: string[]
  selected: string
  onSelect: (cat: string) => void
}

export function CategoryBar({ categories, selected, onSelect }: CategoryBarProps) {
  const all = ["ALL", ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-all whitespace-nowrap ${
            selected === cat
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          }`}
        >
          {CATEGORY_LABELS[cat] || cat}
        </button>
      ))}
    </div>
  )
}
