# 🐛 Issue Tracker Microservice

This is my solution for the [Issue Tracker Microservice project on freeCodeCamp](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker).

## 📌 Overview

The Issue Tracker allows users to create, update, retrieve, and delete issues for different projects. It includes full test coverage and supports filtering via query parameters like `open`, `assigned_to`, and `created_by`.

## 📡 API Endpoints

### POST /api/issues/{project}
Create a new issue.

Required fields:
- issue_title  
- issue_text  
- created_by  

Optional fields:
- assigned_to  
- status_text  

---

### GET /api/issues/{project}
View all issues for a project. Supports filtering.

Query parameters:
- open (true/false)  
- assigned_to  
- created_by  
- etc.

---

### PUT /api/issues/{project}
Update an existing issue.

Required:
- _id  
- At least one other field to update

---

### DELETE /api/issues/{project}
Delete an issue by its _id.

Required:
- _id

---

## ⚙️ Technologies Used

- Node.js  
- Express.js  
- MongoDB  
- Mocha & Chai  
- dotenv

## 🧪 Running Tests

npm install  
npm test

## 🛠️ Getting Started Locally

1. Clone the repository:

git clone https://github.com/giannis07/fcc_issue_tracker.git  
cd fcc_issue_tracker

2. Install dependencies:

npm install

3. Create a `.env` file and add:

MONGO_URI=your_mongodb_connection_string

4. Start the server:

npm start

5. Visit: http://localhost:3000

## 💻 Source Code

GitHub: https://github.com/giannis07/fcc_issue_tracker
