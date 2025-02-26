import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, NotificationsActive } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "error";
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ActionButtons = ({
  onSave,
  onClose,
}: {
  onSave: () => void;
  onClose: () => void;
}) => (
  <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
    <Button onClick={onSave} variant="contained" sx={{ mr: 2 }}>
      Сохранить
    </Button>
    <Button onClick={onClose} variant="outlined">
      Отмена
    </Button>
  </Box>
);

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [formData, setFormData] = useState<Omit<Notification, "id">>({
    message: "",
    type: "info",
  });
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: Notification[] = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAddNotification = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setFormData({ message: "", type: "info" });
      fetchNotifications();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditNotification = async () => {
    if (!editingNotification) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${editingNotification.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setEditingNotification(null);
      setFormData({ message: "", type: "info" });
      fetchNotifications();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      fetchNotifications();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      message: notification.message || "",
      type: notification.type || "info",
    });
  };

  const handleCloseModal = () => {
    setEditingNotification(null);
    setFormData({ message: "", type: "info" });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Управление уведомлениями" subtitle="Создание и редактирование уведомлений">
      <Box>
        <TextField
          label="Сообщение"
          value={formData.message ?? ""}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          fullWidth
          margin="normal"
        />

        <Button onClick={handleAddNotification} variant="contained" sx={{ mt: 2 }} startIcon={<NotificationsActive />}>
          Добавить уведомление
        </Button>

        <List sx={{ mt: 3 }}>
          {notifications.map((notification) => (
            <motion.div key={notification.id} whileHover={{ scale: 1.02 }}>
              <ListItem>
                <ListItemText
                  primary={notification.message}
                  secondary={`Тип: ${notification.type}`}
                />
                <IconButton onClick={() => handleEditClick(notification)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(notification.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Modal open={Boolean(editingNotification)} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Редактирование уведомления
            </Typography>
            <TextField
              label="Сообщение"
              value={formData.message ?? ""}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              fullWidth
              margin="normal"
            />
            <ActionButtons onSave={handleEditNotification} onClose={handleCloseModal} />
          </Box>
        </Modal>
      </Box>
    </DashboardCard>
  );
};

export default Notifications;
