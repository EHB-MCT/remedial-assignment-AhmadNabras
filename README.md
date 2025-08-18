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
- Colonies can **transfer resources** to each other with validations:
  - Cannot exceed **50 units** in any resource.
  - Dead colonies cannot send or receive.
- Colonies log **history snapshots** in MongoDB (water, oxygen, energy, production, dead state).
- Backend provides **colony reports** with:
  - Survival time
  - Resources used
  - Production total
  - Transfers made
- **Analytics dashboard** powered by backend history:
  - Line chart showing resource evolution over time (water, oxygen, energy, production).

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
- Recharts (for analytics)
- CSS Grid for layout

---

## 📂 Project Structure

```
backend/
│── server.js
│── server/
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
│   │   └── Analytics.jsx
│   └── pages/
│       └── ColoniesList.jsx
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/EHB-MCT/remedial-assignment-AhmadNabras.git
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
cd space
npm install
npm run dev
```

---

## 🎮 Usage
1. Go to `http://localhost:5000`
2. Create a new colony (max 5 allowed).
3. Watch colonies **consume resources** and **produce new ones** in real-time.
4. Use the **transfer popup** to send resources between colonies.
5. Check **analytics dashboard** for live charts powered by backend history.
6. View detailed **reports** for survival, resource usage, and transfers.

---

## 🌿 Branch Strategy

We use a feature-branch workflow:

- **main** → stable branch with latest working version.  
- **feat/seed-colonies** → implementation of colony creation & seed logic.  
- **feat/transfers** → implementation of resource transfers between colonies.  
- **feat/analytics** → backend-powered analytics dashboard & reports.  
- **feat/random-seed-depletion** → Implements automatic random depletion & production logic.  

✅ Branches are merged into `main` once tested.  
🚀 Always create new features in a `feat/` branch before merging.

---

## 📖 Commit History
We follow **Conventional Commits**:
- `feat:` for new features  
- `fix:` for bug fixes  
- `chore:` for maintenance  

Examples:
- `feat(frontend): add colony cards with live updates`
- `feat(backend): add /reports/all endpoint`
- `feat(frontend): integrate backend-powered history into line chart`
- `feat(backend): implement resource transfers with validation`
- `fix(backend): correct survival time calculation`
- `chore(docs): update README.md`

---

## 🤝 Contributing
1. Fork this repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with proper messages
4. Push and open a Pull Request

---

## 📜 License
MIT License © 2025 Nabras Ahmad

---

## 📚 References

During the development of this project I consulted the following sources:

- [React Installation Guide](https://react.dev/learn/installation) – official guide on how to set up React.
- [MongoDB Documentation](https://www.mongodb.com/docs/languages/javascript/) – official documentation for MongoDB.
- [MongoDB Tutorial](https://www.youtube.com/watch?v=TtjqEe-ktHY) – tutorial on how to use MongoDB.
- [ChatGPT (OpenAI)](https://chatgpt.com/share/68a28fcc-dac8-8012-b4e5-700bc8a45bef) – used as an AI assistant for troubleshooting, code generation, and explanations.
