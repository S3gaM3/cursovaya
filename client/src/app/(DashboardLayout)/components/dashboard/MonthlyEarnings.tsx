import { useEffect, useState } from "react";
import { Typography, Avatar, Fab, Stack } from "@mui/material";
import { IconListCheck } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const MonthlyEarnings = () => {
  const [tasks, setTasks] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/status");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <DashboardCard
      title="Tasks Summary"
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <IconListCheck width={24} />
        </Fab>
      }
    >
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h3" fontWeight="700">
            {tasks.total} Tasks
          </Typography>
          <Stack spacing={1} my={1}>
            <Typography color="success.main">Completed: {tasks.completed}</Typography>
            <Typography color="primary.main">In Progress: {tasks.in_progress}</Typography>
            <Typography color="error.main">New: {tasks.new}</Typography>
          </Stack>
        </>
      )}
    </DashboardCard>
  );
};

export default MonthlyEarnings;
