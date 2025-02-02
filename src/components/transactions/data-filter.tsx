import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronDown, Filter, Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { useTags } from "@/hooks/useTags";
import { format } from "date-fns";

export interface TransactionFilters {
  categoryIds: number[];
  tagIds: string[];
  amountMin?: number;
  amountMax?: number;
  month?: string; // Format: YYYY-MM
}

interface DataFilterProps {
  value: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function DataFilter({ value, onChange }: DataFilterProps) {
  const { categories } = useExpenseCategories();
  const { tags } = useTags();

  // Generate last 12 months options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy")
    };
  });

  const activeFiltersCount = [
    value.categoryIds.length > 0,
    value.tagIds.length > 0,
    value.amountMin !== undefined || value.amountMax !== undefined,
    value.month !== undefined,
  ].filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[130px] justify-between",
            activeFiltersCount === 0 && "text-muted-foreground"
          )}
        >
          <Filter className="mr-2 h-4 w-4" />
          {activeFiltersCount > 0 ? `${activeFiltersCount} active` : "Filter"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <div className="grid gap-4">
          {/* Month Filter */}
          <div className="space-y-2">
            <Label>Month</Label>
            <div className="grid gap-2">
              {monthOptions.map((month) => (
                <div
                  key={month.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value.month === month.value && "bg-accent"
                  )}
                  onClick={() => {
                    onChange({
                      ...value,
                      month: value.month === month.value ? undefined : month.value,
                    });
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="flex-1">{month.label}</span>
                  {value.month === month.value && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid gap-2 max-h-[200px] overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={value.categoryIds.includes(category.id)}
                      onCheckedChange={(checked) => {
                        onChange({
                          ...value,
                          categoryIds: checked
                            ? [...value.categoryIds, category.id]
                            : value.categoryIds.filter((id) => id !== category.id),
                        });
                      }}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                  {category.sub_categories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center space-x-2 ml-6"
                    >
                      <Checkbox
                        id={`category-${sub.id}`}
                        checked={value.categoryIds.includes(sub.id)}
                        onCheckedChange={(checked) => {
                          onChange({
                            ...value,
                            categoryIds: checked
                              ? [...value.categoryIds, sub.id]
                              : value.categoryIds.filter((id) => id !== sub.id),
                          });
                        }}
                      />
                      <Label
                        htmlFor={`category-${sub.id}`}
                        className="text-sm font-normal text-muted-foreground"
                      >
                        {sub.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="grid gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={value.tagIds.includes(tag.id)}
                    onCheckedChange={(checked) => {
                      onChange({
                        ...value,
                        tagIds: checked
                          ? [...value.tagIds, tag.id]
                          : value.tagIds.filter((id) => id !== tag.id),
                      });
                    }}
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm font-normal"
                  >
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <Label>Amount Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={value.amountMin || ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      amountMin: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={value.amountMax || ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      amountMax: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                onChange({
                  categoryIds: [],
                  tagIds: [],
                  amountMin: undefined,
                  amountMax: undefined,
                  month: undefined,
                })
              }
            >
              Clear Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
