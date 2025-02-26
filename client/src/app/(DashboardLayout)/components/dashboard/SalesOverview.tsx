import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

interface ChartData {
  month: string;
  projects: number;
  tasks: number;
}

const SalesOverview = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const projectsRes = await fetch("http://localhost:5000/api/projects");
      if (!projectsRes.ok) throw new Error(`Ошибка API /projects: ${projectsRes.status}`);
      const projects = await projectsRes.json();

      const tasksRes = await fetch("http://localhost:5000/api/tasks");
      if (!tasksRes.ok) throw new Error(`Ошибка API /tasks: ${tasksRes.status}`);
      const tasks = await tasksRes.json();

      if (!Array.isArray(projects) || !Array.isArray(tasks)) {
        throw new Error("Некорректный формат данных от API");
      }

      const projectCounts: Record<string, number> = {};
      projects.forEach((project) => {
        if (!project.start_date) return;
        const month = new Date(project.start_date).toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "2-digit",
        });
        projectCounts[month] = (projectCounts[month] || 0) + 1;
      });

      const taskCounts: Record<string, number> = {};
      tasks.forEach((task) => {
        if (!task.start_date) return;
        const month = new Date(task.start_date).toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "2-digit",
        });
        taskCounts[month] = (taskCounts[month] || 0) + 1;
      });

      const labels = Array.from(
        new Set([...Object.keys(projectCounts), ...Object.keys(taskCounts)])
      ).sort();

      const formattedData = labels.map((month) => ({
        month,
        projects: projectCounts[month] || 0,
        tasks: taskCounts[month] || 0,
      }));

      setChartData(formattedData);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ Ошибка загрузки данных:", err.message);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Typography>Загрузка данных...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Аналитика активности
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        График активности по проектам и задачам
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="projects" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="tasks" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesOverview;
