$("#theme_btn").on('click',function()
{
    $('body').toggleClass('dark-theme');
    if($('body').hasClass('dark-theme'))
    {
        $("#theme_btn").text('☀️')
    }
    else
    {
        $("#theme_btn").text('🌙')
    }
})


const MentorAPI = "http://localhost:3000/Mentor";
const StudentsAPI = "http://localhost:3000/Students";
const CoursesAPI = "http://localhost:3000/Courses";

const currentUser = localStorage.getItem("MentorEmail"); 
let currentTab = "Dashboard";

toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "timeOut": "3000"
};


async function fetchCourses() {
    // currentTab = "Dashboard";
    try
    {
        const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        const data = await response.json();
        
        const CourseListContainer = document.getElementById("CourseListContainer")
        CourseListContainer.innerHTML = ""; 
        data.forEach(element => {
        const courseCard = document.createElement('div')
        courseCard.classList.add("col-6", "mb-4");
        courseCard.innerHTML = 
        `   
            <div class="card card-custom shadow rounded-4 h-100">
                <div class="card-body">
                <div class = "row">
                <div class="col-10">
                    <h3 class="fw-bold">📚 ${element.title}</h3>
                    <p class="text-muted">🕒 ${element.duration} Months</p>
                    <p class="card-text">${element.description}</p>
                </div>
                <div class = "col-2 d-flex flex-column justify-content-start">
                    <button class = "btn btn-danger m-0 " style = "width : 75%" onclick ="deleteCourse('${element.id}')"><i class="fa-solid fa-delete-left"></i></button>
                </div>
                </div>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button class="btn btn-custom" data-bs-toggle = "modal" data-bs-target="#editCourseModal"
                                            onclick="openEditCourseModel('${element.id}', '${element.title}', '${element.duration}', '${element.department}', '${element.description}')">
                        Edit Details
                    </button>
                </div>
            </div>
            
        `;
        CourseListContainer.appendChild(courseCard);
        });
        fetchCount();
        fetchMentor();
    }
    catch(error)
    {
        toastr.error(error)
    }
}
// fetchCourses();
refreshTab();

const addCourseTitle = document.getElementById("addCourseTitle");
const addCourseDuration = document.getElementById("addCourseDuration");
const addCourseDesc = document.getElementById("addCourseDesc");
const addCoursebtn = document.getElementById("addCoursebtn")



async function addCourse()
{
    let isDeleted = false;

    if(addCourseTitle.value == "" || addCourseDuration.value == "" || addCourseDesc.value == "")
    {
        toastr.error("Fill all fields")
        return;
    }

    const response = await fetch(`${MentorAPI}?email=${currentUser}`);
    const data = await response.json();
    const department = data[0].department;

    // const select = document.getElementById("addCourseDepartment");

    // if(department === "IT")
    // {
    //     select.innerHTML = `
    //     <option value=" ">Department</option>
    //     <option value="IT">IT</option>
    //     <option value="Finance" disabled>FINANCE</option>
    //     `;
    // }
    // else
    // {
    //     select.innerHTML = `
    //     <option value=" ">Department</option>
    //     <option value="IT" disabled>IT</option>
    //     <option value="Finance" >FINANCE</option>
    //     `;
    // }

    let course = {
        title : addCourseTitle.value,
        duration : addCourseDuration.value,   
        department : department,
        description : addCourseDesc.value,
        createdby : currentUser,
        isDeleted : isDeleted
    }

    try
    {
        const response = await fetch(CoursesAPI,{
            method : "POST",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(course)
        })
        Swal.fire(
            "ADDED!",
            "New Course added to the list",
            "success"
        );
         const modal = bootstrap.Modal.getInstance(document.getElementById("addCourseModal"));
        modal.hide();

        fetchCourses();

        if(!response.ok)
        {
            throw new Error("Failed to Fetch");
        }
    }
    catch(error)
    {
        toastr.error(error);
    }

}
addCoursebtn.addEventListener('click',addCourse);

async function deleteCourse(id) {
    
    const result = await Swal.fire({
        title : "Delete Course?",
        text : "Course will be Deleted but can be Restored",
        icon: "warning",
        showCancelButton : true,
        confirmButtonText : "Yes,Delete!",
        cancelButtonText : "No"
    });

    if(!result.isConfirmed)
    {
        return;
    }
    try{
        const response = await fetch(`${CoursesAPI}/${id}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isDeleted : true
            })
        })

        Swal.fire(
            "Deleted!",
            "Course Deleted Successfully",
            "success"
        )

        refreshTab();
    }
    catch(error)
    {
        toastr.error(error);
    }

}

async function fetchRestoreCourse() {
    
    currentTab = "restoreModal";

    const restoreCourseModalContainer = document.getElementById("restoreCourseModalContainer")
    restoreCourseModalContainer.innerHTML = ``;
    try
    {
        const response = await fetch(`${CoursesAPI}?isDeleted=true`);
        const data = await response.json();
        
        data.forEach(element =>{
        const div = document.createElement("div");
        div.classList.add()
div.innerHTML = `
    <div class="card card-custom shadow rounded-4 h-100 p-3">

        <div class="card-body">
            <h3 class="fw-bold mb-2">
                📚 ${element.title}
            </h3>

            <p class="text-muted mb-2">
                🕒 ${element.duration} Months
            </p>

            <p class="mb-2">
                🏢 ${element.department}
            </p>

            <p class="card-text">
                ${element.description}
            </p>
        </div>

        <div class="card-footer bg-transparent border-0 d-flex justify-content-end gap-2">

            <button
                class="btn btn-outline-danger rounded-pill px-3"
                onclick="restoreCourse('${element.id}')">
                Restore
            </button>

        </div>

    </div>
`;
        restoreCourseModalContainer.appendChild(div);

        });
    }
    catch(error)
    {
        toastr.error(error);
    }
}

document.getElementById("restoreCoursesbtn").addEventListener('click',fetchRestoreCourse)

async function restoreCourse(id) {

    const result = await Swal.fire({
        title : "Restore Course?",
        text : "Course will be Restored",
        icon: "warning",
        showCancelButton : true,
        confirmButtonText : "Yes,Delete!",
        cancelButtonText : "No"
    });

    if(!result.isConfirmed)
    {
        return;
    }
    try{
        const response = await fetch(`${CoursesAPI}/${id}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isDeleted : false
            })
        })

        Swal.fire(
            "Restored!",
            "Course Restored Successfully",
            "success"
        )
        // const restoreCourseModal = bootstrap.Modal.getInstance(document.getElementById("restoreCourseModal"));
        // restoreCourseModal.hide()
        refreshTab();
    }
    catch(error)
    {
        toastr.error(error);
    }
}

const numofCources =document.getElementById("numofCources");
const numofStudents =document.getElementById("numofStudents");
const numofActiveStudents =document.getElementById("numofActiveStudents");

async function fetchCount()
{
    try
    {
        const courseResponse = await fetch(CoursesAPI);
        const courseData = await courseResponse.json();

        numofCources.textContent = courseData.length;

        const studentResponse = await fetch(StudentsAPI);
        const studentData = await studentResponse.json();

        numofStudents.textContent = studentData.length;
    }
    catch(error)
    {
        toastr.error(error);
    }
}
// fetchCount();
async function fetchMentor() {

    const mentorDetailsCointainer = document.getElementById("mentorDetailsCointainer");
    mentorDetailsCointainer.innerHTML =  ``;
    try
    {
        const response = await fetch(`${MentorAPI}?email=${currentUser}`);
        const data = await response.json();

        if(data[0].gender === "Male")
        {
        const div =document.createElement('div');
        div.classList.add('row','g-4')
        div.innerHTML = `
        <div class="col-6 d-flex justify-content-center">
            <img src="../assets/male.png" width="50%" height="100%" class ="theme-icon">
        </div> 
        <div class="col-6 d-flex flex-column justify-content-start gap-2 ">
            <h2>${data[0].name}</h2>
            <h5>${data[0].department}</h5>
            <button class=" btn btn-custom w-50">View Details</button>
        </div>

        `;
        mentorDetailsCointainer.appendChild(div);
        }
        else
        {
        const div =document.createElement('div');
        div.classList.add('row','g-4')
        div.innerHTML = `
        <div class="col-6 d-flex justify-content-center">
            <img src="../assets/woman.png" width="50%" height="100%">
        </div> 
        <div class="col-6 d-flex flex-column justify-content-start gap-2 ">
            <h2>${data[0].name}</h2>
            <h5>${data[0].department}</h5>
            <button class=" btn btn-custom w-50">View Details</button>
        </div>

        `;
        mentorDetailsCointainer.appendChild(div);
        }

    }
    catch(error)
    {
        toastr.error(error)
    }
}

async function fetchCourseList() {

    currentTab = "CourseList";

    const viewCourseModalContainer = document.getElementById("viewCourseModalContainer");
    viewCourseModalContainer.innerHTML = ``;
    try
    {   
        const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        const data = await response.json();

        data.forEach(element =>{
        const div = document.createElement("div");
        div.classList.add()
    div.innerHTML = `
        <div class="card card-custom shadow rounded-4 h-100 p-3">
            <div class="card-body">
                <h3 class="fw-bold mb-2">
                    📚 ${element.title}
                </h3>
                <p class="text-muted mb-2">
                    🕒 ${element.duration} Months
                </p>
                <p class="mb-2">
                    🏢 ${element.department}
                </p>
                <p class="card-text">
                    ${element.description}
                </p>
            </div>
            <div class="card-footer bg-transparent border-0 d-flex justify-content-end gap-2">
                <button
                    class="btn btn-outline-danger rounded-pill px-3"
                    onclick ="deleteCourse('${element.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#editCourseModal"
                    class="btn btn-custom rounded-pill px-3"
                    onclick="openEditCourseModel('${element.id}','${element.title}','${element.duration}','${element.department}','${element.description}')">
                    ✏️ Edit
                </button>
            </div>
        </div>
    `;
        viewCourseModalContainer.appendChild(div);

        // document.getElementById("viewCourseModal").addEventListener("hidden.bs.modal", function () {
        //     viewCourseModalContainer.innerHTML = "";
        // });

        });
        
    }
    catch(error)
    {
        toastr.error(error)
    }
}
let updatedCourseId;

async function openEditCourseModel(id,title,duration,department,description) {
    
    updatedCourseId = id;

    const editCourseTitle = document.getElementById("editCourseTitle");
    const editCourseDuration = document.getElementById("editCourseDuration");
    const editCourseDepartment = document.getElementById("editCourseDepartment");
    const editCourseDesc = document.getElementById("editCourseDesc");

    editCourseTitle.value = title;
    editCourseDuration.value = duration;
    editCourseDepartment.value = department;
    editCourseDesc.value = description;
}

 document.getElementById("editCoursebtn").addEventListener('click',async function(){


    const editCourseTitle = document.getElementById("editCourseTitle").value;
    const editCourseDuration = document.getElementById("editCourseDuration").value;
    const editCourseDepartment = document.getElementById("editCourseDepartment").value;
    const editCourseDesc = document.getElementById("editCourseDesc").value;

    console.log(editCourseTitle)
    
    const updatedCourse = {
    title : editCourseTitle,
    duration : editCourseDuration ,
    department: editCourseDepartment,
    description: editCourseDesc ,
    }

    try
    {
        const response = await fetch(`${CoursesAPI}/${updatedCourseId}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(updatedCourse)
        });
        Swal.fire(
            "UPDATED!",
            "Course added updated",
            "success"
        );
        const modal = bootstrap.Modal.getInstance(document.getElementById("editCourseModal"));
        modal.hide();
        console.log(currentTab);
        refreshTab();
    }
    catch(error){
        toastr.error(error)
    }
 }); 

async function fetchStudentList() {
    const viewStudentModalContainer = document.getElementById("viewStudentModalContainer")
    viewStudentModalContainer.innerHTML = ``;
    try
    {   
        const response = await fetch(StudentsAPI);
        const data = await response.json();

        data.forEach(element =>{
        const div = document.createElement('div')
        div.classList.add()
        div.innerHTML =
        `
        <div class="card card-custom shadow rounded-4 h-100 border-0">
            <div class="card-body">
                <h3 class="fw-bold mb-3">👤 ${element.name}</h3>
                <p class="mb-2"><strong>🆔 Roll No:</strong> ${element.rollnum}</p>

                <p class="mb-2"><strong>📧 Email:</strong> ${element.email}</p>
                <p class="mb-2"> <strong>⚧ Gender:</strong> ${element.gender}</p>
                <p class="mb-0"><strong>🏫 Department:</strong> ${element.department}</p>
            </div>
        </div>
        `;
        console.log(element.title);
        viewStudentModalContainer.appendChild(div)
        })
        
        document.getElementById("viewStudentModal").addEventListener("hidden.bs.modal", function () {
            viewStudentModalContainer.innerHTML = "";
        });

    }
    catch(error)
    {
        toastr.error(error)
    }
}


document.getElementById("viewCoursesbtn").addEventListener('click',fetchCourseList)
document.getElementById("viewStudentbtn").addEventListener('click',fetchStudentList);

async function refreshTab() {

    if(currentTab === "Dashboard") {

        document.getElementById("CourseListContainer").innerHTML = "";
        fetchCourses();
    }

    else if(currentTab === "CourseList") {

        document.getElementById("viewCourseModalContainer").innerHTML = "";
        fetchCourseList();   
        fetchCourses(); 
}
    else if(currentTab === "restoreModal")
    {
        document.getElementById("restoreCourseModalContainer").innerHTML = ``;
        fetchRestoreCourse();
        console.log("Reenderd")
        fetchCourses();
    }
}

const filterVal = document.getElementById("filterVal").value();

async function filterCourses() {
    
    try
    {
        if(filterVal === "FINANCE")
        {
            const CourseListContainer = document.getElementById("CourseListContainer")
            CourseListContainer.innerHTML = "";         
            
            const response = await fetch(`${CoursesAPI}?isDeleted=false&department=FINANCE`)
            const data = await response.json();
            
            data.forEach(element => {
            const courseCard = document.createElement('div')
            courseCard.classList.add("col-6", "mb-4");
            courseCard.innerHTML = 
            `   
                <div class="card card-custom shadow rounded-4 h-100">
                    <div class="card-body">
                    <div class = "row">
                    <div class="col-10">
                        <h3 class="fw-bold">📚 ${element.title}</h3>
                        <p class="text-muted">🕒 ${element.duration} Months</p>
                        <p class="card-text">${element.description}</p>
                    </div>
                    <div class = "col-2 d-flex flex-column justify-content-start">
                        <button class = "btn btn-danger m-0 " style = "width : 75%" onclick ="deleteCourse('${element.id}')"><i class="fa-solid fa-delete-left"></i></button>
                    </div>
                    </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 d-flex justify-content-between">
                        <button class="btn btn-custom" data-bs-toggle = "modal" data-bs-target="#editCourseModal"
                                                onclick="openEditCourseModel('${element.id}', '${element.title}', '${element.duration}', '${element.department}', '${element.description}')">
                            Edit Details
                        </button>
                    </div>
                </div>
                
            `;
            CourseListContainer.appendChild(courseCard);
            });

        }
    }
    catch(error)
    {
        toastr.error(error)
    }

}

document.getElementById('filterIT').addEventListener('clc')
