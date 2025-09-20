// /cron/notifyBlocks.ts
import clientPromise from "../lib/mongodb";
import { sendEmail } from "../utils/email";
import { ObjectId } from "mongodb";

export default async function notifyBlocks() {
  try {
    const client = await clientPromise;
    const db = client.db("quiet_hours");
    const collection = db.collection("blocks");

    const nowUTC = new Date();
    const tenMinsLaterUTC = new Date(nowUTC.getTime() + 10 * 60 * 1000);

    // Find blocks that start in the next 10 minutes and haven't been notified
    const blocks = await collection.find({
      startTimeUTC: { $gte: nowUTC, $lte: tenMinsLaterUTC },
      notified: false,
    }).toArray();

    for (const block of blocks) {
      if (!block.email) {
        console.warn(`Block ${block._id} has no email, skipping.`);
        continue;
      }

      try {
        // Send reminder email
        await sendEmail(
          block.email,
          `Reminder: Your quiet hour starts at ${new Date(block.startTimeUTC).toLocaleTimeString(
            "en-IN",
            { hour: "2-digit", minute: "2-digit" }
          )} today.`
        );

        // Mark as notified
        await collection.updateOne(
          { _id: new ObjectId(block._id) },
          { $set: { notified: true } }
        );

        console.log(`✅ Sent email to ${block.email} for block ${block._id}`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${block.email}`, err);
      }
    }

    console.log(`Checked ${blocks.length} blocks at ${nowUTC.toISOString()}`);
  } catch (error) {
    console.error("Error in notifyBlocks:", error);
  }
}
