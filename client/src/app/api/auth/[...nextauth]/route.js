import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🟢 Попытка входа:", credentials.email);

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            console.warn("⚠️ Ошибка API /auth/login:", res.status);
            throw new Error("Invalid credentials");
          }

          const user = await res.json();
          console.log("✅ Успешный вход:", user);

          return user;
        } catch (error) {
          console.error("❌ Ошибка авторизации:", error);
          throw new Error("Ошибка сервера");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 дней
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
