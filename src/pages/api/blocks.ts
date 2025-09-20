import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("quiet_hours");
  const collection = db.collection("blocks");

  // CREATE
  if (req.method === "POST") {
    const { userId, date, startTime, endTime } = req.body;
    const result = await collection.insertOne({ userId, date, startTime, endTime, createdAt: new Date() });
    return res.json({ success: true, id: result.insertedId });
  }

  // READ
  if (req.method === "GET") {
    const { userId } = req.query;
    const blocks = await collection.find({ userId }).toArray();
    return res.json(blocks);
  }

  // UPDATE (Edit)
  if (req.method === "PUT") {
    const { id, date, startTime, endTime } = req.body;
    const { ObjectId } = require("mongodb");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { date, startTime, endTime } }
    );
    return res.json({ success: result.modifiedCount > 0 });
  }

  // DELETE
  if (req.method === "DELETE") {
    const { id } = req.query;
    const { ObjectId } = require("mongodb");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return res.json({ success: result.deletedCount > 0 });
  }

  res.status(405).end();
}
