// /pages/api/notifyBlocks.ts
import type { NextApiRequest, NextApiResponse } from "next";
import notifyBlocks from "../../cron/notifyBlocks";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await notifyBlocks(); // run your MongoDB + email logic
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in notifyBlocks API:", error);
    res.status(500).json({ error: "Failed to run notifyBlocks" });
  }
}
