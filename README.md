# Tasker - Task Management Application

A full-stack task management application built with modern web technologies. Tasker provides a comprehensive solution for organizing, tracking, and managing tasks with a clean and intuitive user interface.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://tasker-iota-eight.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue.svg)](https://github.com/ajaypalamkunnel/Tasker)

## 🚀 Live Demo

Visit the live application: [https://tasker-iota-eight.vercel.app/](https://tasker-iota-eight.vercel.app/)

## 📋 Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Monitor task progress with status updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic task management with optimistic updates
- **Rate Limiting**: API protection with request rate limiting
- **Input Validation**: Comprehensive data validation using DTOs
- **Error Handling**: Robust error handling and logging

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Zustand** - Lightweight state management solution
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Hook Form** - Performant forms with validation
- **Axios** - HTTP client for API requests
- **React Router DOM** - Declarative routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast and minimalist web framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type-safe server-side development
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Winston** - Logging library
- **Nodemailer** - Email service integration

## 🏗️ Architecture

### Backend Architecture
The backend follows a **3-layer architecture** with the **Repository Pattern** and adheres to **SOLID principles**:

```
├── Controller Layer    # Handles HTTP requests and responses
├── Service Layer      # Contains business logic
└── Repository Layer   # Data access and database operations
```

**Design Patterns Used:**
- **Repository Pattern** - Abstracts data access logic
- **Dependency Injection** - Promotes loose coupling
- **DTO Pattern** - Data transfer and validation objects

## 📁 Project Structure

```
Tasker/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── constants/       # Application constants
│   │   ├── controller/      # HTTP request handlers
│   │   ├── dtos/           # Data Transfer Objects
│   │   ├── middleware/     # Custom middleware (auth, validation)
│   │   ├── model/          # Mongoose schemas and models
│   │   ├── repository/     # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── service/        # Business logic layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Application entry point
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   ├── services/       # API service functions
│   │   ├── store/          # Zustand store configuration
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Utility functions
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## ⚡ Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajaypalamkunnel/Tasker.git
   cd Tasker
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Create environment file
   cp .env.example .env
   ```

   **Environment Variables (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   ```

   **Environment Variables (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**

   **Backend (Terminal 1):**
   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd Frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Logout User
```http
POST /api/logout
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /api/refresh-token
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

### Task Management Endpoints

#### Get All Tasks
```http
GET /api/tasks?page=1&limit=10&status=pending&search=task_name
Authorization: Bearer <access_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "status": "in-progress"
}
```

#### Update Task Status
```http
PATCH /api/tasks/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <access_token>
```

### Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors array (if applicable)
  ]
}
```

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
```

### Frontend Testing
```bash
cd Frontend
npm test
```

## 📦 Build for Production

### Backend
```bash
cd Backend
npm run build
npm start
```

### Frontend
```bash
cd Frontend
npm run build
npm run preview
```

## 🚀 Deployment

The application is deployed on Vercel. To deploy your own instance:

### Backend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Frontend Deployment (Vercel)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variables for production API URL

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

Run linting:
```bash
npm run lint
npm run lint:fix
```

## 🔒 Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing using bcryptjs
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Performance Optimizations

- Lazy loading of components
- Optimistic UI updates
- Request debouncing
- Image optimization
- Code splitting
- Database indexing

## 🐛 Known Issues

- None currently known

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ajay PS**
- GitHub: [@ajaypalamkunnel](https://github.com/ajaypalamkunnel)
- Email: [ajaypalamkunnel45@gmail.com]

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- MongoDB for the excellent NoSQL database solution
- Vercel for seamless deployment experience

---

⭐ **If you found this project helpful, please consider giving it a star on GitHub!**

📧 **Have questions or suggestions? Feel free to reach out or open an issue.**
