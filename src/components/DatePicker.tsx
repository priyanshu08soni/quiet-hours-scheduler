"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"; // or correct path
import { Button } from "./ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DatePicker({ date, setDate }: { date: string; setDate: (d: string) => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full justify-start pl-3 py-2 flex items-center gap-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          {date || "Select Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
        <DayPicker
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(selected) => {
            if (selected) {
              const yyyy = selected.getFullYear();
              const mm = String(selected.getMonth() + 1).padStart(2, "0");
              const dd = String(selected.getDate()).padStart(2, "0");
              setDate(`${yyyy}-${mm}-${dd}`);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
