import Job from "../models/Job.js"

export const processQueue = async () => {
    console.log("Worker started...")

    setInterval(async () => {
        try {
            const job = await Job.findOne({ status: "pending" })

            if (job) {
                console.log(`Processing job: ${job.name}`)

                // simulate work
                await new Promise(resolve => setTimeout(resolve, 5000))

                job.status = "completed"
                await job.save()

                console.log(`Job completed: ${job.name}`)
            }
        } catch (error) {
            console.error("Worker error:", error.message)
        }
    }, 2000) // check every 2 seconds
}
