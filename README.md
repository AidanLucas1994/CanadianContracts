# Contract Management Application

A full-stack application for managing contracts, proposals, and vendor relationships.

## Features

- Contract upload and management
- Proposal submission system
- Vendor suggestions based on contract details
- Document viewing and downloading
- User-friendly Material-UI interface

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Vite
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - TypeScript
  - File handling system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd contract-app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=3001
UPLOAD_DIR=uploads
```

## Project Structure

```
contract-app/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── types/    # TypeScript interfaces
│   └── uploads/      # File storage
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 