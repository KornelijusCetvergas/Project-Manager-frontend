import API from "./axios";
import { useState } from "react";
import Modal from "./Modal";
function Sidebar({
  sidebarProjects,
  onSelectProject,
  selectedProjectId,
  setProjects,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateProject(formData) {
    const title = formData.get("project");
    API.post("/api/project", { title })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) => [...prevProjects, response.data]);
          onSelectProject(response.data.id);
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error creating project:", error);
        //alert("Could not create project, please try again later");
      });
  }

  function handleLogout() {
    localStorage.setItem("token", "");
    localStorage.setItem("username", "");
    window.location.reload();
  }

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Project Manager</h2>
      <ul className="menu">
        {sidebarProjects.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${
              selectedProjectId === item.id ? "active" : ""
            }`}
            onClick={() => onSelectProject(item.id)}
          >
            {item.title}
          </li>
        ))}
        <li
          key="create"
          className="menu-item create"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </li>
        <li key="logout" className="menu-item create" onClick={handleLogout}>
          Logout
        </li>
      </ul>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Start a new project</h2>
        <form action={handleCreateProject} className="project-form">
          <label>Title:</label>
          <input
            className="project-input"
            type="text"
            name="project"
            required
          />
          <button className="create-project">Create</button>
        </form>
      </Modal>
    </div>
  );
}

export default Sidebar;
