import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function FilterCombobox({
  options = [],
  value = "",
  onValueChange = () => {},
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Không tìm thấy."
}) {
  const [open, setOpen] = React.useState(false)
  const selectedLabel = options.find((option) => option.value === value)?.label

  const handleSelect = (optionValue) => {
    onValueChange(optionValue === value ? "" : optionValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-2 transition-all duration-200 font-medium",
            open 
              ? "bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600 text-white shadow-lg shadow-slate-800" 
              : "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500"
          )}
        >
          <span className={cn(
            "truncate font-semibold",
            selectedLabel ? "text-white" : "text-slate-400"
          )}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className={cn(
            "ml-2 h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400",
            open && "rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-900 border-2 border-slate-700 shadow-xl shadow-slate-800 rounded-lg">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="border-b-2 border-slate-700 h-10 bg-slate-900 text-white placeholder:text-slate-500"
          />
          <CommandList className="max-h-[280px]">
            <CommandEmpty className="py-6 text-center text-sm text-slate-400 font-medium">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    "mx-1 my-1 transition-all duration-150",
                    value === option.value
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold"
                      : "text-slate-200 hover:bg-gradient-to-r hover:from-red-600/50 hover:to-red-500/50 hover:text-white"
                  )}
                >
                  <span className="flex-1">{option.label}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0 transition-all",
                      value === option.value 
                        ? "opacity-100 text-white font-bold" 
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
