"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "./DatePicker";
import TimePicker from "./TImePicker";
import { Edit2 } from "lucide-react";

interface EditBlockModalProps {
  block: any;
  onSave: (updatedBlock: any) => void;
}

export default function EditBlockModal({ block, onSave }: EditBlockModalProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(block.date);
  const [startTime, setStartTime] = React.useState(block.startTime);
  const [endTime, setEndTime] = React.useState(block.endTime);

  const handleSave = () => {
    onSave({ ...block, date, startTime, endTime });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2  className="w-4 h-4 text-yellow-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Quiet Hour</DialogTitle>
          <DialogDescription>Change date and time for this block</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <DatePicker date={date} setDate={setDate} />
          <TimePicker time={startTime} setTime={setStartTime} />
          <TimePicker time={endTime} setTime={setEndTime} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
