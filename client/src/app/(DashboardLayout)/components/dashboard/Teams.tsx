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
import { Delete, Edit, Groups } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Team {
  id: number;
  name: string;
  description: string;
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

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState<Omit<Team, "id">>({
    name: "",
    description: "",
  });
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams");
      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: Team[] = await response.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleAddTeam = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setFormData({ name: "", description: "" });
      fetchTeams();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditTeam = async () => {
    if (!editingTeam) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/teams/${editingTeam.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setEditingTeam(null);
      setFormData({ name: "", description: "" });
      fetchTeams();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      fetchTeams();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || "",
      description: team.description || "",
    });
  };

  const handleCloseModal = () => {
    setEditingTeam(null);
    setFormData({ name: "", description: "" });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Управление командами" subtitle="Создание и редактирование команд">
      <Box>
        <TextField
          label="Название команды"
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

        <Button onClick={handleAddTeam} variant="contained" sx={{ mt: 2 }} startIcon={<Groups />}>
          Добавить команду
        </Button>

        <List sx={{ mt: 3 }}>
          {teams.map((team) => (
            <motion.div key={team.id} whileHover={{ scale: 1.02 }}>
              <ListItem>
                <ListItemText
                  primary={team.name}
                  secondary={team.description}
                />
                <IconButton onClick={() => handleEditClick(team)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(team.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Modal open={Boolean(editingTeam)} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Редактирование команды
            </Typography>
            <TextField
              label="Название команды"
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
            <ActionButtons onSave={handleEditTeam} onClose={handleCloseModal} />
          </Box>
        </Modal>
      </Box>
    </DashboardCard>
  );
};

export default Teams;
