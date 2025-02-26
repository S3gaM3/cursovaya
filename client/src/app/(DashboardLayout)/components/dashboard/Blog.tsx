import React, { useEffect, useState } from "react";
import { Grid, CardContent, Typography, Avatar, Tooltip, Fab } from "@mui/material";
import { IconMail } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";

const Blog = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notifications");
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

        const data = await response.json();
        setNotifications(data);
      } catch (error: any) {
        console.error("❌ Ошибка загрузки уведомлений:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={3}>
      {notifications.map((notification, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <BlankCard>
            <Tooltip title="View Notification">
              <Fab size="small" color="primary" sx={{ bottom: "75px", right: "15px", position: "absolute" }}>
                <IconMail size="16" />
              </Fab>
            </Tooltip>
            <CardContent sx={{ p: 3, pt: 2 }}>
              <Typography variant="h6">{notification.content}</Typography>
              <Typography variant="subtitle2">
                {new Date(notification.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default Blog;
