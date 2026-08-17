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

document.getElementById("enrolledCoursesbtn").addEventListener("click",function(){
    window.location.href = "EnrolledCourses.html"
})

async function fetchCourses() {
    // currentTab = "Dashboard";
    try
    {
        const response = await fetch(`${CoursesAPI}?isDeleted=false`);
        const data = await response.json();

        renderCourse(data);

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

async function renderCourse(data) {

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
                    <p class="">🕒 ${element.duration} Months</p>         
                    <span class="badge text_col mb-2 fs-6">
                        🏢 ${element.department}
                    </span>
                    <p class="card-text">${element.description}</p>
                </div>
                <div class = "col-2 d-flex flex-column justify-content-start">
                </div>
                </div>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button class="btn btn-custom enrollBtn" data-id='${element.id}'>
                        ENROLL
                    </button>
                </div>
            </div>  
        `;
        CourseListContainer.appendChild(courseCard);
        });
    
}
document.getElementById("AllCoursebtn").addEventListener('click',function(){
    fetchCourses()
})

async function recommendCourses() {

    try
    {
       const studentDepartmentFetch = await fetch(`${StudentsAPI}?email=${currentUser}`);
        const studentDepartmentFetchdata = await studentDepartmentFetch.json();
        const studentDepartment = studentDepartmentFetchdata[0].department;

        const CourseDetailsFetch = await fetch(`${CoursesAPI}?department=${studentDepartment}`);
        const CourseDetailsFetchdata = await CourseDetailsFetch.json();

        console.log(studentDepartment);
        renderCourse(CourseDetailsFetchdata);

    }
    catch(error)
    {
        toastr.error(error)
    }

}
document.getElementById("RecommendedCoursebtn").addEventListener('click',recommendCourses)
async function fetchMentor() {

    const studentDetailsCointainer = document.getElementById("studentDetailsCointainer");
    studentDetailsCointainer.innerHTML =  ``;
    try
    {
        const response = await fetch(`${StudentsAPI}?email=${currentUser}`);
        const data = await response.json();

        if(data[0].gender === "Male")
        {
        const div =document.createElement('div');
        div.classList.add('row','g-4')
        div.innerHTML = `
        <div class="col-6 d-flex justify-content-center ">
            <img src="../assets/male.png" width="50%" height="100%" class ="theme-icon">
        </div> 
        <div class="col-6 d-flex flex-column justify-content-start gap-2 ">
            <h2>${data[0].name}</h2>
            <h5>${data[0].department}</h5>

            <button class=" btn btn-custom w-50 UserDetailbtn">
            View Details
            </button>
        </div>

        `;
        studentDetailsCointainer.appendChild(div);
        }
        else
        {
        const div =document.createElement('div');
        div.classList.add('row','g-4')
        div.innerHTML = `
        <div class="col-6 d-flex justify-content-center">
            <img src="../assets/woman.png" width="50%" height="100%" class ="theme-icon">
        </div> 
        <div class="col-6 d-flex flex-column justify-content-start gap-2 ">
            <h2>${data[0].name}</h2>
            <h5>${data[0].department}</h5>
            <button class=" btn btn-custom w-50 UserDetailbtn">View Details</button>
        </div>

        `;
        studentDetailsCointainer.appendChild(div);
        }

    }
    catch(error)
    {
        toastr.error(error)
    }
}
document.addEventListener('click',function(e){
    const enrollBtn = e.target.closest(".enrollBtn");
    if(!enrollBtn) return;
    const id = enrollBtn.dataset.id;
    if(!id) return;
    enrollCourse(id);
})
async function enrollCourse(id) 
{
    const currentcourseID = id;

    try{
            const result = await Swal.fire({
            title : "Do you want to Enroll this Course?",
            icon: "question",
            showCancelButton : true,
            confirmButtonText : "Yes,Enroll Me!",
            cancelButtonText : "No"
        })

        if(!result.isConfirmed)
        {
            return;
        }

        const studentDetailsresponse = await fetch(`${StudentsAPI}?email=${currentUser}`);
        const studentDetails = await studentDetailsresponse.json();

        console.log(studentDetails);

        const studentRollnum = studentDetails[0].rollnum;
        const studentName = studentDetails[0].name;
        const studentEmail = studentDetails[0].email;
        const studentDepartment = studentDetails[0].department;

        const courseDetailsresp = await fetch(`${CoursesAPI}/${currentcourseID}`);
        const courseDetail = await courseDetailsresp.json();

        // console.log(courseDetail);
        
        const courseId = currentcourseID;
        const courseTitle = courseDetail.title;
        const courseDuration = courseDetail.duration;
        const courseDescription = courseDetail.description;
        const providedBy = courseDetail.createdby;

        const startDate = new Date();
        const startDateFormatted = startDate.toLocaleDateString("en-IN");

        const status = "not yet started";
        console.log(startDateFormatted);

        // console.log(courseId);
        // console.log(courseTitle);
        // console.log(courseDuration);
        // console.log(providedBy);

        const courseEnrolledDetails = {
            studentRollnum : studentRollnum ,
            studentName : studentName ,
            studentEmail : studentEmail,
            studentDepartment : studentDepartment,
            courseId : courseId ,
            courseTitle :courseTitle ,
            courseDuration : courseDuration,
            courseDescription : courseDescription,
            providedBy :providedBy,
            startDate : startDateFormatted,
            status : status
        }

        const checkingEnrollresp = await fetch(CoursesEndrolled);
        const checkingEnroll = await checkingEnrollresp.json();

        const alreadyEnrolled = checkingEnroll.some(element =>
            element.studentRollnum === studentRollnum &&
            element.courseId === courseId
        );

        if (alreadyEnrolled) {
            toastr.warning("You already enrolled in this course.");
            return;
        }
        
        const updatedCourse = await fetch(CoursesEndrolled, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(courseEnrolledDetails)
        });
        if(updatedCourse)
        {
            Swal.fire(
                "UPDATED!",
                "Course added updated",
                "success"
            );
            document.getElementById("dashboardEnrollbtn").textContent = 'Enrolled';
        }
        else
        {
            toastr.error("Cant able to enroll this course")
        }
    }
    catch(error)
    {
        toastr.error(error);
    }
}


const numofCources =document.getElementById("numofCources");
const numofStudents =document.getElementById("numofStudents");

async function fetchCount()
{
    try
    {
        const courseResponse = await fetch(CoursesAPI);
        const courseData = await courseResponse.json();

        numofCources.textContent = courseData.length;

        const enrolledCourseResponse = await fetch(`${CoursesEndrolled}?studentEmail=${currentUser}`);
        const enrolledCourse = await enrolledCourseResponse.json();

        enrolledCourses.textContent = enrolledCourse.length;
    }
    catch(error)
    {
        toastr.error(error);
    }
}
// fetchCount();

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
                    class="btn btn-custom rounded-pill px-3 enrollBtn" data-id='${element.id}'>
                    ENROLL
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

document.getElementById("viewCoursesbtn").addEventListener('click',fetchCourseList)

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


document.addEventListener('click',async function(e){
    if(e.target.classList.contains('UserDetailbtn')) {
        console.log('hi');
        
        try{
            setTimeout(()=>{
                window.location.assign('Details.html');
            },3060)
            toastr.success("Redirecting to User Details Page...")
        }
        catch(error)
        {
            toastr.error(error)
        }
    }
})  
