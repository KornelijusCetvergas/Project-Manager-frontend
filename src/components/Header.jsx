import API from "./axios";
import Modal from "./Modal";
import { useState } from "react";

export default function Header({
  selectedProjectId,
  setProjects,
  setSelectedProjectId,
  projects,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accessLevel = getAccessLevelAsNumber();

  function getAccessLevelAsNumber() {
    const currentUsername = localStorage.getItem("username");

    if (!currentUsername || !projects.length) return 4; // fallback if username or projects missing

    const currentProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    if (!currentProject) return 4;

    const projectUser = currentProject.projectUserList.find(
      (user) => user.username === currentUsername
    );
    if (!projectUser) return 4;

    switch (projectUser.accessLevel) {
      case "OWNER":
        return 0;
      case "EDIT":
        return 1;
      case "DO":
        return 2;
      case "READ":
        return 3;
      default:
        return 4;
    }
  }

  function deleteProject() {
    API.delete("/api/project/" + selectedProjectId)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) => {
            const updated = prevProjects.filter(
              (project) => project.id !== selectedProjectId
            );
            setIsModalOpen(false);
            if (updated.length > 0) {
              setSelectedProjectId(updated[0].id);
            }

            return updated;
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        //alert("Could not delete the Project, please try again later.");
      });
  }
  function handleDeleteProjectUser(id) {
    API.delete("/api/projectuser/" + id)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    projectUserList: project.projectUserList.filter(
                      (projectUser) => projectUser.projectUserId !== id
                    ),
                  }
                : project
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        //alert("Could not delete the Task, please try again later.");
      });
  }

  function handleCreateProjectUser(formData) {
    const userId = formData.get("userId");
    const projectId = selectedProjectId;
    API.post("/api/projectuser", { userId, projectId })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    projectUserList: [
                      ...project.projectUserList,
                      response.data,
                    ],
                  }
                : project
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        //alert("Could not update the Task, please try again later");
      });
  }

  function handleUpdateProjectUser(projectUserId, accessLevel) {
    API.patch("/api/projectuser", { accessLevel, projectUserId })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    projectUserList: project.projectUserList.map(
                      (projectUser) =>
                        projectUser.projectUserId === projectUserId
                          ? {
                              ...projectUser,
                              accessLevel: accessLevel,
                            }
                          : projectUser
                    ),
                  }
                : project
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        //alert("Could not update the Task, please try again later");
      });
  }
  function handleUpdateTitle(formData) {
    const title = formData.get("title");
    console.log(title);
    API.patch("/api/project/" + selectedProjectId, { title })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    title: title,
                  }
                : project
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        //alert("Could not delete the Tasks, please try again later.");
      });
  }
  return (
    <header>
      <div className="center-content">
        <h1>
          {projects.find((project) => project.id === selectedProjectId)
            ?.title || "Create a project!"}
        </h1>
      </div>
      {projects.length > 0 && accessLevel <= 0 ? (
        <img src="src\assets\menu.svg" onClick={() => setIsModalOpen(true)} />
      ) : (
        <></>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Project settings</h2>
        <form action={handleUpdateTitle}>
          <label>Change project title:</label>
          <input
            placeholder="Project Title"
            type="text"
            name="title"
            required
          />
          <button>Change</button>
        </form>
        <form action={handleCreateProjectUser}>
          <label>Share your project:</label>
          <input placeholder="User ID" type="number" name="userId" required />
          <button>Share</button>
        </form>
        {projects.find((project) => project.id === selectedProjectId)
          ?.projectUserList.length > 1 ? (
          <label>Project users:</label>
        ) : (
          <></>
        )}
        <ul>
          {projects
            .find((project) => project.id === selectedProjectId)
            ?.projectUserList.filter(
              (projectUser) => projectUser.accessLevel !== "OWNER"
            )
            .map((projectUser) => (
              <li key={projectUser.projectUserId}>
                {projectUser.username}
                <select
                  defaultValue={projectUser.accessLevel}
                  name="accessLevel-select"
                  onChange={(e) =>
                    handleUpdateProjectUser(
                      projectUser.projectUserId,
                      e.target.value
                    )
                  }
                >
                  <option value="EDIT">EDIT</option>
                  <option value="DO">DO</option>
                  <option value="READ">READ</option>
                </select>
                <button
                  onClick={() =>
                    handleDeleteProjectUser(projectUser.projectUserId)
                  }
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>

        <button onClick={deleteProject}>Delete Project</button>
      </Modal>
    </header>
  );
}
