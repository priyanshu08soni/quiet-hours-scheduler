import clientPromise from "../lib/mongodb";
import { sendEmail } from "../utils/email";

export default async function notifyBlocks() {
  const client = await clientPromise;
  const db = client.db("quiet_hours");
  const now = new Date();
  const tenMinsLater = new Date(now.getTime() + 10 * 60000);

  const blocks = await db.collection("blocks").find({
    startTime: { $gte: now.toISOString(), $lte: tenMinsLater.toISOString() }
  }).toArray();

  for (const block of blocks) {
    await sendEmail(block.userId, `Your quiet time starts at ${block.startTime}`);
  }
}