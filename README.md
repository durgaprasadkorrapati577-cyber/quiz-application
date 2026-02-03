# PQizzer – Interactive Quiz Platform


[![Java](https://img.shields.io/badge/Java-17-orange?style=flat&logo=java&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A modern full-stack quiz platform where users can participate in quizzes, join live sessions, compete on leaderboards, and engage in weekly contests. Regular users focus on **participation** (taking quizzes, viewing results, leaderboards) while quiz creation is restricted to authorized organizers/admins.

## Key Features

- **User Participation** – Join quizzes via direct ID or scheduled events
- **Weekly & Event-Based Quizzes** – Register for upcoming tournaments (e.g., Java Weekly Quiz)
- **Real-time Leaderboards** – Track rankings and rewards
- **Direct Lobby Access** – Enter Quiz ID to start a session instantly
- **Available Tracks** – Browse programming categories (e.g., Java Fundamentals, Spring Boot Advanced)
- **Authentication** – Secure login/logout with user profiles
- **Locked Events** – Upcoming quizzes with join/reminder options and rewards (e.g., Vanguard Badge)

**Note**: Regular users **cannot create quizzes** — this is an admin/organizer-only feature.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA + Hibernate
- Spring Security
- PostgreSQL
- Maven
- Lombok

### Frontend
- React 18 + TypeScript
- Vite (fast build tool)
- Modern UI components (cards, banners, modals)

### Database
- PostgreSQL

## Project Structure
.
├── QuizApp/                      # Spring Boot Backend (API, logic, DB)
│   ├── pom.xml
│   └── src/main/java/com/application/QuizApp/
└── pquizzer-frontend/            # React + Vite Frontend (UI/Dashboard)
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── package.json
└── vite.config.ts


## Getting Started

### Prerequisites
- Java 17+
- Maven
- Node.js 18+ & npm
- PostgreSQL (local or Docker)

### Backend
1. Configure `QuizApp/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/pquizzer_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
2.Run
cd QuizApp
mvn clean install
mvn spring-boot:run

→ API available at http://localhost:8081


Frontend

1.Install & run:Bash

cd pquizzer-frontend
npm install
npm run dev
→ Dashboard opens at http://localhost:3000

2.Set API base URL in .env:

VITE_API_URL=http://localhost:8081/api



  



