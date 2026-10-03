import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

initializeApp();

const db = getFirestore();
const bucket = getStorage().bucket();

export const deleteExpiredFiles = onSchedule("every 1 minutes", async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const snapshot = await db
        .collection("shares")
        .where("createdAt", "<=", tenMinutesAgo)
        .get();

    for (const document of snapshot.docs) {
        const data = document.data();

        try {
            if (data.filePath) {
                await bucket.file(data.filePath).delete();
            }

            await document.ref.delete();

            console.log(`Deleted expired file: ${data.filePath}`);
        } catch (error) {
            console.error(`Failed to delete: ${data.filePath}`, error);
        }
    }
});