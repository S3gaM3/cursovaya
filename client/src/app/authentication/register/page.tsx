"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box } from "@mui/material";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/authentication/login");
    } else {
      setError("Ошибка при регистрации");
    }
  };

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Регистрация
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleRegister}>
        <TextField
          label="Имя"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Пароль"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </form>

      {/* ✅ Кнопка для перехода обратно на логин */}
      <Typography sx={{ mt: 2 }}>Уже есть аккаунт?</Typography>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => router.push("/authentication/login")}
      >
        Войти
      </Button>
    </Box>
  );
};

export default Register;
