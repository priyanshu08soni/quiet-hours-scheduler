import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { supabaseServer } from "../../lib/supabaseServer"; // server-side client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("quiet_hours");
  const collection = db.collection("blocks");

  try {
    if (req.method === "POST") {
      const { userId, date, startTime, endTime } = req.body;

      if (!userId || !date || !startTime || !endTime) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      // Fetch user email using service role key (bypasses RLS)
      // Fetch user email from Supabase Auth
      const { data: user, error } = await supabaseServer
        .from("auth.users")
        .select("email")
        .eq("id", userId)
        .single();

      if (error || !user) {
        console.error("Supabase fetch error:", error);
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      const email = user.email;

      const startTimeUTC = new Date(`${date}T${startTime}:00Z`).toISOString();
      const endTimeUTC = new Date(`${date}T${endTime}:00Z`).toISOString();

      const result = await collection.insertOne({
        userId,
        email,
        date,
        startTime,
        endTime,
        startTimeUTC,
        endTimeUTC,
        notified: false,
        createdAt: new Date(),
      });

      return res.status(201).json({ success: true, id: result.insertedId });
    }

    // GET blocks
    if (req.method === "GET") {
      const { userId } = req.query;
      if (!userId)
        return res
          .status(400)
          .json({ success: false, message: "Missing userId" });

      const blocks = await collection.find({ userId }).toArray();
      return res.json(blocks);
    }

    // UPDATE block
    if (req.method === "PUT") {
      const { id, date, startTime, endTime } = req.body;
      if (!id || !date || !startTime || !endTime)
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });

      const startTimeUTC = new Date(`${date}T${startTime}:00Z`).toISOString();
      const endTimeUTC = new Date(`${date}T${endTime}:00Z`).toISOString();

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            date,
            startTime,
            endTime,
            startTimeUTC,
            endTimeUTC,
            notified: false,
          },
        }
      );

      return res.json({ success: result.modifiedCount > 0 });
    }

    // DELETE block
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id)
        return res
          .status(400)
          .json({ success: false, message: "Missing block id" });

      const result = await collection.deleteOne({
        _id: new ObjectId(id as string),
      });
      return res.json({ success: result.deletedCount > 0 });
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (err) {
    console.error("Error handling request:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
