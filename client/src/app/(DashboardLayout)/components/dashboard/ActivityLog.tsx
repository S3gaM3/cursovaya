import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Delete, History } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Activity {
  id: number;
  message: string;
  timestamp: string;
}

const ActivityLog = () => {
  const [activityLog, setActivityLog] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchActivityLog = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/activity-log");
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: Activity[] = await response.json();
      setActivityLog(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityLog();
  }, [fetchActivityLog]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/activity-log/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      fetchActivityLog();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Журнал активности" subtitle="Просмотр и удаление записей">
      <List>
        {activityLog.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            Нет записей активности.
          </Typography>
        ) : (
          activityLog.map((activity) => (
            <motion.div key={activity.id} whileHover={{ scale: 1.02 }}>
              <ListItem>
                <ListItemText
                  primary={activity.message}
                  secondary={format(new Date(activity.timestamp), "dd MMMM yyyy, HH:mm", { locale: ru })}
                />
                <IconButton onClick={() => handleDelete(activity.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            </motion.div>
          ))
        )}
      </List>
    </DashboardCard>
  );
};

export default ActivityLog;
