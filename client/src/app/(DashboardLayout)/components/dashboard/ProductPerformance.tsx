import React, { useEffect, useState } from "react";

const ProductPerformance = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();

        // Если API вернул объект (ошибку), устанавливаем пустой массив
        if (!Array.isArray(data)) {
          console.error("Ошибка: API вернул не массив", data);
          setProjects([]);
        } else {
          setProjects(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (!projects.length) return <p>Нет проектов</p>;

  return (
    <div>
      <h2>Список проектов</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPerformance;
