let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ELEMENTOS
const grid = document.getElementById('tasks');
const modal = document.getElementById('modal');
const form = document.getElementById('taskForm');
const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');
const filterPriority = document.getElementById('filterPriority');

// CAMPOS DEL FORMULARIO
const taskId = document.getElementById('taskId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const subjectInput = document.getElementById('subject');
const dateInput = document.getElementById('date');
const priorityInput = document.getElementById('priority');

btnAdd.onclick = () => openModal();
btnCancel.onclick = closeModal;
filterPriority.onchange = render;

function openModal(task = null) {
  modal.classList.remove('hidden');
  form.reset();

  if (task) {
    taskId.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    subjectInput.value = task.subject;
    dateInput.value = task.date;
    priorityInput.value = task.priority;
  } else {
    taskId.value = '';
  }
}

function closeModal() {
  modal.classList.add('hidden');
}

form.onsubmit = e => {
  e.preventDefault();

  const task = {
    id: taskId.value ? Number(taskId.value) : Date.now(),
    title: titleInput.value,
    description: descriptionInput.value,
    subject: subjectInput.value,
    date: dateInput.value,
    priority: priorityInput.value
  };

  // ACTUALIZAR O CREAR
  tasks = tasks.filter(t => t.id !== task.id);
  tasks.push(task);

  save();
  closeModal();
};

function removeTask(id) {
  if (confirm('¿Eliminar tarea?')) {
    tasks = tasks.filter(t => t.id !== id);
    save();
  }
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

function render() {
  grid.innerHTML = '';
  const filter = filterPriority.value;

  tasks
    .filter(t => !filter || t.priority === filter)
    .forEach(t => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <span class="tag ${t.priority.toLowerCase()}">${t.priority}</span>
        <h3>${t.title}</h3>
        <p>${t.description.slice(0, 60)}${t.description.length > 60 ? '...' : ''}</p>
        <small>${t.subject} · ${t.date}</small>
        <div class="buttons">
          <button onclick="editTask(${t.id})">✏️</button>
          <button onclick="removeTask(${t.id})">🗑️</button>
        </div>
      `;

      grid.appendChild(card);
    });
}

// HACER EDITAR GLOBAL
window.editTask = id => {
  const task = tasks.find(t => t.id === id);
  openModal(task);
};

render();