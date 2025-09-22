import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AuthSingleton from "./AuthSingleton";

const app = express();
const PORT = 5000;
const auth = AuthSingleton.getInstance();

app.use(cors());
app.use(bodyParser.json());
const router = express.Router();

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const token = auth.login(email, password);
  if (token) res.json({ token });
  else res.status(401).json({ message: "Invalid credentials" });
});

// ---------------- MISSIONS ----------------
app.get("/missions", (req, res) => {
  res.json(auth.getMissions());
});

app.use("/api", router);

app.post("/missions", (req, res) => {
  const { name, date, description } = req.body;
  const mission = auth.addMission(name, date, description);
  res.json(mission);
});

app.post("/missions/:id/complete", (req, res) => {
  const { id } = req.params;
  auth.completeMission(Number(id));
  res.json({ message: "Mission marked as completed" });
});

app.get("/missions/completed", (req, res) => {
  res.json(auth.getCompletedMissions());
});

// ---------------- ARCHIVE ----------------
app.post("/missions/:id/archive", (req, res) => {
  const { id } = req.params;
  auth.archiveMission(Number(id));
  res.json({ message: "Mission archived" });
});

app.get("/missions/archived", (req, res) => {
  res.json(auth.getArchivedMissions());
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
