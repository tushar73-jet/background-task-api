import cron from "node-cron"
import Job from "../models/Job.js"

export const initCronJobs = () => {
    // Cleanup job: runs every hour
    cron.schedule("0 * * * *", async () => {
        try {
            console.log("Running cleanup job...")
            const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
            const result = await Job.deleteMany({
                status: { $in: ["completed", "failed"] },
                updatedAt: { $lt: threshold }
            })
            console.log(`Cleanup completed: ${result.deletedCount} jobs removed`)
        } catch (error) {
            console.error("Cleanup job error:", error.message)
        }
    })

    console.log("Cron jobs initialized")
}
