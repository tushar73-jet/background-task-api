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

                // randomly fail 20% of the time for demonstration
                const shouldFail = Math.random() < 0.2

                if (shouldFail) {
                    job.status = "failed"
                    job.errorDetails = "Random processing error occurred"
                    console.log(`Job failed: ${job.name}`)
                } else {
                    job.status = "completed"
                    job.result = {
                        output: `Processed ${job.name} successfully`,
                        processedAt: new Date().toISOString()
                    }
                    console.log(`Job completed: ${job.name}`)
                }

                await job.save()
            }
        } catch (error) {
            console.error("Worker error:", error.message)
        }
    }, 2000) // check every 2 seconds
}
