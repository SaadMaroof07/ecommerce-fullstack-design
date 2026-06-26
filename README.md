# Ecommerce Fullstack Design

A fully functional eCommerce web application built with Django REST Framework and Nuxt.js.

## Tech Stack

### Frontend
- Nuxt.js (Vue.js)
- Vanilla CSS
- Pinia (State Management)

### Backend
- Django REST Framework
- PostgreSQL
- JWT Authentication

## Features
- Product listing with filters, search, and sorting
- Product detail page
- Shopping cart with localStorage persistence
- User authentication (Login/Signup)
- Admin panel (CRUD operations)
- Mobile responsive design

## Project Setup

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)