document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('.create-task-form');
	const taskInput = document.querySelector('.task-input');
	const filterInput = document.querySelector('.filter-input');
	const taskList = document.querySelector('.collection');
	const clearBtn = document.querySelector('.clear-tasks');

	showTasks();

	form.addEventListener('submit', addTask);
	taskList.addEventListener('click', handleTaskActions);
	clearBtn.addEventListener('click', deleteAllTasks);
	filterInput.addEventListener('keyup', filterTasks);

	function showTasks() {
		const tasks = getTasksFromLocalStorage();
		tasks.forEach(task => createTaskElement(task.id, task.content));
	}

	function addTask(event) {
		event.preventDefault();
		const value = taskInput.value.trim();
		if (value) {
			const taskId = Date.now().toString(); 
			createTaskElement(taskId, value);
			storeTaskInLocalStorage(taskId, value);
			taskInput.value = '';
			filterInput.value = '';
			filterInput.dispatchEvent(new Event('keyup'));
		}
	}

	function createTaskElement(taskId, taskContent) {
		const li = document.createElement('li');
		li.innerHTML = `
			<span class="task-content">${taskContent}</span>
			<button class="edit btn-edit" style="display: inline;"><i class="fa fa-edit"></i></button>
			<button class="clear btn-delete" style="display: inline;"><i class="fa fa-trash"></i></button>`;
		li.dataset.id = taskId;
		taskList.appendChild(li);
	}

	function getTasksFromLocalStorage() {
		return JSON.parse(localStorage.getItem('tasks') || '[]');
	}

	function storeTaskInLocalStorage(taskId, taskContent) {
		const tasks = getTasksFromLocalStorage();
		tasks.push({ id: taskId, content: taskContent });
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	function handleTaskActions(event) {
		if (event.target.closest('.btn-delete')) {
			deleteTask(event);
		} else if (event.target.closest('.btn-edit') || event.target.parentNode.classList.contains('btn-edit')) {
			editTask(event);
		}
	}

	function deleteTask(event) {
		const taskElement = event.target.closest('li');
		const taskId = taskElement.dataset.id;
		if (confirm('Видалити це завдання?')) {
			taskElement.remove();
			removeTaskFromLocalStorage(taskId);
		}
	}

	function editTask(event) {
		const taskElement = event.target.closest('li');
		const taskId = taskElement.dataset.id;
		const taskContent = taskElement.querySelector('.task-content').textContent.trim();
		const updatedTaskContent = prompt('Відредагуйте завдання:', taskContent);

		if (updatedTaskContent !== null) {
			taskElement.querySelector('.task-content').textContent = updatedTaskContent;
			updateTaskInLocalStorage(taskId, updatedTaskContent);
		}
		const editedTaskValue = updatedTaskContent.trim().toLowerCase();
		const editButton = taskElement.querySelector('.btn-edit');
		const deleteButton = taskElement.querySelector('.btn-delete');
		editButton.style.display = editedTaskValue ? 'inline' : 'none';
		deleteButton.style.display = editedTaskValue ? 'inline' : 'none';
	}

	function updateTaskInLocalStorage(taskId, updatedTaskContent) {
		const tasks = getTasksFromLocalStorage();
		const taskToUpdate = tasks.find(task => task.id === taskId);
		if (taskToUpdate) {
			taskToUpdate.content = updatedTaskContent;
			localStorage.setItem('tasks', JSON.stringify(tasks));
		}
	}

	function removeTaskFromLocalStorage(taskId) {
		const tasks = getTasksFromLocalStorage();
		const filteredTasks = tasks.filter(task => task.id !== taskId);
		localStorage.setItem('tasks', JSON.stringify(filteredTasks));
	}

	function deleteAllTasks() {
		if (confirm('Ви впевнені, що хочете видалити всі завдання?')) {
			taskList.innerHTML = '';
			removeAllTasksFromLocalStorage();
		}
	}

	function removeAllTasksFromLocalStorage() {
		localStorage.removeItem('tasks');
	}

	function filterTasks(event) {
		const searchQuery = event.target.value.trim().toLowerCase();
		taskList.querySelectorAll('li').forEach(task => {
			const taskValue = task.querySelector('.task-content').textContent.toLowerCase();
			task.style.display = taskValue.includes(searchQuery) ? 'flex' : 'none';
		});
	}
});
