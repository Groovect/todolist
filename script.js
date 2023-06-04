"use strict";

/* 
---подключение работы с localstorage для сохранения тасков

--- рефакторинг кода - перемещение объявления переменных в определенные блоки, чтобы не приходилось скроллить для поиска названия перменных)
*/

const tasksList = document.querySelector(".todo__list"),
  form = document.querySelector("#form"),
  taskInput = document.querySelector("#taskInput"),
  btnAddTask = document.querySelector(".todo__add"),
  countActiveTasks = document.querySelector("#counter"),
  btnResetCompleted = document.querySelector(".todo__clear");

let counterActive = 0,
    counterCompleted = 0;
countActiveTasks.innerHTML = counterActive;

function increaseCounterTasks() {
  countActiveTasks.innerHTML = ++counterActive;
}

function decreaseCounterTasks() {
  countActiveTasks.innerHTML = --counterActive;
}

function showBtnResetCompleted() {
  if (counterCompleted > 0) {
    btnResetCompleted.classList.add("todo__clear_active");
  } else if (counterCompleted <= 0) {
    btnResetCompleted.classList.remove("todo__clear_active");
  }
}

// add new task

form.addEventListener("submit", addTask);
form.addEventListener("input", showBtnAddTask);
btnAddTask.addEventListener("click", addTask);

function addTask(e) {
  e.preventDefault();
  
  const newTask = document.createElement("li");
  const taskText = taskInput.value;

  if (taskText == '') {
    return;
  }

  newTask.classList.add("todo__task");
  newTask.innerHTML = `
    <button class="todo__complete">&#128504;</button>
    <div class="todo__text">${taskText}</div>
    <button class="todo__remove">&times;</button>
  `;

  tasksList.append(newTask);
  form.reset();
  showBtnAddTask();
  increaseCounterTasks();
}

function showBtnAddTask() {
  let taskText = taskInput.value;
  if (taskText.length > 0) {
    btnAddTask.classList.add("todo__add_active");
  } else {
    btnAddTask.classList.remove("todo__add_active");
  }
}

// remove tasks

tasksList.addEventListener("click", removeTask);

function removeTask(e) {
  if (e.target && e.target.classList.contains("todo__remove")) {
    const parentNode = e.target.closest(".todo__task");

    parentNode.remove();

    decreaseCounterTasks();
  }
}

// complete task 

tasksList.addEventListener("click", completeTask);

function completeTask(e) {
  if (e.target && e.target.classList.contains("todo__complete")) {
    const parentNode = e.target.closest(".todo__task");

    parentNode.classList.add("todo__task_completed");
    counterCompleted++;
    decreaseCounterTasks();
    showBtnResetCompleted();
  }
}

// reset completed tasks

btnResetCompleted.addEventListener("click", () => {
  const allCompletedTasks = document.querySelectorAll(".todo__task.todo__task_completed")
  
  allCompletedTasks.forEach((task) => {
    task.remove();
  });

  counterCompleted = 0;
  showBtnResetCompleted();
});

// working with filters

const filterAll = document.querySelector("[data-filter='all']"),
  filterActive = document.querySelector("[data-filter='active']"),
  filterCompleted = document.querySelector("[data-filter='completed']");

filterAll.addEventListener("click", (e) => {
  const activeTasks = document.querySelectorAll(".todo__task"),
        completedTasks = document.querySelectorAll(".todo__task.todo__task_completed");

  activeTasks.forEach((task) => {
    task.style.display = "flex";
  });

  completedTasks.forEach((task) => {
    task.style.display = "flex";
  });

  filterCompleted.classList.remove("todo__filters-btn_active");
  filterActive.classList.remove("todo__filters-btn_active");
  filterAll.classList.add("todo__filters-btn_active");
});

filterActive.addEventListener("click", () => {
  // при выполнении задачи при активности фильтра, эта задача должна сразу же скрываться
  const activeTasks = document.querySelectorAll(".todo__task"),
        completedTasks = document.querySelectorAll(".todo__task.todo__task_completed");

  activeTasks.forEach((task) => {
    task.style.display = "flex";
  });

  completedTasks.forEach((task) => {
    task.style.display = "none";
  });

  filterCompleted.classList.remove("todo__filters-btn_active");
  filterActive.classList.add("todo__filters-btn_active");
});

filterCompleted.addEventListener("click", () => {
  // нужно ли функционировать фильтру при отсутствии выполненных тасков
  const activeTasks = document.querySelectorAll(".todo__task"),
        completedTasks = document.querySelectorAll(".todo__task.todo__task_completed");

  activeTasks.forEach((task) => {
    task.style.display = "none";
  });

  completedTasks.forEach((task) => {
    task.style.display = "flex";
  });

  filterActive.classList.remove("todo__filters-btn_active");
  filterCompleted.classList.add("todo__filters-btn_active");
});