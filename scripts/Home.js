import { MentorAPI,StudentsAPI } from "./services/api.js";


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

const loginemail = $('#loginemail');
const loginpassword = $('#loginpassword');
const loginrole = $('#loginrole');
const loginbtn = $('#loginbtn');
const loginresetbtn = $('#loginresetbtn');

loginemail.on('input',function()
{
    if(!email_pattern.test(loginemail.val().trim()))
    {
        $("#loginemailerror").text("Invalid Email");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#loginemailerror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("rollnum",signinrollnum.val())
    }
})
loginpassword.on('input',function()
{
    if(!password_pattern.test(loginpassword.val().trim()))
    {
        $("#loginpassworderror").text("Invalid Password");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#loginpassworderror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("rollnum",signinrollnum.val())
    }
})
loginrole.on('change',function()
{
    if((loginrole).val() ==  " ")
    {
        $("#loginroleerror").text("Please Select Role");  
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#loginroleerror").text("");  
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
    }
}
);

toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "timeOut": "3000"
};

async function loginvalidate(e) {
    e.preventDefault();


    function removeSpinner(){
        document.querySelector('.submit-text').classList.remove('d-none')
    document.querySelector('.submitSpinner').classList.add('d-none')
    }

    document.querySelector('.submit-text').classList.add('d-none')
    document.querySelector('.submitSpinner').classList.remove('d-none')

    const email = loginemail.val().trim();
    const password = loginpassword.val().trim();
    const role = loginrole.val().trim();

    if(email == "" || password == "" || role == "" )
    {
        toastr.error("Please fill out all fields.", "Login Failed");
        removeSpinner()
        return;    
    }

    let targetEndpoint = (role === "Mentor") ? MentorAPI : StudentsAPI;

    try
    {
        const response = await fetch(targetEndpoint);
        const data = await response.json();
        const user = data.find(element =>
            element.email === email &&
            element.password === password &&
            element.role === role
        );                   
        
        if (user) {
                if (role === "Mentor") {
                    localStorage.setItem("MentorEmail", email);
                } else {
                    localStorage.setItem("StudentEmail", email);
                }

                localStorage.setItem("Role", role);

                toastr.success("Login Success. Redirecting...");

                setTimeout(() => {
                    if (role === "Mentor") {
                        window.location.assign("pages/MentorDashboard.html");
                    } else {
                        window.location.assign("pages/StudentDashboard.html");
                    }
                    removeSpinner()
                }, 3000);

            } else {
                removeSpinner()
                toastr.error("Invalid Credentials");

            }    }
    catch(error)
    {
        removeSpinner()
        toastr.error("Data error")
    }

}

loginbtn.on('click',loginvalidate);

const signinrollnum = $('#signinrollnum');
const signinname = $('#signinname');
const signinemail = $('#signinemail');
const signinpassword = $('#signinpassword');
const signincfnpassword = $('#signincfnpassword');
const signingender = $('input[name="gender"]:checked');
const signindepartment = $('#signindepartment');

console.log(signinname)

const rollnum_pattern = /^2[0-6]B..\d{3}$/i;
const name_pattern = /^[A-Za-z ]{3,}$/;
const email_pattern = /^[a-z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%&.])[A-Za-z\d@#$%&.]{6,15}$/;

signinrollnum.on('input',function(){
    if(!rollnum_pattern.test(signinrollnum.val().trim()))
    {
        $("#signinrollnumerror").text("RollNumber Invalid");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinrollnumerror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("rollnum",signinrollnum.val())
    }
});

signinname.on('input',function(){
    if(!name_pattern.test(signinname.val().trim()))
    {
        $("#signinnameerror").text("Name should be above 2 letters");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinnameerror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("name",signinname.val())
    }
});

signinemail.on('input',function(){
    if(!email_pattern.test(signinemail.val().trim()))
    {
        $("#signinemailerror").text("Invalid Email");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinemailerror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("name",signinname.val())
    }
});

signinpassword.on('input',function(){
    if(!password_pattern.test(signinpassword.val().trim()))
    {
        $("#signinpassworderror").text("Password should have 1 Uppercase,1 special Character and a number");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinpassworderror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("name",signinname.val())
    }
});

signincfnpassword.on('input',function(){
    if(signinpassword.val().trim() != signincfnpassword.val().trim())
    {
        $("#signincfnpassworderror").text("Confirm Password should be same as Password ");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signincfnpassworderror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("name",signinname.val())
    }
});

signingender.on('change',function()
{
    if($('input[name="gender"]:checked').length === 0)
    {
        $("#signingendererror").text("Please Select Gender");  
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signingendererror").text("");  
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
    }
}
);
signindepartment.on('change',function()
{
    if((signindepartment).val() ==  " ")
    {
        $("#signindepartmenterror").text("Please Select Department");  
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signindepartmenterror").text("");  
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
    }
}
);

$("#signinSubmitbtn").on('click',siginvalidation)

$("#signinResetbtn").on('click',function()
{
        signinname.val("");
        signinpassword.val(""); 
        signingender.val("");
        signindepartment.val("");
        signinemail.val("")
})

async function siginvalidation(e) {
    e.preventDefault();

    if(
        signinname.val() == "" ||
        signinemail.val()  == "" ||
        signinpassword.val()  == "" ||
        signingender.val()  == "" ||
        signindepartment.val() == ""
    )
    {
        toastr.error("All Fields Are Required");
        return
    }

    const user = {
        rollnum : signinrollnum.val(),
        name : signinname.val(),
        email : signinemail.val(),
        password : signinpassword.val(),
        gender : $('input[name="gender"]:checked').val(),
        role : "Student",
        department : signindepartment.val()
    }

    try {
        const response = await fetch(StudentsAPI, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            toastr.success("Account registered successfully!", "Success");
            $('#signinmodal').modal('hide');
        } 
        else 
        {
            toastr.error("Server rejected registration data.", "Server Error");
        }
    } 
    catch (error) 
    {
        toastr.error("Could not connect to database server.", "Connection Failure");
        console.error(error);
    }

}