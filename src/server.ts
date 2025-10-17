// src/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import AuthSingleton from "./AuthSingleton";
import { getPlanets } from "./planetsApi";

const app = express();
const PORT = 5000;
const auth = AuthSingleton.getInstance();

app.use(cors());
app.use(bodyParser.json());

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const token = auth.login(email, password);
  if (token) res.json({ token });
  else res.status(401).json({ message: "Invalid credentials" });
});

// ---------------- MISSIONS ----------------
app.get("/missions", (req, res) => res.json(auth.getMissions()));
app.post("/missions", (req, res) => {
  const { name, date, description, image } = req.body;
  res.json(auth.addMission(name, date, description, image));
});
app.post("/missions/:id/complete", (req, res) => {
  auth.completeMission(Number(req.params.id));
  res.json({ message: "Mission marked as completed" });
});
app.get("/missions/completed", (req, res) => res.json(auth.getCompletedMissions()));
app.put("/missions/:id/archive", (req, res) => {
  auth.archiveMission(Number(req.params.id));
  res.json({ message: "Mission archived" });
});

// ---------------- PLANETS ----------------
app.get("/planets", async (req, res) => {
  const planets = await getPlanets();
  res.json(planets);
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
