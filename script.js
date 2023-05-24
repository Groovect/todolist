"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const tasksList = document.querySelector(".todo__list"),
        input = document.querySelector(".todo__new-task"),
        btnAddTask = document.querySelector(".todo__add"),
        countToDos = document.querySelector(".todo__remainder"),
        filterAll = document.querySelector("[data-filter='all']"),
        filterActive = document.querySelector("[data-filter='active']"),
        filterCompleted = document.querySelector("[data-filter='completed']"),
        btnReset = document.querySelector(".todo__clear");

  let newTask,
      countTasks = 0,
      allTasks,
      completedTasks;

  input.addEventListener("input", (e) => {
    e.preventDefault();
    
    newTask = document.querySelector(".todo__new-task").value;

    addVisibleBtnAdd();
  });

  function addVisibleBtnAdd() {
    if (newTask !== "") {
      btnAddTask.classList.add("todo__add_active");
    } else {
      btnAddTask.classList.remove("todo__add_active");
    }
  }

  function createNewTask(task) {
    const item = document.createElement('div');

    item.classList.add("todo__task");
    item.innerHTML = `
    <button class="todo__complete">&#128504;</button>
    <div class="todo__text">${task}</div>
    <button class="todo__remove">&times;</button>
    `;
    tasksList.append(item);
  }

  function addNewTask() {
    btnAddTask.addEventListener("click", (e) => {
      e.preventDefault();
  
      if (newTask !== "") {
        createNewTask(newTask);
        changeRemainderTasks();
        input.value = "";
        newTask = "";
        addVisibleBtnAdd();
        changeTask();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key == "Enter" && newTask !== "") {
        createNewTask(newTask);
        changeRemainderTasks();
        input.value = "";
        newTask = "";
        addVisibleBtnAdd();
        changeTask();
      }
    });
  }

  addNewTask();
  
  function changeRemainderTasks() {
    countTasks++;
    countToDos.innerHTML = `${countTasks} tasks left`;
  }

  function changeTask() {
    allTasks = document.querySelectorAll(".todo__task");

    function removeTask() {
      allTasks.forEach((task, i) => {
        const btnRemoveTask = task.querySelector(".todo__remove");

        btnRemoveTask.addEventListener("click", () => {
          allTasks[i].remove();
        });
      });
    }

    function completeTask() {
      allTasks.forEach((task, i) => {
        const btnCompleteTask = task.querySelector(".todo__complete");

        btnCompleteTask.addEventListener("click", () => {
          allTasks[i].classList.add("todo__task_completed");

          showBtnResetCompletedTasks();
        });
      });
    }

    function showBtnResetCompletedTasks() {
      completedTasks = tasksList.querySelectorAll(".todo__task_completed");

      if (completedTasks.length > 0) {
        btnReset.classList.add("todo__clear_active");
      }
    }

    removeTask();
    completeTask();
  }

});