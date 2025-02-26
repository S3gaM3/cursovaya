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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "on_hold" | "completed";
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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    status: "active",
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: Project[] = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setFormData({ name: "", description: "", status: "active" });
      fetchProjects(); // Теперь обновляем список после добавления
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditProject = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${editingProject.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setEditingProject(null);
      setFormData({ name: "", description: "", status: "active" });
      fetchProjects(); // Теперь обновляем список после редактирования
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      fetchProjects();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
    });
  };

  const handleCloseModal = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "", status: "active" });
  };

  if (loading) return <Typography>Загрузка проектов...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Управление проектами" subtitle="Создание и редактирование проектов">
      <Box>
        <TextField
          label="Название проекта"
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          value={formData.status ?? "active"}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="active">Активный</MenuItem>
          <MenuItem value="on_hold">На паузе</MenuItem>
          <MenuItem value="completed">Завершен</MenuItem>
        </Select>

        <Button onClick={handleAddProject} variant="contained" sx={{ mt: 2 }}>
          Добавить проект
        </Button>

        <List sx={{ mt: 3 }}>
          {projects.map((project) => (
            <ListItem key={project.id}>
              <ListItemText
                primary={project.name}
                secondary={`${project.description} (Статус: ${project.status})`}
              />
              <IconButton onClick={() => handleEditClick(project)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(project.id)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Modal open={Boolean(editingProject)} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Редактирование проекта
            </Typography>
            <TextField
              label="Название проекта"
              value={formData.name ?? ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.status ?? "active"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="active">Активный</MenuItem>
              <MenuItem value="on_hold">На паузе</MenuItem>
              <MenuItem value="completed">Завершен</MenuItem>
            </Select>
            <ActionButtons onSave={handleEditProject} onClose={handleCloseModal} />
          </Box>
        </Modal>
      </Box>
    </DashboardCard>
  );
};

export default Projects;
