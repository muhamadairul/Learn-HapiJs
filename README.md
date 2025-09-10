# Hapi.js Laravel-Style Starter

Starter project **Hapi.js** dengan struktur folder mirip Laravel (Model, Controller, Routes, Config) + **Knex.js** untuk migrasi database PostgreSQL.

---

## 🚀 Features
- **Hapi.js** REST API server
- **Knex.js** untuk migrasi & seeder database
- **PostgreSQL** database
- Struktur folder mirip Laravel (Models, Controllers, Routes)
- Validasi payload dengan Joi
- Prefix API global `/api`

---

## ⚙️ Setup Project

### 1. Clone Repo
```bash
git clone https://github.com/muhamadairul/learn-hapijs.git
cd learn-hapijs
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Buat File .env
```bash
# Server
HOST=localhost
PORT=3000

# Database
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=mydb
```
### 4. Migrasi Database
```bash
npm migrate
npm seed
```
### 5. Jalankan Server
```bash
npm run dev
```

