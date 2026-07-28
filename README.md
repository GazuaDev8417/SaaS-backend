# SaaS Dashboard - Backend API Service

A modular, scalable RESTful API built to power the backend server for a multi-tenant **SaaS Dashboard**. This service handles secure user authentication, multi-tier business logic, data persistence, and administrative entity management (products, customers, and accounts).

---

## 📌 Project Overview

This repository houses the **server-side application** designed to back the SaaS client dashboard. It provides secure, validated RESTful endpoints built with a clean 3-tier architecture to separate data handling, core business rules, and HTTP controllers.

* **Project Type**: SaaS Server-Side / API Service
* **Primary Tech**: Node.js, Express, TypeScript, Prisma ORM
* **Architecture**: 3-Tier Layered Architecture (Controllers $\rightarrow$ Business/Services $\rightarrow$ Data/Prisma)

---

## ✨ Key Features

* **Authentication & Authorization**: Secure JWT-based session tokens with `bcrypt` password hashing.
* **Request Validation**: Schema-based payload and params validation using **Zod**.
* **Entity Management**: Complete CRUD operations for products, customers, and administrative accounts.
* **Type-Safe Database Management**: ORM-backed database interactions powered by **Prisma**.
* **Clean Code Structure**: Strict separation of concerns (Middleware, Controllers, Business Rules, Data Access).

---

## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Language**: TypeScript
* **Framework**: Express.js
* **ORM**: Prisma
* **Database**: SQLite (Development) / PostgreSQL (Production ready)
* **Validation**: Zod
* **Authentication**: JSON Web Tokens (JWT) & Bcrypt

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/saas-dashboard-backend.git](https://github.com/your-username/saas-dashboard-backend.git)
   cd saas-dashboard-backend

## 👨‍💻 Author

Developed by **Flamarion França** \
Portfolio page: https://portfolio-vtu0.onrender.com