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

    // Demo ongoing missions (future-dated)
    this.missions = [
      {
        id: this.missionIdCounter++,
        name: "IMAP Mission",
        date: "2025-12-01T10:00",
        description: "Studying solar wind and interstellar boundary.",
        image: "/images/imap.png",
      },
      {
        id: this.missionIdCounter++,
        name: "Lunar Gateway",
        date: "2030-04-18T09:00",
        description: "A space station orbiting the Moon for deep-space exploration.",
        image: "/images/lunar_gateway.png",
      },
      {
        id: this.missionIdCounter++,
        name: "Europa Clipper",
        date: "2031-06-22T14:30",
        description: "Exploring Jupiter’s icy moon to investigate its habitability.",
        image: "/images/europa_clipper.png",
      },
      {
        id: this.missionIdCounter++,
        name: "Titan Dragonfly",
        date: "2034-09-10T11:00",
        description: "A drone mission to Saturn’s moon Titan to study its chemistry.",
        image: "/images/titan_dragonfly.png",
      },
      {
        id: this.missionIdCounter++,
        name: "Artemis IV",
        date: "2032-03-15T08:00",
        description: "A crewed mission continuing lunar exploration and construction.",
        image: "/images/artemis_iv.png",
      },
      {
        id: this.missionIdCounter++,
        name: "Mars Sample Return",
        date: "2035-11-05T17:45",
        description: "Returning Martian rock samples to Earth for detailed analysis.",
        image: "/images/mars_sample_return.png",
      },
    ];

    // Demo completed missions
    this.completedMissions = [
      {
        id: this.missionIdCounter++,
        name: "Voyager 1",
        date: "1977-09-05T08:56",
        description: "First human-made object to reach interstellar space.",
        image: "/images/voyager1.png",
      },
      {
        id: this.missionIdCounter++,
        name: "Apollo 11",
        date: "1969-07-16T13:32",
        description: "The first successful crewed Moon landing mission.",
        image: "/images/apollo11.png",
      },
      {
        id: this.missionIdCounter++,
        name: "James Webb Telescope",
        date: "2022-12-25T12:20",
        description: "Deep-space telescope observing distant galaxies and exoplanets.",
        image: "/images/webb.png",
      },
    ];
  }

  public static getInstance(): AuthSingleton {
    if (!AuthSingleton.instance) {
      AuthSingleton.instance = new AuthSingleton();
    }
    return AuthSingleton.instance;
  }

  // ---------------- USERS ----------------
  public validateUser(email: string, password: string): boolean {
    return this.users[email]?.password === password;
  }

  public login(email: string, password: string): string | null {
    if (this.validateUser(email, password)) {
      return jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });
    }
    return null;
  }

  // ---------------- MISSIONS ----------------
  public getMissions(): Mission[] {
    // Sort missions by date ascending, so newer/user missions appear first
    return this.missions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  public addMission(
    name: string,
    date: string,
    description: string,
    image?: string
  ): Mission {
    const newMission: Mission = {
      id: this.missionIdCounter++,
      name,
      date,
      description,
      image,
    };
    this.missions.push(newMission);
    // Keep missions sorted (user missions appear before far-future ones)
    this.missions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return newMission;
  }

  public completeMission(id: number) {
    const index = this.missions.findIndex((m) => m.id === id);
    if (index >= 0) {
      const [done] = this.missions.splice(index, 1);
      this.completedMissions.push(done);
    }
  }

  public getCompletedMissions(): Mission[] {
    return this.completedMissions;
  }

  public archiveMission(id: number) {
    const index = this.completedMissions.findIndex((m) => m.id === id);
    if (index >= 0) {
      const [archived] = this.completedMissions.splice(index, 1);
      this.archivedMissions.push(archived);
    }
  }

  public getArchivedMissions(): Mission[] {
    return this.archivedMissions;
  }

  // ✅ NEW: Delete a mission from any list
  public deleteMission(id: number) {
    this.missions = this.missions.filter((m) => m.id !== id);
    this.completedMissions = this.completedMissions.filter((m) => m.id !== id);
    this.archivedMissions = this.archivedMissions.filter((m) => m.id !== id);
  }

  // ✅ NEW: Reschedule (update date) for any mission
  public rescheduleMission(id: number, newDate: string): Mission | null {
    const allLists = [
      ...this.missions,
      ...this.completedMissions,
      ...this.archivedMissions,
    ];
    const mission = allLists.find((m) => m.id === id);
    if (mission) {
      mission.date = newDate;
      return mission;
    }
    return null;
  }
}
