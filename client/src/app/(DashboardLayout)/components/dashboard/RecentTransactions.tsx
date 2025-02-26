import React, { useEffect, useState } from "react";
import {
  Grid,
  CardContent,
  Typography,
  Tooltip,
  Fab,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { IconListCheck } from "@tabler/icons-react";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Transaction {
  id: number;
  action: string;
  timestamp: string;
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

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editedData, setEditedData] = useState<Pick<Transaction, "action" | "timestamp">>({
    action: "",
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/activity-log");
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        const data: Transaction[] = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSave = async () => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/activity-log/${editingTransaction.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === editingTransaction.id
            ? { ...transaction, ...editedData }
            : transaction
        )
      );
      setEditingTransaction(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <Typography>Загрузка действий...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <DashboardCard title="Последние действия" subtitle="Лог активности по проектам и задачам">
      <Grid container spacing={3}>
        {transactions.map((transaction) => (
          <Grid item xs={12} md={6} lg={4} key={transaction.id}>
            <BlankCard>
              <CardContent>
                <Typography variant="h6">{transaction.action}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Дата: {new Date(transaction.timestamp).toLocaleDateString()}
                </Typography>
              </CardContent>
            </BlankCard>
          </Grid>
        ))}
      </Grid>

      <Modal open={Boolean(editingTransaction)} onClose={() => setEditingTransaction(null)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Редактирование действия
          </Typography>
          <TextField
            label="Действие"
            value={editedData.action}
            onChange={(e) => setEditedData({ ...editedData, action: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Дата"
            type="date"
            value={editedData.timestamp.split("T")[0]}
            onChange={(e) => setEditedData({ ...editedData, timestamp: new Date(e.target.value).toISOString() })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <ActionButtons onSave={handleSave} onClose={() => setEditingTransaction(null)} />
        </Box>
      </Modal>
    </DashboardCard>
  );
};

export default RecentTransactions;
