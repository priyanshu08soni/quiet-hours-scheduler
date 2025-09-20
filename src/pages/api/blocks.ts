import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // service role key for server-side requests
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("quiet_hours");
  const collection = db.collection("blocks");

  // CREATE
  if (req.method === "POST") {
    const { userId, date, startTime, endTime } = req.body;

    // Fetch user email from Supabase
    const { data: user, error } = await supabase
      .from("users") // replace with your Supabase users table name
      .select("email")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(400).json({ success: false, message: "User not found in Supabase" });
    }

    const email = user.email;

    // Store UTC for scheduling
    const startTimeUTC = new Date(`${date}T${startTime}:00Z`).toISOString();
    const endTimeUTC = new Date(`${date}T${endTime}:00Z`).toISOString();

    const result = await collection.insertOne({
      userId,
      email, // save fetched email
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

  // Other CRUD operations...
  if (req.method === "GET") {
    const { userId } = req.query;
    const blocks = await collection.find({ userId }).toArray();
    return res.json(blocks);
  }

  if (req.method === "PUT") {
    const { id, date, startTime, endTime } = req.body;
    const startTimeUTC = new Date(`${date}T${startTime}:00Z`).toISOString();
    const endTimeUTC = new Date(`${date}T${endTime}:00Z`).toISOString();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { date, startTime, endTime, startTimeUTC, endTimeUTC, notified: false } }
    );

    return res.json({ success: result.modifiedCount > 0 });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const result = await collection.deleteOne({ _id: new ObjectId(id as string) });
    return res.json({ success: result.deletedCount > 0 });
  }

  res.status(405).end();
}
