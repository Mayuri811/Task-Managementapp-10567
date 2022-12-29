const state={
    tasksList: []
}
const taskContent=document.querySelector(".task__contents");
const taskModal=document.querySelector(".task__modal__body");

const htmlTaskContent=({id, title, description, type, url})=>`
<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
        <div class='card-header d-flex gap-2 justify content-end task__card__header'>
            <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
                <i class='fas fa-pencil-alt' name=${id}></i>
            </button>
            <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
                <i class='fas fa-trash-alt' name=${id} ></i>
            </button>
        </div>
        <div clas='card-body'>
            ${
                url
                ? `
                <img width='100%' height='200px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class="p-2" />
              `
                : `
              <img width='100%' height='200px' style="object-fit: cover; object-position: center" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
              `
            }
            <h4 class='task__card__title px-3'>${title}</h4>
            <p class='description trim-3-lines text-muted px-3' data-gram_editor='false'>
            ${description}
            </p>
            <div class='tags text-white d-flex flex-wrap'>
            <span class='badge bg-primary mx-3 my-2'>${type}</span>
            </div>
        </div>
        <div class='card-footer'>
          <button 
          type='button' 
          class='btn btn-outline-primary float-right' 
          data-bs-toggle='modal'
          data-bs-target='#showTask'
          id=${id}
          onclick='openTask.apply(this, arguments)'
          
          >
            Open Task
          </button>
      </div>
        
        
    </div>
</div>
    
`;

const htmlModalContent=({id, title, description, type, url})=>{
    const date= new Date(parseInt(id));
    return `
    <div id=${id}>
        ${
            url
            ? `
            <img width='100%' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
          `
            : `
          <img width='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
          `
        }
        <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
        <h2 class='my-3'>${title}</h2>
        <p class='Lead'>
            ${description}
        </p>
 
        
    </div>
    `

}

const updateLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify({
        tasks: state.tasksList, 
    }))
     

}
const LoadInitialData = () =>{
    const LocalStorageCopy = JSON.parse(localStorage.tasks)

    if(LocalStorageCopy) state.tasksList = LocalStorageCopy.tasks;

    state.tasksList.map((cardData) => { 
         taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));

    });
}

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input ={
        url: document.getElementById("imageURL").value,
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        type: document.getElementById("tags").value,
    };
    if(input.title === '' || input.description === '' || input.type === ""){
        return alert("Please fill all the fields");
    }

    taskContent.insertAdjacentHTML("beforeend", htmlTaskContent({...input, id}));

    state.tasksList.push({...input, id});
    updateLocalStorage()

}
const openTask = (e) => {
    if (!e) e = window.event;
  
    const getTask = state.tasksList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
  };

const deleteTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.tasksList.filter(({ id }) => id !== targetID);
    state.tasksList = removeTask;
  
    updateLocalStorage();
    if (type === "BUTTON") {
      return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
      );
    }
  
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  };

const editTask = (e) => {
    if (!e) e = window.event;
  
    const targetID = e.target.id;
    const type = e.target.tagName;
  
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;
  
    if (type === "BUTTON") {
      parentNode = e.target.parentNode.parentNode;
    } else {
      parentNode = e.target.parentNode.parentNode.parentNode;
    }
  
    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];
  
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
  
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
  };

const saveEdit = (e) => {
    if (!e) e = window.event;
  
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes);
  
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];
  
    const updateData = {
      taskTitle: taskTitle.innerHTML,
      taskDescription: taskDescription.innerHTML,
      taskType: taskType.innerHTML,
    };
  
    let stateCopy = state.tasksList;
  
    stateCopy = stateCopy.map((task) =>
      task.id === targetID
        ? {
            id: task.id,
            title: updateData.taskTitle,
            description: updateData.taskDescription,
            type: updateData.taskType,
            url: task.url,
          }
        : task
    );
  
    state.tasksList = stateCopy;
    updateLocalStorage();
  
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
  
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
  };
const searchTask = (e) => {
    if (!e) e = window.event;
  
    while (taskContent.firstChild) {
      taskContent.removeChild(taskContent.firstChild);
    }
  
    const resultData = state.tasksList.filter(({ title }) => title.toLowerCase().includes(e.target.value.toLowerCase())
    );
  
    resultData.map((cardData) => {
      taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
  };