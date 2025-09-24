// src/AuthSingleton.ts
import jwt from "jsonwebtoken";

interface Mission {
  id: number;
  name: string;
  date: string;
  description: string;
  image?: string;
}

interface Planet {
  id: number;
  name: string;
  starName: string;
  discoveryYear: number;
  description: string;
}

export default class AuthSingleton {
  private static instance: AuthSingleton;
  private users: { [email: string]: { password: string; name: string } } = {};

  private missions: Mission[] = [];
  private completedMissions: Mission[] = [];
  private archivedMissions: Mission[] = [];
  private missionIdCounter = 1;

  private constructor() {
    // Demo users
    this.users["waqas@gmail.com"] = { password: "123456", name: "Waqas" };
    this.users["wajahat@gmail.com"] = { password: "567890", name: "Wajahat" };

    // Demo missions
    this.missions = [
      {
        id: this.missionIdCounter++,
        name: "IMAP Mission",
        date: "2025-12-01T10:00",
        description: "Studying solar wind and interstellar boundary.",
        image: "/images/imap.png",
      },
    ];
  }

  public static getInstance(): AuthSingleton {
    if (!AuthSingleton.instance) {
      AuthSingleton.instance = new AuthSingleton();
    }
    return AuthSingleton.instance;
  }

  // Users
  public validateUser(email: string, password: string): boolean {
    return this.users[email]?.password === password;
  }
  public login(email: string, password: string): string | null {
    if (this.validateUser(email, password)) {
      return jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });
    }
    return null;
  }

  // Missions
  public getMissions(): Mission[] { return this.missions; }
  public addMission(name: string, date: string, description: string, image?: string): Mission {
    const newMission: Mission = { id: this.missionIdCounter++, name, date, description, image };
    this.missions.push(newMission);
    return newMission;
  }
  public completeMission(id: number) {
    const index = this.missions.findIndex((m) => m.id === id);
    if (index >= 0) {
      const [done] = this.missions.splice(index, 1);
      this.completedMissions.push(done);
    }
  }
  public getCompletedMissions(): Mission[] { return this.completedMissions; }
  public archiveMission(id: number) {
    const index = this.completedMissions.findIndex((m) => m.id === id);
    if (index >= 0) {
      const [archived] = this.completedMissions.splice(index, 1);
      this.archivedMissions.push(archived);
    }
  }
  public getArchivedMissions(): Mission[] { return this.archivedMissions; }
}
