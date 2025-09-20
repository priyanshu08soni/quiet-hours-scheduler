import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit2 } from "lucide-react";
import EditBlockModal from "./EditBlockModal";

export default function BlockList({ userId }: { userId: string }) {
  const [blocks, setBlocks] = useState<any[]>([]);

  const fetchBlocks = async () => {
    const res = await fetch("/api/blocks?userId=" + userId);
    const data = await res.json();
    setBlocks(data);
  };

  useEffect(() => {
    fetchBlocks();
  }, [userId]);

  const deleteBlock = async (id: string) => {
    if (!confirm("Are you sure you want to delete this block?")) return;
    await fetch("/api/blocks?id=" + id, { method: "DELETE" });
    setBlocks((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.map((block) => (
            <TableRow key={block._id}>
              <TableCell>{block.date}</TableCell>
              <TableCell>{block.startTime}</TableCell>
              <TableCell>{block.endTime}</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <EditBlockModal
                  block={block}
                  onSave={async (updatedBlock) => {
                    await fetch("/api/blocks", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: updatedBlock._id,
                        date: updatedBlock.date,
                        startTime: updatedBlock.startTime,
                        endTime: updatedBlock.endTime,
                      }),
                    });
                    // Refresh table
                    setBlocks((prev) =>
                      prev.map((b) =>
                        b._id === updatedBlock._id ? updatedBlock : b
                      )
                    );
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteBlock(block._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
