const html = document.querySelector('html');
const modeToggle = document.querySelector('.mode-toggle');
const todoForm = document.querySelector('.todo-form');
const activity = document.querySelector('.form_input');
const todoList = document.querySelector('.todo-list');
const container = document.querySelector('.btn');
const remainingTask = document.querySelector('.no-of-tasks span');
const clearCompletedTask = document.querySelector('.clear-completed');
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

  activity.value = '';
});

function renderTask(task) {
  const todoItem = createTodoItemElement(task);
  todoList.appendChild(todoItem);

  const checkbox = todoItem.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      todoItem.classList.add('completed-item');
    } else {
      todoItem.classList.remove('completed-item');
    }
    const remainingTasks = itemsArray.filter(
      (task) => !task.isCompleted
    ).length;
    updateRemainingTasks(remainingTasks);
  });
}
function updateRemainingTasks(remainingTasks) {
  remainingTask.textContent = `${remainingTasks}`;
}

function createTodoItemElement(task) {
  const todoItem = document.createElement('div');
  todoItem.classList.add('todo-item');
  todoItem.setAttribute('id', task.id);

  const checkbox = createCheckbox(task);
  const inputText = createInputText(task.name);
  const editBtn = createEditButton(task, inputText);
  const deleteBtn = createDeleteButton(task, todoItem);

  todoItem.appendChild(checkbox);
  todoItem.appendChild(inputText);
  todoItem.appendChild(editBtn);
  todoItem.appendChild(deleteBtn);
  container.classList.remove('hidden');

  return todoItem;
}
function createCheckbox(task) {
  const checkboxDiv = document.createElement('div');
  checkboxDiv.classList.add('round');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.isCompleted;
  checkbox.id = `checkbox-${task.id}`;

  const label = document.createElement('label');
  label.setAttribute('for', `checkbox-${task.id}`);

  checkboxDiv.appendChild(checkbox);
  checkboxDiv.appendChild(label);

  return checkboxDiv;
}

function createInputText(value) {
  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.name = 'tasks';
  inputText.classList.add('input-text');
  inputText.value = value;
  inputText.setAttribute('readonly', 'readonly');

  return inputText;
}

function createEditButton(task, inputText) {
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.classList.add('edit-btn');
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';

  editBtn.addEventListener('click', () => {
    inputText.removeAttribute('readonly');
    inputText.focus();

    inputText.addEventListener('input', () => {
      task.name = inputText.value;
      localStorage.setItem('items', JSON.stringify(itemsArray));
    });

    inputText.addEventListener('blur', () => {
      inputText.setAttribute('readonly', 'readonly');
      localStorage.setItem('items', JSON.stringify(itemsArray));
    });
  });

  return editBtn;
}

function createDeleteButton(task, todoItem) {
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

  deleteBtn.addEventListener('click', () => {
    itemsArray = itemsArray.filter((item) => item.id !== task.id);
    localStorage.setItem('items', JSON.stringify(itemsArray));
    todoList.removeChild(todoItem);

    if (itemsArray.length === 0) {
      container.classList.add('hidden');
    }
  });

  return deleteBtn;
}
