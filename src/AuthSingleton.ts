import jwt from "jsonwebtoken";

interface Mission {
  id: number;
  name: string;
  date: string;
  description: string;
}

class AuthSingleton {
  private static instance: AuthSingleton;
  private users: { [email: string]: { password: string; name: string } } = {};

  // --- Missions Storage ---
  private missions: Mission[] = [];
  private archivedMissions: Mission[] = []; // NEW: Archived missions storage

  private constructor() {
    // Default users
    this.users["waqas@gmail.com"] = { password: "123456", name: "Waqas" };
    this.users["wajahat@gmail.com"] = { password: "567890", name: "Wajahat" };

    // Default missions
    this.missions = [
      {
        id: 1,
        name: "Falcon 9 - Starlink 25",
        date: "2025-09-01",
        description: "Delivering 60 Starlink satellites into orbit."
      },
      {
        id: 2,
        name: "Falcon Heavy - Jupiter Probe",
        date: "2025-10-10",
        description: "Launching a deep space probe to Jupiter."
      },
      {
        id: 3,
        name: "Dragon Cargo - ISS Resupply",
        date: "2025-08-15",
        description: "Resupplying the International Space Station with cargo."
      }
    ];
  }

  public static getInstance(): AuthSingleton {
    if (!AuthSingleton.instance) {
      AuthSingleton.instance = new AuthSingleton();
    }
    return AuthSingleton.instance;
  }

  // --- User Methods ---
  public validateUser(email: string, password: string): boolean {
    return this.users[email]?.password === password;
  }

  public getUserName(email: string): string | null {
    return this.users[email]?.name ?? null;
  }

  public addUser(email: string, password: string, name: string) {
    this.users[email] = { password, name };
  }

  public getUsers(): { [email: string]: { password: string; name: string } } {
    return this.users;
  }

  // --- Mission Methods ---
  public getMissions(): Mission[] {
    return this.missions;
  }

  public addMission(name: string, date: string, description: string) {
    const newMission = {
      id: this.missions.length + this.archivedMissions.length + 1,
      name,
      date,
      description
    };
    this.missions.push(newMission);
  }

  public deleteMission(id: number) {
    this.missions = this.missions.filter((m) => m.id !== id);
  }

  // --- Archived Missions Methods ---
  public getArchivedMissions(): Mission[] {
    return this.archivedMissions;
  }

  public archiveMission(id: number) {
    const index = this.missions.findIndex(m => m.id === id);
    if (index >= 0) {
      const [archived] = this.missions.splice(index, 1);
      this.archivedMissions.push(archived);
    }
  }

  public restoreMission(id: number) {
    const index = this.archivedMissions.findIndex(m => m.id === id);
    if (index >= 0) {
      const [restored] = this.archivedMissions.splice(index, 1);
      this.missions.push(restored);
    }
  }

  public deleteArchivedMission(id: number) {
    this.archivedMissions = this.archivedMissions.filter(m => m.id !== id);
  }

  // --- JWT Login Method ---
  private static SECRET = "your_secret_key"; // put in .env in real apps

  public login(email: string, password: string): string | null {
    if (this.validateUser(email, password)) {
      const token = jwt.sign({ email }, AuthSingleton.SECRET, {
        expiresIn: "1h"
      });
      return token;
    }
    return null;
  }
}

export default AuthSingleton;
