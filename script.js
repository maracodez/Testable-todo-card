const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const card = document.querySelector('[data-testid="test-todo-card"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const statusText = document.querySelector('[data-testid="test-todo-status"]');
const label = document.querySelector('.toggle-complete');
const badge = document.querySelector('[data-testid="test-todo-priority"]');
const tagList = document.querySelector('[data-testid="test-todo-tags"]')
const edit = document.querySelector('[data-testid="test-todo-edit-btn" ]');
const cancel = document.querySelector('[data-testid="test-todo-delete-btn"]')
const undoToast = document.getElementById('undo-toast');
const restoreBtn = document.getElementById('restore-btn');


if (checkbox && title && statusText && label && badge) {
	checkbox.addEventListener('change', (e) => {
		const isChecked = e.target.checked;
		const taskName = title.textContent;

		
		// const newLabel = `Mark "${taskName}" as ${isChecked ? 'incomplete' : 'complete'}`;
		// checkbox.setAttribute('aria-label', newLabel);

		
		if (isChecked) {
			title.style.textDecoration = "line-through";
			statusText.textContent = "Done";
			label.textContent = "Complete"
			badge.textContent = "🟡Low"
		} else {
			title.style.textDecoration = "none";
			statusText.textContent = "Pending";
			label.textContent = "Incomplete";
			badge.textContent = "🔴High"
		}

		console.log(`Task "${taskName}" updated`)
	});
} 


// Calculate Time Remaining
function updateCountdown() {
  const dueDate = new Date("2026-05-01T18:00:00").getTime();
  const now = new Date().getTime();
  const diff = dueDate - now;
  const timeDisplay = document.querySelector('[data-testid="test-todo-time-remaining"]');

  if (diff < 0) {
    timeDisplay.textContent = "Overdue!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days >= 2) timeDisplay.textContent = `Due in ${days} days`;
  else if (days === 1) timeDisplay.textContent = "Due tomorrow";
  else timeDisplay.textContent = "Due now!";
}

// Initial run and simple interval
updateCountdown();
setInterval(updateCountdown, 60000);

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

if (edit && title) {
	edit.addEventListener("click", (e) => {

		//simple way to edit window.prompt
		const newTitle = prompt("Edit Task Title:", title.textContent);

		if (newTitle !== null && newTitle.trim() !== "") {
			title.textContent = newTitle;
			console.log("Tag title updated to:", newTitle)
		}
	})
}

let deleteTimeout;

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

restoreBtn.addEventListener('click', () => {
	clearTimeout(deleteTimeout);
	card.style.display = "block";
	undoToast.style.display = "none"

})