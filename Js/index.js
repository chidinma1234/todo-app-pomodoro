'use strict';
const html = document.querySelector('html');
const modeToggle = document.querySelector('.mode-toggle');
const todoForm = document.querySelector('.todo-form');
const activity = document.querySelector('.form_input');
const todoList = document.querySelector('.todo-list');
const container = document.querySelector('.btn');
const remainingTask = document.querySelector('.no-of-tasks span');

modeToggle.addEventListener('click', () => {
  if (html.getAttribute('data-color-mode') === 'light') {
    html.setAttribute('data-color-mode', 'dark');
  } else {
    html.setAttribute('data-color-mode', 'light');
  }
});

let itemsArray = localStorage.getItem('items')
  ? JSON.parse(localStorage.getItem('items'))
  : [];

todoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputValue = activity.value;
  if (!inputValue) return;

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };
  itemsArray.push(task);
  localStorage.setItem('items', JSON.stringify(itemsArray));

  renderTask(task);
  countTasks();
  activity.value = '';
});

function renderTask(task) {
  const todoItem = document.createElement('div');
  todoItem.classList.add('todo-item');
  todoItem.setAttribute('id', task.id);
  todoItem.innerHTML = `<div class="round">
            <input type="checkbox" ${
              task.isCompleted ? 'checked' : ''
            } id="checkbox" />
            <label for="checkbox"></label>
            <input type="text" name="tasks" class="input-text" id="${
              task.id
            }" value="${task.name}"/>
          </div>

          <div class="btn-container">
            
            <button type="button" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
          
            <button type="button" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>`;
  // edit item

  todoList.appendChild(todoItem);
  countTasks();
  container.classList.remove('hidden');
  const inputText = todoItem.querySelector('.input-text');
  inputText.setAttribute('readonly', 'readonly');

  const editBtn = todoItem.querySelector('.edit-btn');
  editBtn.addEventListener('click', function () {
    inputText.removeAttribute('readonly');
    inputText.focus();
    //update taskname in localstorage
    inputText.addEventListener('input', function () {
      const updatedTask = itemsArray.find((item) => item.id === task.id);
      updatedTask.name = inputText.value;
      localStorage.setItem('items', JSON.stringify(itemsArray));
    });
    // save changes and disable editing when input loses focus
    inputText.addEventListener('blur', () => {
      inputText.setAttribute('readonly', 'readonly');
      localStorage.setItem('items', JSON.stringify(itemsArray));
    });
    countTasks();
  });
  //function to delete
  const deleteBtn = todoItem.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    itemsArray = itemsArray.filter((item) => item.id !== task.id);
    localStorage.setItem('items', JSON.stringify(itemsArray));

    // remove todoItem from the DOM
    todoList.removeChild(todoItem);
    countTasks();

    // hide the container if there are no more tasks
    if (itemsArray.length === 0) {
      container.classList.add('hidden');
    }
  });
}
function countTasks() {
  const totalTask = itemsArray.length;
  const completedTask = itemsArray.filter((task) => task.isCompleted === true);
  remainingTask.textContent = totalTask - completedTask.length;
}
