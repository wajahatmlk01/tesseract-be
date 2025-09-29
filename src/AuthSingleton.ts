import jwt from "jsonwebtoken";

interface Mission {
  id: number;
  name: string;
  date: string;
  description: string;
  image?: string;
}

class AuthSingleton {
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
        id: 1,
        name: "Falcon 9 - Starlink 25",
        date: "2025-09-25T18:00:00", // ISO format (upcoming)
        description: "Delivering 60 Starlink satellites into orbit."
      },
      {
        id: 2,
        name: "Falcon Heavy - Jupiter Probe",
        date: "2025-10-10T14:00:00",
        description: "Launching a deep space probe to Jupiter."
      }
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

  public getUserName(email: string): string | null {
    return this.users[email]?.name ?? null;
  }

  // ---------------- MISSIONS ----------------
  public getMissions(): Mission[] {
    return this.missions;
  }

  public addMission(name: string, date: string, description: string, image?: string): Mission {
  const newMission: Mission = {
    id: this.missions.length + this.completedMissions.length + this.archivedMissions.length + 1,
    name,
    date,
    description,
    image: image || ""
  };
  this.missions.push(newMission);
  return newMission;
  }

  public completeMission(id: number) {
    const index = this.missions.findIndex(m => m.id === id);
    if (index >= 0) {
      const [done] = this.missions.splice(index, 1);
      this.completedMissions.push(done);
    }
  }

  public getCompletedMissions(): Mission[] {
    return this.completedMissions;
  }

  public archiveMission(id: number) {
    const index = this.completedMissions.findIndex(m => m.id === id);
    if (index >= 0) {
      const [archived] = this.completedMissions.splice(index, 1);
      this.archivedMissions.push(archived);
    }
  }

  public getArchivedMissions(): Mission[] {
    return this.archivedMissions;
  }

  // ---------------- JWT ----------------
  private static SECRET = "your_secret_key";

  public login(email: string, password: string): string | null {
    if (this.validateUser(email, password)) {
      return jwt.sign({ email }, AuthSingleton.SECRET, { expiresIn: "1h" });
    }
    return null;
  }
}

export default AuthSingleton;