
const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");
const path = window.location.href;
const taskFormOwner = path.split('number=')[1];

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} number        the number of the Task
 * @param {string} description  the description of the Task
 * @param {string} name         the name of the Task
 * @param {string} result       the result of the Task
 * @param {string} date         the date of the Task
 * @param {string} schedule     the schedule of the Task
 * @param {string} material     the material of the Task
 */
const saveTask = (number, description, name, result, date,schedule,material) =>
  db.collection(taskFormOwner).doc().set({
    number,
    description,
    name,
    result,
    date,
    schedule,
    material,
  });

const getTasks = () => db.collection(taskFormOwner).get();

const onGetTasks = (callback) => db.collection(taskFormOwner).onSnapshot(callback);

const deleteTask = (id) => db.collection(taskFormOwner).doc(id).delete();

const getTask = (id) => db.collection(taskFormOwner).doc(id).get();

const updateTask = (id, updatedTask) => db.collection(taskFormOwner).doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
      
      <h3 class="h5">${task.number}</h3>
      <p>${task.name}</p>
      <p>${task.description}</p>    
      <p>${task.result}</p>
      <p>${task.date}</p>
      <p>${task.material}</p>
      <p>${task.schedule}</p>
    
    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Eliminar
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Modificar
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-number"].value = task.number;
          taskForm["task-description"].value = task.description;
          taskForm["task-name"].value = task.name;
          taskForm["task-result"].value = task.result;
          taskForm["task-date"].value = task.date;
          taskForm["task-schedule"].value = task.schedule;          
          taskForm["task-material"].value = task.material;
          console.log (taskForm["task-schedule"].value);

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Actualizar";

          } catch (error) {
            console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const number =       taskForm["task-number"];
  const description = taskForm["task-description"];
  const name =        taskForm["task-name"];
  const result =      taskForm["task-result"];
  const date =        taskForm["task-date"];
  const schedule =    taskForm["task-schedule"];
  const material =    taskForm["task-material"];  
  
  try {
    if (!editStatus) {
      await saveTask(number.value, description.value, name.value, result.value, date.value, schedule.value, material.value );
    } else {
      await updateTask(id, {
        number: number.value,
        description: description.value,
        name: name.value,
        result: result.value,
        date: date.value,
        schedule: schedule.value,
        material: material.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Grabar';
    }

    taskForm.reset();
    number.focus();
    } catch (error) {
      console.log(error);
      }
});
