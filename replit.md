# Overview

This is a Client Portal application for the mySage Revenue Cycle Management (RCM) system. The portal provides a secure, modern interface for clinic staff to interact with the mySage RCM system through dashboards, reporting, task queues, and prior authorization tracking. The application is built as a full-stack web application with a React frontend and Express.js backend, designed to handle clinic operations including queue management, PA (Prior Authorization) tracking, EV (Electronic Visit) tracking, and comprehensive reporting capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **Database Integration**: Drizzle ORM configured for PostgreSQL with Neon Database serverless
- **Authentication**: Session-based authentication with role-based access control (admin, staff, system_admin)
- **API Design**: RESTful API endpoints with proper error handling and request validation

## Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Management**: Database migrations handled through Drizzle Kit
- **Development Storage**: In-memory storage implementation for development/testing

## Authentication and Authorization
- **Authentication Method**: Username/password with session management
- **Role-Based Access**: Three user roles with different permission levels
  - Staff: Basic dashboard access, queue management, PA/EV tracking
  - Admin: All staff capabilities plus user management
  - System Admin: Full system access including configuration
- **Security Features**: Multi-factor authentication support, session management, and secure password handling

## Key Application Features
- **Dashboard**: Real-time metrics and widgets for pending queue items, PA submissions, and approval rates
- **Queue Management**: Task assignment, status updates, and workflow triggers
- **PA Tracker**: Real-time prior authorization status tracking with denial reasons and filtering
- **EV Tracker**: Electronic visit status monitoring and verification tracking
- **Reporting**: Data export capabilities (Excel/PDF) with drill-down functionality
- **User Management**: Admin interface for user creation, role assignment, and access control

## Development Tools
- **Build System**: Vite with TypeScript support and hot module replacement
- **Code Quality**: ESBuild for production builds, TypeScript for type checking
- **Development Environment**: Replit integration with runtime error handling and cartographer support

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing for React applications
- **react-hook-form** & **@hookform/resolvers**: Form handling and validation
- **zod**: Schema validation and type inference

## UI Component Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **class-variance-authority**: Utility for creating variant-based component APIs
- **tailwindcss**: Utility-first CSS framework for styling
- **lucide-react**: Icon library for consistent iconography

## Database and Backend
- **drizzle-orm** & **drizzle-kit**: TypeScript ORM and schema management
- **@neondatabase/serverless**: Neon Database serverless driver for PostgreSQL
- **express**: Web application framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for Express

## Development and Build Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific development tools

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx** & **tailwind-merge**: Utility functions for conditional CSS classes
- **nanoid**: Unique ID generation for various application needs