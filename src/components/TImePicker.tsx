"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function TimePicker({ time, setTime }: { time: string; setTime: (t: string) => void }) {
  const [open, setOpen] = React.useState(false);

  // Generate 30-min interval times
  const times = Array.from({ length: 24 * 2 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start pl-3 py-2 flex items-center gap-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <Clock className="w-5 h-5 text-gray-400" />
          {time || "Select Time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-2 rounded-lg shadow-lg">
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTime(t);
                setOpen(false);
              }}
              className="text-left px-2 py-1 hover:bg-blue-100 rounded-md"
            >
              {t}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
