import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

interface Project {
  id: number;
  name: string;
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

const ProductPerformance = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editedData, setEditedData] = useState<Pick<Project, "name" | "status">>({
    name: "",
    status: "active",
  });

  useEffect(() => {
    const fetchProjects = async () => {
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
    };

    fetchProjects();
  }, []);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setEditedData({ name: project.name, status: project.status });
  };

  const handleCloseModal = () => {
    setEditingProject(null);
    setEditedData({ name: "", status: "active" });
  };

  const handleSave = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${editingProject.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...editedData }
            : project
        )
      );
      handleCloseModal();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <Typography>Загрузка проектов...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Список проектов
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Активные проекты и их статус
      </Typography>

      <List>
        {projects.map((project) => (
          <ListItem key={project.id}>
            <ListItemText primary={project.name} secondary={`Статус: ${project.status}`} />
            <IconButton onClick={() => handleEditClick(project)}>
              <Edit />
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
            value={editedData.name}
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Select
            value={editedData.status}
            onChange={(e) => setEditedData({ ...editedData, status: e.target.value as Project["status"] })}
            fullWidth
          >
            <MenuItem value="active">Активный</MenuItem>
            <MenuItem value="on_hold">На паузе</MenuItem>
            <MenuItem value="completed">Завершен</MenuItem>
          </Select>
          <ActionButtons onSave={handleSave} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
};

export default ProductPerformance;
