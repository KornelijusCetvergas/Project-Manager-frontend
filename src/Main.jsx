import React, { useState, useEffect } from "react";
import API from "./components/axios";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TasksDisplay from "./components/TasksDisplay";

export default function Main() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(0);

  useEffect(() => {
    API.get("/api/project/all")
      .then((response) => {
        setProjects(response.data);
        {
          response.data.length > 0
            ? setSelectedProjectId(response.data[0].id)
            : "";
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        //alert("There was an issue with loading the Project list, please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <Sidebar
            sidebarProjects={projects}
            onSelectProject={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
            setProjects={setProjects}
          />
          <div style={{ flex: 1 }}>
            <Header
              projects={projects}
              setSelectedProjectId={setSelectedProjectId}
              selectedProjectId={selectedProjectId}
              setProjects={setProjects}
            />
            {projects.length > 0 ? (
              <TasksDisplay
                projects={projects}
                setProjects={setProjects}
                selectedProjectId={selectedProjectId}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
