import { MentorAPI,StudentsAPI,CoursesAPI,CoursesEndrolled } from "./services/api.js";


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

const currentUser = localStorage.getItem("StudentEmail"); 
let currentTab = "Dashboard";




async function fetchCourses() {
    // currentTab = "Dashboard";
    try
    {
        // const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        // const data = await response.json();

        const enrollCoursesListResp = await fetch(`${CoursesEndrolled}?studentEmail=${currentUser}`);
        const enrollCoursesList = await enrollCoursesListResp.json();

    renderCourses(enrollCoursesList);
    }
    catch(error)
    {
        toastr.error(error)
    }
}
// fetchCourses();
refreshTab();

async function renderCourses(data) {
    
    try{
        const CourseListContainer = document.getElementById("CourseListContainer");
        if(data.length == 0)
        {
            CourseListContainer.innerHTML = `
            
                <div class="text-center py-5">
                    <div class="display-1">📚</div>
                    <h3 class="fw-bold text-secondary mt-3">No Courses Found</h3>
                    <p class = "text-secondary">
                        You don't have any courses in this category at the moment.
                    </p>
                </div>

            `;
            return;
        }
        CourseListContainer.innerHTML = ""; 
        data.forEach(element => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("mb-4");

        courseCard.innerHTML = `
        <div class="card card-custom shadow-lg border-0 rounded-4 h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h4 class="fw-bold mb-1">📚 ${element.courseTitle}</h4>
                        <small class="text-muted">
                            🕒 ${element.courseDuration} Months
                        </small>
                    </div>
                    <span class="badge bg-primary fs-6">
                        ${element.status}
                    </span>
                </div>
                <hr>
                <p class="mb-2">
                    🏢 <strong>Department:</strong>
                    ${element.studentDepartment}
                </p>
                <p class="mb-2">
                    📅 <strong>Start Date:</strong>
                    ${element.startDate}
                </p>
                <p class="text-secondary">
                    ${element.courseDescription}
                </p>
            </div>
            <div class="card-footer card-custom border-0 d-flex justify-content-end">
                    <select
                        id="status${element.id}"
                        class="form-select status-select me-2" data-id="${element.id}">

                        <option value ="Not yet Started">Not yet Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value ="Completed">Completed</option>

                    </select>

                    <button
                        class="btn btn-success showDropdownbtn"
                        data-id='${element.id}'
                        >

                        Update Status

                    </button>
            </div>
        </div>
        `;
        CourseListContainer.appendChild(courseCard);
        });
    }
    catch(error)
    {
        toastr.error(error)
    }
}
document.addEventListener('click',function(e){
    const btn = e.target.closest(".showDropdownbtn");
    if(!btn) return;
    const id = btn.dataset.id;
    if(!id) return;
    showDropdown(id);
})
function showDropdown(id){

    document
        .getElementById(`status${id}`)
        .classList.add("show");

}
document.addEventListener('change', function(e) {
    const selectEl = e.target.closest('.status-select');
    if (!selectEl) return;
    const id = selectEl.dataset.id;
    const value = selectEl.value;
    changeStatus(id, value);
});

async function changeStatus(id,value) {

    try{

        const response = await fetch(`${CoursesEndrolled}?id=${id}`)
        const data = await response.json(); 
        
        console.log(data)
        
        const result = await Swal.fire({
        text : `Change Status of this Course "${data[0].courseTitle}" to ${value} ?`,
        icon: "question",
        showCancelButton : true,
        confirmButtonText : "Yes,Change It!",
        cancelButtonText : "No"
        })

        if(!result.isConfirmed)
        {
            return;
        }

        await fetch(`${CoursesEndrolled}/${id}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({status : value})
    })

        refreshTab();

    }
    catch(error)
    {
        toastr.error(error)
    }
}

document.getElementById("Not_yet_started_btn").addEventListener('click',async function fetchNotyetCourses() {
    
     try
    {
        // const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        // const data = await response.json();

        const notyetCoursesListResp = await fetch(`${CoursesEndrolled}?studentEmail=${currentUser}&status=not yet started`);
        const notyetCoursesList = await notyetCoursesListResp.json();

        renderCourses(notyetCoursesList);

    }
    catch(error)
    {
        toastr.error(error)
    }


})  

document.getElementById("In_Progress_btn").addEventListener('click',async function fetchIn_Progress_btnCourses() {
    
     try
    {
        // const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        // const data = await response.json();

        const In_ProgressCoursesListResp = await fetch(`${CoursesEndrolled}?studentEmail=${currentUser}&status=In Progress`);
        const In_ProgressCoursesList = await In_ProgressCoursesListResp.json();

        renderCourses(In_ProgressCoursesList);
        console.log(In_ProgressCoursesList);

    }
    catch(error)
    {
        toastr.error(error)
    }


})  

document.getElementById("Completed_btn").addEventListener('click',async function fetchICompletedbtnCourses() {
    
     try
    {
        // const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        // const data = await response.json();

        const CompletedCoursesListResp = await fetch(`${CoursesEndrolled}?studentEmail=${currentUser}&status=Completed`);
        const CompletedCoursesList = await CompletedCoursesListResp.json();

        const CourseListContainer = document.getElementById("CourseListContainer");
        if(CompletedCoursesList.length == 0)
        {
            CourseListContainer.innerHTML = `
            
                <div class="text-center py-5">
                    <div class="display-1">📚</div>
                    <h3 class="fw-bold text-secondary mt-3">No Courses Found</h3>
                    <p class = "text-secondary">
                        You don't have any courses in this category at the moment.
                    </p>
                </div>

            `;
            return;
        }
        CourseListContainer.innerHTML = ""; 
        CompletedCoursesList.forEach(element => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("mb-4");

        courseCard.innerHTML = `
        <div class="card card-custom shadow-lg border-0 rounded-4 h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h4 class="fw-bold mb-1">📚 ${element.courseTitle}</h4>
                        <small class="text-muted">
                            🕒 ${element.courseDuration} Months
                        </small>
                    </div>
                    <span class="badge bg-primary fs-6">
                        ${element.status}
                    </span>
                </div>
                <hr>
                <p class="mb-2">
                    🏢 <strong>Department:</strong>
                    ${element.studentDepartment}
                </p>
                <p class="mb-2">
                    📅 <strong>Start Date:</strong>
                    ${element.startDate}
                </p>
                <p class="text-secondary">
                    ${element.courseDescription}
                </p>
            </div>

        </div>
        `;
        CourseListContainer.appendChild(courseCard);
        });

        console.log(CompletedCoursesList);

    }
    catch(error)
    {
        toastr.error(error)
    }


})  


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
//     else if(currentTab === "restoreModal")
//     {
//         document.getElementById("restoreCourseModalContainer").innerHTML = ``;
//         fetchRestoreCourse();
//         console.log("Reenderd")
//         fetchCourses();
//     }
}

document.getElementById("UserDetailbtn").addEventListener('click',async function(){

    try{
        setTimeout(()=>{
             window.location.replace('Details.html');
        },3060)
        toastr.success("Redirecting to User Details Page...")
    }
    catch(error)
    {
        toastr.error(error)
    }

})
document.getElementById("HomePagebtn").addEventListener('click',async function(){

    try{
        setTimeout(()=>{
             window.location.replace('StudentDashboard.html');
        },3060)
        toastr.success("Redirecting to Student DashBoard...")
    }
    catch(error)
    {
        toastr.error(error)
    }

})