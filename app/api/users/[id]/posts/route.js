import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()

    const prompts = await Prompt.find({
      ceator: params.id,
    }).populate("creator")

    return new Response(JSON.stringify(prompts), { status: 200 })
  } catch (error) {
    return new Response("Failed To Fetch All Prompts", { status: 500 })
  }
}