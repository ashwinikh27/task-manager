# Task Manager Web Application

## Overview

This is a simple full-stack Task Manager web application built as part of a technical assignment. It allows users to create, view, update, and delete tasks using a REST API.

---

## Tech Stack

* Frontend: React (with basic styling)
* Backend: Node.js, Express
* API: RESTful endpoints

---

## Features Implemented

* Display list of tasks
* Add a new task
* Mark task as completed
* Delete a task
* Filter tasks (All / Completed / Pending)
* Loading state while fetching data
* Basic error handling for API operations

---

## API Endpoints

* GET /tasks → Fetch all tasks
* POST /tasks → Create a task
* PATCH /tasks/:id → Toggle task completion
* DELETE /tasks/:id → Delete a task

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
node app.js
```

### Frontend

```bash
cd frontend
npm install
npm start
```


