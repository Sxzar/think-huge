# THINKHUGE TEST PROJECT DOCUMENTATION
---

Author: Stefan Nicolau
Date: November 2025
Version: 1.0.0


## I. OVERVIEW
--- 
This project was created as a **technical assessment for ThinkHuge**. 
It demonstrates the ability to design and implement a **modern full-stack web application** using a **custom PHP backend** and a **React + TypeScript frontend**, running in a Dockerized environment.
The application is a lightweight internal dashboard for managing **clients**, **transactions**, and **admins**, built from scratch without relying on heavy frameworks. It focuses on clean architecture, data consistency, and maintainable code.

### Scope

The goal of this project is to:
- Showcase structured backend and frontend development using PHP and React.
- Demonstrate CRUD functionality for clients, transactions, and admin users.
- Illustrate API design, CSRF handling, and form validation.
- Provide a modular architecture suitable for real-world extensions.

The result is a minimal yet functional admin panel that:
- Lists all clients, their transactions, and allows editing or deleting them.
- Supports earnings/expenses management per client.
- Allows creation and management of admin accounts.
- Displays an overview of transactions in a dashboard with filters and reports.

## II. RUNNING THE PROJECT
---

### Prerequisites 

1. Docker Desktop 
	 Download and install from: https://www.docker.com/products/docker-desktop/
	 Ensure it's running before executing any commands

2. Git 
	 To clone the repository and version control.
	 https://git-scm.com/install/

3. Modern Browser
	 Use Chrome, Firefox, or Edge for testing the frontend UI at http://localhost:5173

### Step 1 - Clone the repository

```bash
git clone https://github.com/Sxzar/think-huge.git
```

Then navigate into the project folder:

```bash
cd think-huge
```

### Step 2 - Start Docker containers

```bash
docker compose up -d --build
```

This command will build and start all services (PHP, MySQL, and Node).

### Step 3 - Install PHP dependencies

Run Composer inside the PHP container:
```bash
docker compose run --rm php composer install
docker compose run --rm php composer dump-autoload
```

### Step 4 - Create Database Tables

Run database migrations to generate all tables:
```bash
docker compose exec php php scripts/migrate.php
```

### Step 5 - Seed a Default Admin

Seed the database with a default admin user:
```bash
docker compose exec php php scripts/seed_admin.php
```

Optionally, you can create or update an admin with custom credentials:
```bash
docker compose exec php php scripts/seed_admin.php custom@email.com custompassword
```

### Step 6 - Verify Created Tables

Check if all tables were successfully created:
```bash
docker compose exec mysql mysql -uapp -papp -e "USE app; SHOW TABLES;"
```

### Step 7 - Visit the app

Check the app at: http://localhost:5173


### Step 8 - Stop Containers

When done working, stop and remove containers:
```bash
docker compose down
```

## III. STACK & ARCHITECTURE
---

BACKEND:
- PHP 8.2
- MySQL 8
- Composer (for autoloading)
- Lightweight MVC-style structure
- RESTful endpoints (JSON responses)
- Dockerized environment

FRONTEND:
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Vite for bundling and hot reloading
- Custom API layer for requests

ENVIRONMENT:
- Docker Compose for local orchestration
- PHP container
- MySQL container
- Node container for the frontend

## IV. PROJECT STRUCTURE
---

```
root/
├─ server/
│  ├─ migrations/    → SQL migration files for creating DB tabels
│  ├─ nginx/
│  ├─ php/           
│  ├─ public/
│  │  ├─ api/               → Entry point for REST API requests
│  ├─ scripts/
│  ├─ src/
│  │  ├─ Controllers/   → Logic for Clients, Transactions, Admins
│  │  ├─ Core/          → Database connection, routing, helpers
│  │  ├─ Models/        → Database models
│  │  └─ Support/         → Helper functions
│  ├─ composer.json
│  └─ composer.lock
│
├─ client/
│  └─ src/
│      ├─ api/           → API handlers for backend communication
│      ├─ assets/           → Project fonts and main CSS file
│      ├─ components/    → Modals, forms, and UI elements
│      │  ├─ filters/ 
│      │  ├─ forms/ 
│      │  ├─ modals/
│      │  ├─ ui/  
│      ├─ context/
│      ├─ hooks/
│      ├─ layouts/       → App layout wrapper
│      ├─ pages/         → React pages (Dashboard, Clients, ClientDetails, Admins)
│      ├─ router/        → React Router configuration and route definitions
│      ├─ types/         → TypeScript interfaces
│      ├─ App.tsx       → Main app component
│      └─ main.tsx       → Application entry point
├─ docker-compose.yml
└─ README.txt
```

## V. FUNCTIONALITY OVERVIEW
---

**Dashboard**
- Displays all transactions by default.
- Includes date range filters and a “Clear Filters” button.
- Pagination support for large datasets.

**Clients**
- Full CRUD operations (create, edit, delete).
- Add “earnings” or “expenses” transactions per client.
- Search by ID, name, or email.
- Confirmation modal before deletions.

**Client Details**
- View all transactions related to a specific client.
- Filter by date or transaction ID.
- Edit or delete specific transactions (with confirmation).

**Admins**
- Manage system administrators.
- Create, edit, or delete admin accounts.
- Confirmation prompts for irreversible actions.

## VI. DEVELOPMENT NOTES
---

- All backend requests are routed through the `public/index.php` entrypoint.
- CSRF protection is included in HTTP helpers.
- The project uses a custom lightweight router to map REST endpoints.
- State management is handled using React hooks (no Redux).
- All modals are unified into reusable `<Modal>` components for consistency.

## VII. TESTING & VERIFICATION
---

After completing setup:
1. Log in with the seeded admin credentials.
2. Navigate to:
   - `/clients` to manage clients
   - `/admins` to manage administrators
   - `/` for the main dashboard
3. Add a few clients and transactions to confirm relationships.
4. Try filtering by date range or deleting items to test modals and confirmation prompts.

## VIII. STOPPING / CLEANUP

To stop all services:
```bash
docker compose down
```

To rebuild from scratch:
```bash
docker compose down -v
docker compose up -d --build
```

