const addTaskBtn = document.getElementById('addTask');
const btnText = addTaskBtn.innerText;
const yourTaskTextField = document.getElementById('Task');
const recordsDisplay = document.getElementById('records');
// Initialize todoslist from local storage
let edit_id = null;
let todoslist;


 function retrieveTodosListFromLocalStorage(){
   console.log("hello")
   let objStr = localStorage.getItem('tasks');
    return JSON.parse(objStr);
    
    
}



// Load tasks from API only if local storage is empty
if (!localStorage.getItem("tasks"))  {
    fetchTodoList();
    console.log("hello");
} else {
    // If local storage is not empty, display tasks from local storage
    todoslist=retrieveTodosListFromLocalStorage();
    console.log(todoslist);
    //DisplayInfo();

    console.log("ha")
}

// Function to fetch tasks from the API
async function fetchTodoList() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        const data = await response.json();
        

        todoslist= data.todos.map(({todo,completed})=> ({
            task: todo,
            status:completed ? 'done' : 'pending'
        }));
        SaveInfo();
        DisplayInfo();
        
    } catch (error) {
        console.error('Error fetching TODO list:', error);
    }
}


addTaskBtn.onclick = () => {
    const task = yourTaskTextField.value.trim();

    if (task === "") {
        alert("Task cannot be empty!"); 
        return; 
    }

    if (edit_id != null) {
        todoslist.splice(edit_id, 1, {
            'task': task,
            'status': document.getElementById(`status_${edit_id}`).value // Update status from dropdown
        });
        edit_id = null;
        SaveInfo(); // Call SaveInfo after editing
    } else {
        todoslist.push({
            'task': task,
            'status': 'pending' // New task's status is pending
        });

        // Save the new task immediately
        SaveInfo();

        // Display updated task list
        DisplayInfo();
    }

    yourTaskTextField.value = '';
    addTaskBtn.innerText = btnText;
};

function SaveInfo() {
    let str = JSON.stringify(todoslist);
    localStorage.setItem('tasks', str);
    DisplayInfo();
}

function DisplayInfo() {
    let statement = '';
    todoslist.forEach((task, i) => {
        const taskClass = task.status === 'done' ? 'task-completed' : '';
        statement += `<tr class="${taskClass}">
            <th scope="row">${i+1}</th>
            <td>${task.task}</td>
            <td>
                <select id="status_${i}" onchange="updateTaskStatus(${i})">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
                </select>
            </td>
            <td>
                <i class="btn text-white fa fa-edit btn-info mx-2" onclick='EditInfo(${i})'></i> 
                <i class="btn btn-danger text-white fa fa-trash" onclick='DeleteInfo(${i})'></i>
            </td>
        </tr>`;
    });
    recordsDisplay.innerHTML = statement;
}

function EditInfo(id) {
    edit_id = id;
    yourTaskTextField.value = todoslist[id].task;
    addTaskBtn.innerText = 'Save Changes';
    SaveInfo();
}

function DeleteInfo(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        todoslist.splice(id, 1);
        SaveInfo();
    }
}

function updateTaskStatus(id) {
    todoslist[id].status = document.getElementById(`status_${id}`).value;
    SaveInfo();
}

//select all tr of table
const allTr = document.querySelectorAll('#records tr');

//get text as query from search text field
const searchInputField = document.querySelector('#search');
searchInputField.addEventListener('input', function (e) {
   const searchStr = e.target.value.toLowerCase();
   recordsDisplay.innerHTML = '';
   allTr.forEach(tr => {
      const td_in_tr = tr.querySelectorAll('td');
      if (td_in_tr[0].innerText.toLowerCase().indexOf(searchStr) > -1) {
         recordsDisplay.appendChild(tr);
      }
   });

   if (recordsDisplay.innerHTML == '') {
      recordsDisplay.innerHTML = ' No Records Found';
   }
});

function countTasks() {
    const footer = document.createElement('footer');
    footer.classList.add('text-center', 'mt-3');
    const count = todoslist.length;
    footer.innerHTML = `<p>Total Tasks: ${count}</p>`;
    document.body.appendChild(footer);
}
countTasks(); 