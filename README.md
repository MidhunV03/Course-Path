# CoursePlan - Course Enrollment System

## Overview

**CoursePlan** is a role-based web application designed to simplify course management and enrollment within an educational organization. Mentors can create and manage courses, while students can enroll in courses, monitor their learning progress, and update their course completion status.

The application follows a role-based architecture with separate dashboards for **Mentors** and **Students** and uses **JSON Server** as a mock REST API backend.

---

# Features

## Authentication & Authorization

* User Login
* Role-Based Dashboard Access
* Mentor and Student Roles
* Session Management using Local Storage
* Logout Functionality

---

## Student Features

* View Available Courses
* Enroll in Courses
* Prevent Duplicate Enrollments
* View Enrolled Courses
* Update Course Status
* View Recommended Courses
* Track Learning Progress
* View Personal Profile

---

## Mentor Features

* Create New Courses
* Edit Existing Courses
* Soft Delete Courses
* Restore Deleted Courses
* View All Courses
* View Enrolled Students
* Department-wise Course Management
* Dashboard Statistics

---

## Validation Features

* Email Validation
* Password Validation
* Required Field Validation
* Duplicate Course Prevention
* Duplicate Enrollment Prevention

---

## Screenshots

### Home Page

The landing page provides login functionality and an overview of the CoursePlan platform.

![Home Page](assests/ScreenShots/Homepage.png)


---

### Mentor Dashboard

Mentors can manage courses, monitor enrolled students, and view dashboard statistics.

![Mentor Dashboard](assests/ScreenShots/MentorDashboard.png)


---

### Student Dashboard

Students can browse available courses, enroll in courses, update course status, and track their progress.

![Student Dashboard](assests/ScreenShots/StudentDashboard.png)

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript (ES6)
* jQuery

---

## UI Libraries

* Bootstrap Icons
* Font Awesome
* SweetAlert2
* Toastr Notifications

---

## Backend

* JSON Server (Mock REST API)

---

# Project Structure

```text
CoursePlan/
├── assets
│   ├── ScreenShots
│   │   ├── Homepage.png
│   │   ├── MentorDashboard.png
│   │   └── StudentDashboard.png
│   ├── Login.svg
│   ├── businessman.png
│   ├── education.svg
│   ├── learning.png
│   ├── male.png
│   └── woman.png
├── pages
│   ├── Details.html
│   ├── EnrolledCourses.html
│   ├── MentorDashboard.html
│   └── StudentDashboard.html
├── scripts
│   ├── services
│   │   └── api.js
│   ├── Details.js
│   ├── EnrolledCourses.js
│   ├── Home.js
│   ├── MentorDashboard.js
│   └── StudentDashboard.js
├── sql
│   └── SQLQuery1.sql
├── styles
│   └── Home.css
├── .gitignore
├── README.md
├── db.json
├── index.html
├── package-lock.json
└── package.json
```

---

# Application Flow

## Login Process

1. User enters Email.
2. User enters Password.
3. Selects Role.
4. Credentials are validated.
5. User is redirected based on role.

### Mentor

```text
MentorDashboard.html
```

### Student

```text
StudentDashboard.html
```

---

# Mentor Workflow

## Add Course

Mentor can:

* Enter Course Title
* Enter Duration
* Enter Description

System automatically:

* Assigns Mentor Department
* Prevents Duplicate Courses
* Stores Course Information

---

## Edit Course

Mentor can update:

* Course Title
* Duration
* Description

---

## Delete Course

Instead of deleting permanently,

```javascript
isDeleted: true
```

Course is moved to the restore list.

---

## Restore Course

Mentor can restore previously deleted courses back to the active course list.

---

# Student Workflow

Student can:

* Browse Available Courses
* Enroll in Courses
* View Enrolled Courses
* Update Learning Status
* View Recommended Courses

### Course Status Flow

```text
Not Yet Started
        ↓
In Progress
        ↓
Completed
```

---

# Database Design

## Mentor Collection

```json
{
  "name": "Mentor",
  "email": "mentor@gmail.com",
  "password": "Mentor@123",
  "gender": "Male",
  "role": "Mentor",
  "department": "IT"
}
```

---

## Student Collection

```json
{
  "rollnum": "23BCS001",
  "name": "Student",
  "email": "student@gmail.com",
  "password": "Student@123",
  "gender": "Male",
  "department": "IT",
  "role": "Student"
}
```

---

## Course Collection

```json
{
  "title": "Bootstrap",
  "duration": "2",
  "department": "IT",
  "description": "Bootstrap Framework",
  "createdby": "mentor@gmail.com",
  "isDeleted": false
}
```

---

## Enrolled Course Collection

```json
{
  "studentName": "Student",
  "studentEmail": "student@gmail.com",
  "courseTitle": "Bootstrap",
  "courseDuration": "2",
  "providedBy": "mentor@gmail.com",
  "startDate": "17/06/2026",
  "status": "Not Yet Started"
}
```

---

# Course Statuses

| Status          | Description                          |
| --------------- | ------------------------------------ |
| Not Yet Started | Student has enrolled but not started |
| In Progress     | Student is currently learning        |
| Completed       | Course completed successfully        |

---

# Dashboard Statistics

## Mentor Dashboard

Displays:

* Mentor Details
* Total Courses
* Total Enrolled Students
* View Course List
* View Student List

---

## Student Dashboard

Displays:

* Available Courses
* Enrolled Courses
* Completed Courses
* Recommended Courses
* Learning Progress

---

# Soft Delete Implementation

Instead of permanently removing courses:

```javascript
{
    "isDeleted": true
}
```

### Benefits

* Data Recovery
* Restore Functionality
* Better Record Management

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/CoursePlan.git
```

---

## Move to Project Directory

```bash
cd CoursePlan
```

---

## Install JSON Server

```bash
npm install -g json-server
```

---

## Start Backend

```bash
json-server --watch db.json --port 3000
```

---

## Open Application

Launch

```text
Home.html
```
using **Live Server** or any local web server.


# Learning Outcomes

This project demonstrates:

* CRUD Operations
* REST API Integration
* Role-Based Authentication
* Local Storage Session Management
* Form Validation
* Soft Delete Pattern
* Duplicate Data Prevention
* Dynamic UI Rendering
* Responsive Design using Bootstrap
* Fetch API and Async/Await
* JavaScript DOM Manipulation
* Modern Dashboard Development

---

# Author

**Midhun V**

**CoursePlan - Course Enrollment System**

A role-based web application for efficient course management and student learning progress tracking, built using **HTML, CSS, Bootstrap, JavaScript, jQuery, and JSON Server**.
