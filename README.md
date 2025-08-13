[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/BhMy8Rjk)  
# 🌌 Space Colony Resource Simulator  

**A fullstack simulation game where you manage space colonies and trade resources to survive.**  

Built with the **MERN stack** (MongoDB, Express, React, Node.js), this project simulates interplanetary logistics, resource management, and trading between colonies.  

---

## ✨ Features  

- 🛰 Interactive UI to view and manage colonies  
- ⚡ Colonies produce and consume resources (water, oxygen, energy)  
- 🔄 Real-time trade system between colonies  
- 🗄 MongoDB for persistent data  
- 📱 Fully responsive frontend (React + Vite)  

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/EHB-MCT/remedial-assignment-AhmadNabras.git
```

---

### 2️⃣ Backend setup  
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:  
```
MONGO_URI=your-mongodb-connection-string
PORT=5000
```

Run backend in development mode:  
```bash
npm run dev
```

---

### 3️⃣ Seed initial data  
Run the seed script to populate the database with example colonies:  
```bash
node seed.js
```

You should see:  
```
✅ Connected to MongoDB
🧹 Cleared colonies collection
🌱 Seeded 3 colonies
🔌 Disconnected
```

---

### 4️⃣ Frontend setup  
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📂 Project Structure  
```
remedial-assignment-AhmadNabras/
│
├── backend/               # Express + MongoDB backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── seed.js            # Script to seed database
│   ├── server.js          # Server entry point
│   └── .env               # Environment variables (not committed)
│
└── frontend/              # React + Vite frontend
    ├── src/               # Components & pages
    ├── public/            # Static assets
    └── vite.config.js
```

---

## 🛠 Technologies Used  
- **Frontend:** React, Vite  
- **Backend:** Node.js, Express  
- **Database:** MongoDB, Mongoose  
- **Other:** Nodemon, dotenv, CORS  

---

## 📜 License  
This project is licensed under the **ISC License** – see the [LICENSE](LICENSE) file for details.  

---

## 🤝 Contributing  
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.  

---

## 📬 Contact  
**Nabras Ahmad**  
Email: nabras.ahmad@gmail.com  
GitHub: [AhmadNabras](https://github.com/AhmadNabras)  
