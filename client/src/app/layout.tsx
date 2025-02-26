"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import { baselightTheme } from "@/utils/theme/DefaultColors";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ThemeProvider theme={baselightTheme}>
            <CssBaseline />
            <AuthGuard>{children}</AuthGuard>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const publicPages = ["/authentication/login", "/authentication/register"];

  useEffect(() => {
    if (status === "loading") return; // Пока грузится сессия, ничего не делаем

    if (!session && !publicPages.includes(pathname)) {
      console.warn("⚠️ Пользователь не авторизован, перенаправляем на /authentication/login");
      router.push("/authentication/login");
    } else {
      setLoading(false);
    }
  }, [session, status, pathname, router]);

  if (loading || status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
