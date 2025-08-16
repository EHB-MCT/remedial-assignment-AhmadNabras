# 🚀 Space Colony Resource Simulator

This project is an interactive **Space Colony Resource Simulator** where colonies consume and produce resources over time.  
The backend is powered by **Node.js + Express + MongoDB**, while the frontend is built with **React**.

---

## 📌 Features
- Create colonies with resource seeds (water, oxygen, energy).
- Limit of **5 colonies maximum**.
- Colonies consume random resources at random intervals.
- Colonies **produce** their designated resource type over time.
- Colonies list displayed as **cards** in the frontend.
- Colonies can be **deleted** with confirmation popup.
- Frontend auto-refreshes to show live updates.

---

## 🛠️ Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS

### Frontend
- React
- Axios
- CSS Grid for layout

---

## 📂 Project Structure

```
backend/
│── server.js
│── seed.js (⚠️ no longer needed, logic moved to server.js)
│── server/
│   ├── controllers/
│   │   └── colonyController.js
│   ├── models/
│   │   └── Colony.js
│   └── routes/
│       └── colony-routes.js
│
frontend/
│── src/
│   ├── App.jsx
│   ├── services/
│   │   └── api.js
│   ├── components/
│   │   └── CreateColony.jsx
│   └── pages/
│       └── ColoniesList.jsx
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/space-colony-simulator.git
cd space-colony-simulator
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the backend folder:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
- Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🎮 Usage
1. Go to `http://localhost:3000`
2. Create a new colony (max 5 allowed).
3. Watch colonies **consume resources** and **produce new ones** in real-time.
4. Delete colonies if needed.

---

## 📖 Commit History
We follow **Conventional Commits**:
- `feat:` for new features  
- `fix:` for bug fixes  
- `chore:` for maintenance  

Examples:
- `feat(frontend): add colony cards with live updates`
- `fix(backend): increase productionAmount correctly`
- `chore(docs): add README.md`

---

## 🤝 Contributing
1. Fork this repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with proper messages
4. Push and open a Pull Request

---

## 📜 License
MIT License © 2025 Nabras Ahmad
