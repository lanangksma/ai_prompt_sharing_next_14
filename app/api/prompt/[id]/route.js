import Prompt from "@models/prompt"
import { connectToDB } from "@utils/database"

export const GET = async (request, { params }) => {
  try {
    await connectToDB()

    const prompt = await Prompt.findById(params.id).populate("creator")
    if (!prompt) return new Response("Prompt Not Found", { status: 404 })

    return new Response(JSON.stringify(prompt), { status: 200 })

  } catch (error) {
    return new Response("Internal Server Error", { status: 500 })
  }
}

export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json()

  try {
    await connectToDB()

    const existingPrompt = await Prompt.findById(params.id)

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 })
    }

    existingPrompt.prompt = prompt
    existingPrompt.tag = tag

    await existingPrompt.save()

    return new Response("Successfully updated the Prompts", { status: 200 })
  } catch (error) {
    return new Response("Error Updating Prompt", { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  // console.log("Deleting prompt with ID:", params.id) // Debugging
  try {
    await connectToDB()

    const result = await Prompt.findByIdAndDelete(params.id)
    if (!result) {
      return new Response("Prompt not found", { status: 404 })
    }

    return new Response("Prompt deleted successfully", { status: 200 })
  } catch (error) {
    // console.error("Error deleting prompt:", error) // Debugging
    return new Response("Error deleting prompt", { status: 500 })
  }
}