import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock } from "lucide-react";
import { Plus } from "lucide-react";
import DatePicker from "./DatePicker";
import TimePicker from "./TImePicker";
export default function BlockForm({ userId }: { userId: string }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    setStartTime(`${hh}:${min}`);

    const endHour = String((now.getHours() + 1) % 24).padStart(2, "0");
    setEndTime(`${endHour}:${min}`);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, date, startTime, endTime }),
    });

    // Reset times to now + 1 hour
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    setStartTime(`${hh}:${min}`);
    const endHour = String((now.getHours() + 1) % 24).padStart(2, "0");
    setEndTime(`${endHour}:${min}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Quiet Hour</h3>
      <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={handleSubmit}>
      <DatePicker date={date} setDate={setDate} />
        <TimePicker time={startTime} setTime={setStartTime} />
        <TimePicker time={endTime} setTime={setEndTime} />
        {/* Submit Button */}
        <Button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white shadow-md"
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </form>
    </div>
  );
}
