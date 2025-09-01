# Employee Profile HR Application

A role-based employee profile system built with React + TypeScript frontend and Node.js + Express backend.

## 🚀 Quick Start

### Backend (Port 3001)
```bash
cd apps/backend
npm install
npm run dev
```

### Frontend (Port 5173)
```bash
cd apps/frontend
npm install
npm run dev
```

### Both Together
```bash
npm run dev
```

## 🔐 Demo Users

- **Manager**: `manager@newwork.com` - Full access to all profiles and features
- **Employee**: `employee@newwork.com` - Access to own profile + absence requests
- **Co-worker**: `coworker@newwork.com` - Public data access + feedback

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Authentication**: Simple role-based access (no complex auth for demo)
- **Data**: In-memory mock data for demonstration

## 📁 Project Structure

```
newwork-task-rihan/
├── apps/
│   ├── frontend/          # React app with role-based UI
│   └── backend/           # Express API with role-based endpoints
└── package.json           # Root monorepo config
```

## 🔒 Role-Based Access

- **Manager**: Full CRUD access to all employee profiles
- **Employee**: Read/write access to own profile + absence management
- **Co-worker**: Read access to public profile data + feedback system

## 🌟 Features Implemented

### Phase 1 ✅
- [x] Monorepo structure
- [x] Backend Express server with TypeScript
- [x] Role-based middleware and route protection
- [x] Frontend React app with authentication context
- [x] Role-based navigation and UI components
- [x] Mock data and API endpoints

### Phase 2 (Next)
- [ ] Profile viewing and editing
- [ ] Complete profile management system

### Phase 3 (Future)
- [ ] AI-enhanced feedback system
- [ ] Gemini API integration

### Phase 4 (Future)
- [ ] Absence request management
- [ ] Approval workflows

## 🧪 Testing

1. Start both backend and frontend
2. Navigate to http://localhost:5173
3. Use demo user credentials to test different roles
4. Explore role-based access and navigation

## 🛠️ Development

- **Backend**: `npm run dev` in `apps/backend/`
- **Frontend**: `npm run dev` in `apps/frontend/`
- **Build**: `npm run build` in root for both apps
- **Lint**: `npm run lint` in root for both apps
# nwrk-profile-system
