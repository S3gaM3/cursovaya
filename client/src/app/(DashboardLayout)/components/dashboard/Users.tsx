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
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, PersonAdd } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
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

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: User[] = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setFormData({ name: "", email: "", role: "user" });
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setEditingUser(null);
      setFormData({ name: "", email: "", role: "user" });
      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "user" });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Управление пользователями" subtitle="Добавление и редактирование пользователей">
      <Box>
        <TextField
          label="Имя пользователя"
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email ?? ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Select
          value={formData.role ?? "user"}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="admin">Администратор</MenuItem>
          <MenuItem value="user">Пользователь</MenuItem>
        </Select>

        <Button onClick={handleAddUser} variant="contained" sx={{ mt: 2 }} startIcon={<PersonAdd />}>
          Добавить пользователя
        </Button>

        <List sx={{ mt: 3 }}>
          {users.map((user) => (
            <motion.div key={user.id} whileHover={{ scale: 1.02 }}>
              <ListItem>
                <ListItemText
                  primary={user.name}
                  secondary={`${user.email} (Роль: ${user.role})`}
                />
                <IconButton onClick={() => handleEditClick(user)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Modal open={Boolean(editingUser)} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Редактирование пользователя
            </Typography>
            <TextField
              label="Имя пользователя"
              value={formData.name ?? ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email ?? ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              margin="normal"
            />
            <ActionButtons onSave={handleEditUser} onClose={handleCloseModal} />
          </Box>
        </Modal>
      </Box>
    </DashboardCard>
  );
};

export default Users;
