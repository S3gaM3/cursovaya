import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface LoginProps {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin: React.FC<LoginProps> = ({ title, subtitle, subtext }) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // Указан тип `string`
  const [password, setPassword] = useState<string>(""); // Указан тип `string`
  const [error, setError] = useState<string>(""); // Указан тип `string`

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // ✅ Явное указание типа
    e.preventDefault();
    setError("");

    console.log("🔍 Попытка входа:", { email, password });

    try {
      // 🔹 Отправляем запрос на сервер
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Добавлено
        body: JSON.stringify({ email, password }),
      });
      

      const data = await res.json();
      console.log("🟢 Ответ сервера:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); // ✅ Сохранение токена
        console.log("✅ Токен сохранен:", localStorage.getItem("token"));

        router.push("/"); // ✅ Перенаправление
      } else {
        setError(data.message || "Ошибка входа");
      }
    } catch (err) {
      console.error("❌ Ошибка авторизации:", err);
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Stack component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
          >
            Email
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // ✅ Явный тип
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // ✅ Явный тип
          />
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember this device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password?
          </Typography>
        </Stack>

        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
        </Box>
      </Stack>

      {subtitle}
    </>
  );
};

export default AuthLogin;
