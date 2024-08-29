import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import User from "@models/user"
import { connectToDB } from "@utils/database"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session ({ session }) {
      try {
        await connectToDB()
        // Temukan pengguna berdasarkan email dari session
        const sessionUser = await User.findOne({ email: session.user.email })
        if (sessionUser) {
          session.user.id = sessionUser._id.toString()
        }
        return session
      } catch (error) {
        console.error("Error fetching user for session:", error)
        return session
      }
    },
    async signIn ({ profile }) {
      try {
        await connectToDB()

        // Periksa apakah pengguna sudah ada
        const userExist = await User.findOne({ email: profile.email })

        // Jika tidak ada, buat pengguna baru
        if (!userExist) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/ /g, "").toLowerCase(),
            image: profile.picture,
          })
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
  },
})

export { handler as GET, handler as POST }