import React, { useState, useEffect } from "react";
import API from "./axios";
import CheckboxChecked from "../assets/Check box.svg";
import CheckboxEmpty from "../assets/Check box empty.svg";
import Trashbin from "../assets/Delete.svg";

export default function TasksDisplay({
  setProjects,
  selectedProjectId,
  projects,
}) {
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

  const tasks = projects.filter(
    (project) => project.id === selectedProjectId
  )[0].tasks;
  function deleteTask(id) {
    API.delete("/api/task/" + id)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    tasks: project.tasks.filter((task) => task.taskId !== id),
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

  function toggleIsDone(id) {
    API.patch("/api/task/toggle/" + id)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    tasks: project.tasks.map((task) =>
                      task.taskId === id
                        ? { ...task, isDone: !task.isDone }
                        : task
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

  function handleDeleteAllDone() {
    API.delete("/api/task/" + selectedProjectId + "/alldone")
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    tasks: project.tasks.filter((task) => !task.isDone),
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
  function handleCreateTask(formData) {
    const text = formData.get("task");
    const projectId = selectedProjectId;
    API.post("/api/task", { text, projectId })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? {
                    ...project,
                    tasks: [...project.tasks, response.data],
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

  const listOfTasks = tasks.map((task) => (
    <li
      key={task.taskId}
      className={`tasklist-item ${task.isDone === true ? "isdone" : ""}`}
    >
      {accessLevel <= 2 ? (
        <img
          className="checkbox"
          onClick={() => toggleIsDone(task.taskId)}
          src={task.isDone ? CheckboxChecked : CheckboxEmpty}
        />
      ) : (
        <></>
      )}
      <span
        style={{
          textDecoration: task.isDone ? "line-through" : "none",
        }}
      >
        {task.text}
      </span>
      {accessLevel <= 1 ? (
        <img
          className="trashbin"
          src={Trashbin}
          onClick={() => deleteTask(task.taskId)}
        />
      ) : (
        <></>
      )}
    </li>
  ));

  return (
    <main className="task-display">
      {accessLevel <= 1 ? (
        <form action={handleCreateTask} className="task-form">
          <input
            className="task-input"
            type="text"
            placeholder="Task"
            name="task"
            required
          />
          <button className="task-add">Add</button>
        </form>
      ) : (
        <></>
      )}

      <ul className="tasklist">{listOfTasks}</ul>

      {tasks.length != 0 && accessLevel <= 1 ? (
        <button onClick={handleDeleteAllDone}>
          Delete all completed tasks
        </button>
      ) : (
        <></>
      )}
    </main>
  );
}
