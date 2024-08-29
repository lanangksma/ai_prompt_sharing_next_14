import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
  mongoose.set("strictQuery", true)

  if (isConnected) {
    console.log("Connected to DB")
    return
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true
    console.log("Connected to DB")
  } catch (e) {
    console.error("Database Error", e)
  }
}