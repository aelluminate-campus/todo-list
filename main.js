window.addEventListener("load", () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const dateInput = document.querySelector("#new-task-date");
  const priorityInput = document.querySelector("#new-task-priority");
  const pastDueList = document.querySelector("#past-due-tasks");
  const todayList = document.querySelector("#today-tasks");
  const upcomingList = document.querySelector("#upcoming-tasks");
  const finishedList = document.querySelector("#finished-tasks");
  const themeSelector = document.getElementById("theme-selector");

  // Load tasks from localStorage
  tasks.forEach((task) => {
    addTaskToList(task);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskText = input.value;
    const dueDate = dateInput.value;
    const priority = priorityInput.value; // Get the selected priority

    if (!taskText || !dueDate) {
      alert("Please fill out both the task and due date");
      return;
    }

    const taskObj = {
      text: taskText,
      date: dueDate,
      priority: priority, // Save priority
      completed: false,
    };

    tasks.push(taskObj);
    saveTasks(); // Save tasks after adding a new one

    addTaskToList(taskObj);
    input.value = "";
    dateInput.value = "";
    priorityInput.value = "low"; // Reset to default
  });

  function addTaskToList(task) {
    const taskElement = createTaskElement(task);
    sortAndAppendTask(task);
  }

  function sortAndAppendTask(task) {
    const today = new Date().toISOString().split("T")[0];
    const taskElement = createTaskElement(task);

    if (task.completed) {
      finishedList.appendChild(taskElement);
    } else if (task.date < today) {
      pastDueList.appendChild(taskElement);
    } else if (task.date === today) {
      todayList.appendChild(taskElement);
    } else {
      upcomingList.appendChild(taskElement);
    }
  }

  function createTaskElement(task) {
    const task_el = document.createElement("div");
    task_el.classList.add("task");

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");

    const task_input_el = document.createElement("input");
    task_input_el.classList.add("text");
    task_input_el.type = "text";
    task_input_el.value = task.text;
    task_input_el.setAttribute("readonly", "readonly");

    const task_date_el = document.createElement("span");
    task_date_el.classList.add("date");
    task_date_el.innerText = `Due: ${formatDate(task.date)}`;

    const task_priority_el = document.createElement("span"); // Create a span for priority
    task_priority_el.classList.add("priority");
    task_priority_el.innerText = `Priority: ${task.priority}`; // Display priority

    task_content_el.appendChild(task_input_el);
    task_content_el.appendChild(task_date_el);
    task_content_el.appendChild(task_priority_el); // Append priority to task content
    task_el.appendChild(task_content_el);

    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");

    const task_done_el = document.createElement("button");
    task_done_el.classList.add("done");
    task_done_el.innerHTML = task.completed ? "Undo" : "Done";

    const task_edit_el = document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerHTML = "Edit";

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerHTML = "Delete";

    task_actions_el.appendChild(task_done_el);
    if (!task.completed) {
      task_actions_el.appendChild(task_edit_el);
    }
    task_actions_el.appendChild(task_delete_el);
    task_el.appendChild(task_actions_el);

    // Event listeners for task actions
    task_done_el.addEventListener("click", () => {
      task.completed = !task.completed;
      refreshTaskLists();
    });

    task_edit_el.addEventListener("click", () => {
      if (task_edit_el.innerText.toLowerCase() === "edit") {
        task_input_el.removeAttribute("readonly");
        task_input_el.focus();
        task_edit_el.innerText = "Save";
      } else {
        task_input_el.setAttribute("readonly", "readonly");
        task.text = task_input_el.value;
        task_edit_el.innerText = "Edit";
        saveTasks();
        refreshTaskLists();
      }
    });

    task_delete_el.addEventListener("click", () => {
      tasks = tasks.filter((t) => t !== task);
      saveTasks();
      refreshTaskLists();
    });

    return task_el;
  }

  function refreshTaskLists() {
    pastDueList.innerHTML = "";
    todayList.innerHTML = "";
    upcomingList.innerHTML = "";
    finishedList.innerHTML = "";

    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    sortedTasks.forEach((task) => {
      sortAndAppendTask(task);
    });

    saveTasks();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function formatDate(dateString) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Theme switcher
  themeSelector.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });
});
