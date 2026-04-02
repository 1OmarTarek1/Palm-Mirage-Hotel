# 🌴 Palm Mirage Hotel

A modern hotel booking web application inspired by Egyptian luxury and hospitality.  
Built with a scalable architecture using React, Redux, Tailwind CSS, and shadcn/ui.

---

## ✨ Overview

Palm Mirage Hotel is a fully responsive hotel website that allows users to:

- Browse rooms and view detailed information
- Explore hotel services (Relax, Restaurant, Amenities, Wellness & Fitness, Events, Meetings)
- Read blog articles
- Contact the hotel
- Register / Login
- Book rooms (Authenticated users only)
- Manage reservations

This project follows a clean, scalable folder structure and production-level routing architecture.

---

## 🛠 Tech Stack

- **React**
- **React Router**
- **Redux Toolkit**
- **Tailwind CSS**
- **shadcn/ui**
- **Axios**
- **Vite**

---

## 📁 Project Structure

src/
├── app/ # Redux store setup
├── layouts/ # MainLayout, AuthLayout
├── pages/ # Route-based pages
├── features/ # Redux slices
├── routes/ # App routes + ProtectedRoute
├── components/ # Shared & reusable components
├── services/ # API logic
├── hooks/ # Custom hooks
├── utils/ # Helper functions


---

## 🔐 Authentication

- Guests can browse public pages (Home, Rooms, Services, Blog, Contact).
- Authenticated users can:
  - Book rooms
  - Access profile
  - View reservations

Protected routes are handled using a custom `ProtectedRoute` component.

---

## 🚀 Features

### 🏠 Home Page
- Hero section
- Featured rooms
- Services preview
- Call-to-action

### 🛏 Rooms
- Room listing
- Room details page
- Booking system

### 🌴 Services
- Relax
- Restaurant
- Amenities
- Wellness & Fitness
- Events & Meetings
- Our Products

### 📰 Blog
- Blog listing
- Blog details page

### 📞 Contact
- Contact form
- Hotel information

### ❌ 404 Page
- Custom Not Found page

---

## 🧠 Architecture Highlights

- Feature-based folder structure
- Reusable layout system
- Protected routing system
- Centralized Redux state management
- Modular and scalable design

---

## 📦 Installation

```bash
git clone https://github.com/your-username/palm-mirage-hotel.git
cd palm-mirage-hotel
npm install
npm run dev
