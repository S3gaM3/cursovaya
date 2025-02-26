"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📤 Отправляем данные на вход:", { email, password });

    const result = await signIn("credentials", {
      redirect: false, // ✅ Отключаем авто-редирект NextAuth
      email,
      password,
      callbackUrl: "/", // ✅ Указываем, куда редиректить после входа
    });

    if (result?.error) {
      console.warn("⚠️ Ошибка входа:", result.error);
      setError("Неверные учетные данные");
    } else {
      console.log("✅ Вход успешен! Перенаправляем...");
      router.push(result.url || "/"); // ✅ Перенаправляем вручную
    }
  };

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
        <Typography sx={{ mt: 2 }}>Еще нет аккаунта?</Typography>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => router.push("/authentication/register")}
      >
        Зарегистрироваться
      </Button>
      </form>
    </Box>
  );
};

export default Login;
