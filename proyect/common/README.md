# task-craft-models

This package provides the **data models** (TypeScript interfaces and Zod validation schemas) for the **Task Craft** project, a final project (TFG) for the DAW (Web Application Development) course.

## 📦 What’s included

- **TypeScript interfaces** for core entities: Users, Tasks, Friends, Friends_Has_Task, Diaries, States, Types, and Roles.
- **Zod schemas** for runtime validation of each entity.
- Organized modularly by domain (`/model/[entity]/interfaces/`).

## 🔧 Purpose

This package is designed to be used as a shared dependency across backend and frontend services of Task Craft, ensuring consistent typing and validation.

## 💡 Technologies

- **TypeScript** for strict typing
- **Zod** for declarative and composable validation schemas

## 📚 Project context

Task Craft is a task management platform created as a final project for the Web Application Development degree (DAW). This module focuses exclusively on the **data model layer**, promoting reusability and type safety.

## 📄 License

MIT
