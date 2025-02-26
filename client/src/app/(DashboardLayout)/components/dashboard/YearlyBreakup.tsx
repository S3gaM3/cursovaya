import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Typography } from "@mui/material";

interface YearlyData {
  name: string;
  income: number;
}

const YearlyBreakup = () => {
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchYearlyIncome = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
      const data: any[] = await response.json();

      const formattedData: YearlyData[] = data.map((project) => ({
        name: project.name,
        income: typeof project.income === "number" ? project.income : 0,
      }));

      setYearlyData(formattedData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYearlyIncome();
  }, [fetchYearlyIncome]);

  return (
    <DashboardCard title="Годовой доход">
      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : yearlyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#8884d8" name="Доход" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2">Нет данных для отображения</Typography>
      )}
    </DashboardCard>
  );
};

export default YearlyBreakup;
