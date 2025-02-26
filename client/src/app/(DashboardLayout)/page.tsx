"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Grid, Box, CircularProgress, Alert } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

// Import components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import Projects from "@/app/(DashboardLayout)/components/dashboard/Projects";
import Tasks from "@/app/(DashboardLayout)/components/dashboard/Tasks";
import Users from "@/app/(DashboardLayout)/components/dashboard/Users"; // Added Users import
import Teams from "@/app/(DashboardLayout)/components/dashboard/Teams"; // Added Teams import
import Notifications from "@/app/(DashboardLayout)/components/dashboard/Notifications"; // Added Notifications import
import ActivityLog from "@/app/(DashboardLayout)/components/dashboard/ActivityLog"; // Added ActivityLog import

// Interfaces
interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch("http://localhost:5000/api/projects"),
        fetch("http://localhost:5000/api/tasks"),
      ]);

      if (!projectsRes.ok) throw new Error(`Ошибка загрузки проектов: ${projectsRes.status}`);
      if (!tasksRes.ok) throw new Error(`Ошибка загрузки задач: ${tasksRes.status}`);

      const projectsData: Project[] = await projectsRes.json();
      const tasksData: Task[] = await tasksRes.json();

      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err: any) {
      setError(`❌ Ошибка загрузки: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <SalesOverview />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <YearlyBreakup />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <RecentTransactions />
            </Grid>
            <Grid item xs={12}>
              <Users /> {/* Added Users component */}
            </Grid>
            <Grid item xs={12}>
              <Teams /> {/* Added Teams component */}
            </Grid>
            <Grid item xs={12}>
              <Notifications /> {/* Added Notifications component */}
            </Grid>
            <Grid item xs={12}>
              <ActivityLog /> {/* Added ActivityLog component */}
            </Grid>
            <Grid item xs={12}>
              <Tasks /> {/* Existing Tasks component */}
            </Grid>
            {projects.length > 0 && (
              <Grid item xs={12}>
                <Projects projects={projects} /> {/* Fixed Projects prop */}
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
