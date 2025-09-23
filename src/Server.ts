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
  const { name, date, description, image } = req.body;
  const mission = auth.addMission(name, date, description, image);
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
// fetch all archived missions
app.get("/missions/archive", (req, res) => {
  res.json(auth.getArchivedMissions());
});

// archive (or restore) a mission
app.put("/missions/:id/archive", (req, res) => {
  const { id } = req.params;
  auth.archiveMission(Number(id)); // you’ll need this to toggle archive/restore
  res.json({ message: "Mission archive status updated" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});