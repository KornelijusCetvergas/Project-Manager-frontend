import React, { useEffect, useState } from 'react';
import API from './axios'

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get('/project/all') // adjust endpoint as needed
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
      });
  }, []);

  return (
    <div>
      <h2>My Projects</h2>
      {projects.map(project => (
        <div key={project.id} className="project-card">
          <h3>{project.title} (Owner: {project.username})</h3>

          <h4>Tasks:</h4>
          <ul>
            {project.tasks.map(task => (
              <li key={task.taskId}>
                {task.text} {task.isDone ? '✅' : '❌'}
              </li>
            ))}
          </ul>

          <h4>Collaborators:</h4>
          <ul>
            {project.projectUserList.map(user => (
              <li key={user.projectUserId}>
                User {user.userId} - Access: {user.accessLevel}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Projects;