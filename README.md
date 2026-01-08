# 🏫 School Management System - Frontend

This project is the user interface (Frontend) for the School Management System, developed for my **Web technologies** course. It allows administrators, teachers, and students to interact with the school database in an intuitive and secure manner.

The project is built with **React** and **Vite**, utilizing **Tailwind CSS** and **Flowbite** for design components.

## 🚀 Technologies Used

* **Framework:** [React](https://react.dev/) (v18+)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Flowbite React](https://flowbite-react.com/)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Icons:** React Icons (Heroicons)

## ✨ Key Features

### 🔐 Authentication & Security
* Secure Login page.
* Session management via **JWT** (stored in LocalStorage).
* Route protection (Automatic redirection if not logged in).
* Role-based access control: `ADMIN`, `PROF`, `STUDENT`.

### 👤 Profile Management (All Users)
* **Collapsible Sidebar:** Optimized navigation space with a toggle button.
* **Edit Profile:** Users can update their first name, last name, password, and profile picture directly from the interface.

### 🛠️ Administration Area
* **Dashboard:** Global statistics (Total users, classes, courses).
* **User Management:** Create, edit, delete, and search users (includes photo upload).
* **Class Management:** Create classes with automatic name generation (e.g., "12th Grade A").
* **Course Management:** Assign subjects and teachers to specific classes.

### 📚 Teacher Area
* **Course List:** View assigned subjects and classes.
* **Grading System:** Tabular interface to input grades (Homework, Exams).
* **Auto-Calculation:** Subject averages and student general averages are calculated and saved in real-time.
* **Validation:** Prevents invalid grades (< 0 or > 20).

### 🎓 Student Area
* **Report Card:** A fused view combining course details and received grades.
* **Statistics:** Displays General Average and Status (Passed/Failed).
* **Visual Indicators:** Color-coded badges for success or failure.

## 📂 Project Structure

```text
src/
├── assets/          # Static assets and images
├── components/      # Reusable components
│   ├── admin/       # Admin-specific components (UserManager, ClassManager...)
│   ├── teacher/     # Teacher-specific components (GradeManager)
│   ├── SidebarLayout.tsx  # Main layout with responsive sidebar
│   └── EditProfileModal.tsx # Profile modification modal
├── context/         # Global state management (AuthContext)
├── helper/          # Axios configuration and API calls (api.ts)
├── pages/           # Main views (Login, Dashboards...)
├── types/           # TypeScript definitions (User, Course, Grade...)
├── App.tsx          # Route configuration
└── main.tsx         # Entry point
````
## ⚙️ Installation and Setup Guide

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Make sure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **npm** (Node Package Manager)

### 2. Installation
Open your terminal and run the following commands:

```bash
# 1. Clone the repository
git clone <YOUR_REPOSITORY_LINK_HERE>

# 2. Navigate to the frontend directory
cd frontend

# 3. Install dependencies
npm install
````
### 3. Configuration (Connecting to Backend)
Before running the app, ensure it connects to the correct Backend URL.

1. Open the file: `src/helper/api.ts`
2. Locate the `baseURL` configuration.
3. Update it depending on your environment:

```typescript
// For Local Development:
const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// For Production (Vercel/Netlify):
// const api = axios.create({
//    baseURL: '[https://your-backend-on-railway.app](https://your-backend-on-railway.app)',
// });
