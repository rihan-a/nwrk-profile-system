# Employee Profile HR App

A simple HR app where employees can manage their profiles, request time off, and give feedback to each other. Different people see different things based on their role.

## How to Run

1. **Install everything:**
   ```bash
   npm run install:all
   ```

2. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

3. **Open your browser to:** http://localhost:5173

## Demo Users

Try these accounts to see how different roles work:

- **Manager**: `manager@newwork.com` (can see everyone, approve time off)
- **Employee**: `employee@newwork.com` (can edit own profile, request time off)  
- **Co-worker**: `coworker@newwork.com` (can see public info, give feedback)

## What I Built

**Frontend:** React app with TypeScript and Tailwind for styling
**Backend:** Express server with TypeScript
**Features:**
- Profile management (view/edit based on role)
- Time off requests with manager approval
- Feedback system with AI enhancement (using Google's Gemini)
- Role-based access (managers see more, employees see less)

## Architecture Decisions

- **Monorepo setup:** Keeps frontend and backend together for easier development
- **Feature-based folders:** Each feature (profiles, feedback, absence) has its own folder with everything it needs
- **Mock data:** No database needed for this demo - everything lives in memory
- **Simple auth:** Just role-based, no complex login system since it's a demo
- **AI integration:** Added Gemini API to polish feedback text automatically

## What I'd Improve With More Time

- **Real database:** Replace mock data with proper database (PostgreSQL or MongoDB)
- **Better auth:** Add JWT tokens, password hashing, proper login/logout
- **More validation:** Better form validation and error handling
- **Testing:** Add unit tests and integration tests
- **Performance:** Add loading states, pagination for large lists
- **Mobile:** Make it work better on phones and tablets
- **Notifications:** Real-time updates when someone approves your time off
- **File uploads:** Let people upload profile pictures
- **Search:** Add search and filtering for employee profiles
