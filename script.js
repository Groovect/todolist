"use strict";

const tasksList = document.querySelector(".todo__list"),
  form = document.querySelector("#form"),
  taskInput = document.querySelector("#taskInput"),
  btnAddTask = document.querySelector(".todo__add"),
  countActiveTasks = document.querySelector("#counter");

let tasks = [],
  counterCompleted = 0,
  counterActive = 0;

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTasksFromLS();
}

function renderTasksFromLS() {
  tasks.forEach((task) => {
    const taskNode = document.createElement("li");

    taskNode.setAttribute("id", task.id);
    taskNode.classList.add("todo__task");

    taskNode.innerHTML = `
      <button class="todo__complete">&#128504;</button>
      <div class="todo__text">${task.text}</div>
      <button class="todo__remove">&times;</button>
    `;

    if (task.done === true) {
      taskNode.classList.add("todo__task_completed");
      counterCompleted++;
    } else if (task.done === false) {
      counterActive++;
    }

    tasksList.append(taskNode);
  });
}

// add new task
countActiveTasks.innerHTML = counterActive;

form.addEventListener("submit", addTask);
form.addEventListener("input", showBtnAddTask);
btnAddTask.addEventListener("click", addTask);

function addTask(e) {
  e.preventDefault();

  const taskNode = document.createElement("li"),
    taskText = taskInput.value,
    newTask = {
      id: Date.now(),
      text: taskText,
      done: false,
    };

  if (taskText == "") {
    return;
  }

  tasks.push(newTask);
  saveToLocalStorage();

  taskNode.setAttribute("id", newTask.id);
  taskNode.classList.add("todo__task");
  taskNode.innerHTML = `
    <button class="todo__complete">&#128504;</button>
    <div class="todo__text">${newTask.text}</div>
    <button class="todo__remove">&times;</button>
  `;

  tasksList.append(taskNode);
  form.reset();
  showBtnAddTask();
  increaseCounterTasks();

  if (filterCompleted.classList.contains("todo__filters-btn_active")) {
    taskNode.style.display = "none";
  }
}

function showBtnAddTask() {
  if (taskInput.value.length > 0) {
    btnAddTask.classList.add("todo__add_active");
  } else {
    btnAddTask.classList.remove("todo__add_active");
  }
}

function increaseCounterTasks() {
  countActiveTasks.innerHTML = ++counterActive;
}

function decreaseCounterTasks() {
  countActiveTasks.innerHTML = --counterActive;
}

// remove tasks
tasksList.addEventListener("click", removeTask);

function removeTask(e) {
  if (e.target && e.target.classList.contains("todo__remove")) {
    const parentNode = e.target.closest(".todo__task"),
      id = +parentNode.id;

    tasks = tasks.filter((task) => task.id !== id);
    saveToLocalStorage();

    parentNode.remove();

    decreaseCounterTasks();
  }
}

// complete task
tasksList.addEventListener("click", completeTask);

function completeTask(e) {
  if (
    e.target &&
    e.target.classList.contains("todo__complete") &&
    e.target.closest(".todo__task.todo__task_completed")
  ) {
    return;
  }

  const parentNode = e.target.closest(".todo__task"),
    id = +parentNode.id,
    task = tasks.find((task) => task.id === id);

  if (e.target && e.target.classList.contains("todo__complete")) {
    parentNode.classList.add("todo__task_completed");
    task.done = !task.done;
    saveToLocalStorage();

    counterCompleted++;

    decreaseCounterTasks();
    showBtnResetCompleted();
  }

  if (filterActive.classList.contains("todo__filters-btn_active")) {
    parentNode.style.display = "none";
  }
}

// reset completed tasks
const btnResetCompleted = document.querySelector(".todo__clear");

btnResetCompleted.addEventListener("click", resetCompletedTasks);

function showBtnResetCompleted() {
  if (counterCompleted > 0) {
    btnResetCompleted.classList.add("todo__clear_active");
  } else if (counterCompleted <= 0) {
    btnResetCompleted.classList.remove("todo__clear_active");
  }
}

function resetCompletedTasks() {
  const allCompletedTasks = document.querySelectorAll(
    ".todo__task.todo__task_completed"
  );

  allCompletedTasks.forEach((task) => {
    task.remove();
  });

  tasks = tasks.filter((task) => task.done !== true);
  saveToLocalStorage();

  counterCompleted = 0;
  showBtnResetCompleted();
}

showBtnResetCompleted();

// working with filters

const filterAll = document.querySelector("[data-filter='all']"),
  filterActive = document.querySelector("[data-filter='active']"),
  filterCompleted = document.querySelector("[data-filter='completed']");

chooseFilter(filterAll);

filterAll.addEventListener("click", () => {
  chooseFilter(filterAll);
});

filterActive.addEventListener("click", () => {
  chooseFilter(filterActive);
});

filterCompleted.addEventListener("click", () => {
  chooseFilter(filterCompleted);
});

function chooseFilter(filter) {
  const activeTasks = document.querySelectorAll(".todo__task"),
    completedTasks = document.querySelectorAll(
      ".todo__task.todo__task_completed"
    );

  if (filter == filterAll) {
    activeTasks.forEach((task) => {
      task.style.display = "flex";
    });

    completedTasks.forEach((task) => {
      task.style.display = "flex";
    });

    addActiveClass(filterAll, filterCompleted, filterActive);
  } else if (filter == filterActive) {
    activeTasks.forEach((task) => {
      task.style.display = "flex";
    });

    completedTasks.forEach((task) => {
      task.style.display = "none";
    });

    addActiveClass(filterActive, filterAll, filterCompleted);
  } else if (filter == filterCompleted) {
    activeTasks.forEach((task) => {
      task.style.display = "none";
    });

    completedTasks.forEach((task) => {
      task.style.display = "flex";
    });

    addActiveClass(filterCompleted, filterActive, filterAll);
  }
}

function addActiveClass(btnShow, btnHide1, btnHide2) {
  btnShow.classList.add("todo__filters-btn_active");
  btnHide1.classList.remove("todo__filters-btn_active");
  btnHide2.classList.remove("todo__filters-btn_active");
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
