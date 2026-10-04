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
            // Legacy support for single-file shares
            if (data.filePath) {
                try {
                    await bucket.file(data.filePath).delete();
                } catch (e) {
                    // Ignore if already deleted
                }
            }

            // New multi-file share support
            const filesSnapshot = await document.ref.collection("files").get();
            for (const fileDoc of filesSnapshot.docs) {
                const fileData = fileDoc.data();
                if (fileData.filePath) {
                    try {
                        await bucket.file(fileData.filePath).delete();
                    } catch (e) {
                        // Ignore
                    }
                }
                await fileDoc.ref.delete();
            }

            await document.ref.delete();

            console.log(`Deleted expired share: ${document.id}`);
        } catch (error) {
            console.error(`Failed to delete share: ${document.id}`, error);
        }
    }
});