//const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const card = document.getElementById('main-card');
const viewCheckbox = document.getElementById('view-checkbox');
const timerDisplay = document.querySelector('[data-testid="test-todo-time-remaining"]')
//const title = document.querySelector('[data-testid="test-todo-title"]');
//const statusText = document.querySelector('[data-testid="test-todo-status"]');
const label = document.querySelector('.toggle-complete');
//const badge = document.querySelector('[data-testid="test-todo-priority"]');
const tagList = document.querySelector('[data-testid="test-todo-tags"]')
const edit = document.querySelector('[data-testid="test-todo-edit-btn" ]');
const cancel = document.querySelector('[data-testid="test-todo-delete-btn"]')
const undoToast = document.getElementById('undo-toast');
const restoreBtn = document.getElementById('restore-btn');

let state = {
    title: "Initial Todo Task",
    desc: " Helps check if the task is done properly and helps in editing and deleting without confusion.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-04-20T18:00",
    isExpanded: false
};

function updateUI() {
	document.querySelector('[data-testid="test-todo-title"]').textContent = state.title;
	document.querySelector('[data-testid="test-todo-description"]').textContent = state.desc;
	document.querySelector('[data-testid="test-todo-priority"]').textContent = state.priority;
	document.querySelector('[data-testid="test-todo-status"]').textContent = state.status;

	viewCheckbox.checked = (state.status === "Done")
	

	card.classList.toggle('status-done', state.status === "Done");
	card.classList.toggle('status-inprogress', state.status === "In Progress");
	card.setAttribute('data-priority', state.priority);

	//Expand/Collapse Logic
    const section = document.getElementById('collapsible-section');
    const toggleBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
    section.hidden = !state.isExpanded;
    toggleBtn.setAttribute('aria-expanded', state.isExpanded);
	toggleBtn.textContent = state.isExpanded ? "Collapse" : "Expand"; 
}


// if (checkbox && title && statusText && label && badge) {
// 	checkbox.addEventListener('change', (e) => {
// 		const isChecked = e.target.checked;
// 		const taskName = title.textContent;

		
// 		// const newLabel = `Mark "${taskName}" as ${isChecked ? 'incomplete' : 'complete'}`;
// 		// checkbox.setAttribute('aria-label', newLabel);

		
// 		if (isChecked) {
// 			title.style.textDecoration = "line-through";
// 			statusText.textContent = "Done";
// 			label.textContent = "Complete"
// 			badge.textContent = "🟡Low"
// 		} else {
// 			title.style.textDecoration = "none";
// 			statusText.textContent = "Pending";
// 			label.textContent = "Incomplete";
// 			badge.textContent = "🔴High"
// 		}

// 		console.log(`Task "${taskName}" updated`)
// 	});
// } 


// Calculate Time Remaining
function startCountdown() {
	const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');


	if (state.status === "Done") {
		timerDisplay.textContent = "Completed";
		overdueIndicator.hidden = true;
		return
	}

	const diff = new Date(state.dueDate) - new Date();
	const isOverdue = diff < 0;
	const absDiff = Math.abs(diff);

	overdueIndicator.hidden = !isOverdue;
  	timerDisplay.style.color = isOverdue ? "red" : "inherit";

	if (diff < 0) {
		overdueIndicator.hidden = false;
		timerDisplay.classList.add('overdue-text');
	} else {
		overdueIndicator.hidden = true;
		timerDisplay.classList.remove('overdue-text');
	}

	
	const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
	const hrs = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
	const mins = Math.floor((absDiff / 1000 / 60) % 60);
	const secs = Math.floor((absDiff / 1000) % 60);

	timerDisplay.textContent = `${isOverdue ? 'Overdue by ' : 'Due in '}${days}d ${hrs}h ${mins}m ${secs}s`
	
}

viewCheckbox.addEventListener('change', (e) => {
	state.status = e.target.checked ? "Done" : "Pending";
	updateUI
})

// Expand Toggle
document.querySelector('[data-testid="test-todo-expand-toggle"]').onclick = () => {
    state.isExpanded = !state.isExpanded;
    updateUI();
};

if (tagList) {
	tagList.addEventListener('click', (e) => {
		//checks if what was clicked was tag button
		const clickedtag = e.target.closest('button')

		if (clickedtag) {
			const tagName = clickedtag.textContent.trim();
			console.log(`Filtering by tag: ${tagName}`);

			clickedtag.classList.toggle('active')
		}
	})
}

edit.addEventListener('click', (e) => {
	e.preventDefault();

	document.getElementById('view-mode').hidden = true;
    document.getElementById('edit-mode').hidden = false;

	// Fill form
    document.getElementById('edit-title').value = state.title;
    document.getElementById('edit-desc').value = state.desc;
    document.getElementById('edit-priority').value = state.priority;
    document.getElementById('edit-status').value = state.status;
    document.getElementById('edit-date').value = state.dueDate;
})



if (cancel && card) {
	cancel.addEventListener('click', (e) => {
		const confirmDelete = confirm("Are sure you want to delet this task?");
		if (confirmDelete) {

			card.style.display = 'none';
			undoToast.style.display = 'flex';

			deleteTimeout = setTimeout(() => {
				card.remove();
				undoToast.style.display = 'none'
				console.log("Task deleted permanently")
			}, 6000)
		}
	})
}

//handle save
document.getElementById('edit-mode').onsubmit = (e) => {
    e.preventDefault();
    state.title = document.getElementById('edit-title').value;
    state.desc = document.getElementById('edit-desc').value;
    state.priority = document.getElementById('edit-priority').value;
    state.status = document.getElementById('edit-status').value;
    state.dueDate = document.getElementById('edit-date').value;

    document.getElementById('view-mode').hidden = false;
    document.getElementById('edit-mode').hidden = true;
    updateUI();
};

document.querySelector('[data-testid="test-todo-cancel-button"]').onclick = () => {
  document.getElementById('view-mode').hidden = false;
  document.getElementById('edit-mode').hidden = true;
};

document.querySelector('[data-testid="test-todo-complete-toggle"]').onchange = (e) => {
	
    state.status = e.target.checked ? "Done" : "Pending";
	console.log("clicked")
    updateUI();
};

restoreBtn.addEventListener('click', () => {
	clearTimeout(deleteTimeout);
	card.style.display = "block";
	undoToast.style.display = "none"

})

// Initial run and simple interval
setInterval(startCountdown, 1000)
updateUI();