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
import { Delete, Edit, TaskAlt } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "new" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
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

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "new",
    priority: "medium",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: Task[] = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setFormData({ title: "", description: "", status: "new", priority: "medium" });
      fetchTasks();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${editingTask.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setEditingTask(null);
      setFormData({ title: "", description: "", status: "new", priority: "medium" });
      fetchTasks();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      fetchTasks();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "new",
      priority: task.priority || "medium",
    });
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", status: "new", priority: "medium" });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Управление задачами" subtitle="Создание и редактирование задач">
      <Box>
        <TextField
          label="Название задачи"
          value={formData.title ?? ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Описание"
          value={formData.description ?? ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Select
          value={formData.status ?? "new"}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="new">Новая</MenuItem>
          <MenuItem value="in_progress">В процессе</MenuItem>
          <MenuItem value="completed">Завершена</MenuItem>
        </Select>

        <Button onClick={handleAddTask} variant="contained" sx={{ mt: 2 }} startIcon={<TaskAlt />}>
          Добавить задачу
        </Button>

        <List sx={{ mt: 3 }}>
          {tasks.map((task) => (
            <motion.div key={task.id} whileHover={{ scale: 1.02 }}>
              <ListItem>
                <ListItemText
                  primary={task.title}
                  secondary={`${task.description} (Статус: ${task.status}, Приоритет: ${task.priority})`}
                />
                <IconButton onClick={() => handleEditClick(task)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Modal open={Boolean(editingTask)} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Редактирование задачи
            </Typography>
            <TextField
              label="Название задачи"
              value={formData.title ?? ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              margin="normal"
            />
            <ActionButtons onSave={handleEditTask} onClose={handleCloseModal} />
          </Box>
        </Modal>
      </Box>
    </DashboardCard>
  );
};

export default Tasks;
