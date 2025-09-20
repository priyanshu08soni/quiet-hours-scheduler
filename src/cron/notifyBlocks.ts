// /cron/notifyBlocks.ts
import clientPromise from "../lib/mongodb";
import { sendEmail } from "../utils/email";

export default async function notifyBlocks() {
  try {
    const client = await clientPromise;
    const db = client.db("quiet_hours");
    const collection = db.collection("blocks");

    const now = new Date();
    const tenMinsLater = new Date(now.getTime() + 10 * 60 * 1000);

    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    const targetTime = tenMinsLater.toTimeString().slice(0, 5);
    const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const blocks = await collection.find({
      date: today,
      startTime: { $gte: currentTime, $lte: targetTime },
      notified: false,
    }).toArray();

    for (const block of blocks) {
      if (!block.email) continue;

      try {
        await sendEmail(
          block.email,
          `Reminder: Your quiet hour starts at ${block.startTime} today.`
        );

        await collection.updateOne(
          { _id: block._id },
          { $set: { notified: true } }
        );

        console.log(`✅ Sent email to ${block.email} for block ${block._id}`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${block.email}`, err);
      }
    }
  } catch (error) {
    console.error("Error in notifyBlocks:", error);
  }
}
