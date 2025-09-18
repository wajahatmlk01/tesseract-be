import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import AuthSingleton from "./AuthSingleton";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "super_secret_key";

// Get singleton instance
const auth = AuthSingleton.getInstance();

// --- Login Route ---
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (auth.validateUser(email, password)) {
    // Generate JWT valid for 15 minutes
    const name = auth.getUserName(email);
    const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: "15m" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// --- Get Missions ---
app.get("/missions", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);
    const missions = auth.getMissions();
    res.json(missions);
  });
});

// --- Add Mission ---
app.post("/missions", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);

    const { name, date, description } = req.body;
    if (!name || !date || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    auth.addMission(name, date, description);
    res.json({ success: true, missions: auth.getMissions() });
  });
});

// --- Delete Mission ---
app.delete("/missions/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);

    const id = parseInt(req.params.id);
    auth.deleteMission(id);
    res.json({ success: true, missions: auth.getMissions() });
  });
});

// --- Archive Mission ---
app.put("/missions/:id/archive", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);

    const id = parseInt(req.params.id);
    auth.archiveMission(id);
    res.json({ success: true, archived: auth.getArchivedMissions() });
  });
});

// --- Get Archived Missions ---
app.get("/missions/archive", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);
    res.json(auth.getArchivedMissions());
  });
});

// --- Restore Mission from Archive ---
app.put("/missions/:id/restore", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);

    const id = parseInt(req.params.id);
    auth.restoreMission(id);
    res.json({ success: true, missions: auth.getMissions() });
  });
});

// --- Delete Mission Permanently from Archive ---
app.delete("/missions/:id/archive", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);

    const id = parseInt(req.params.id);
    auth.deleteArchivedMission(id);
    res.json({ success: true, archived: auth.getArchivedMissions() });
  });
});

// disable caching for API
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.listen(3000, "0.0.0.0", () =>
  console.log("Server running on http://192.168.100.7:3000")
);

