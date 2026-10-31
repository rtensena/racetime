export type Session = {
  id: string;
  name: string; // e.g. "FP1", "Qualifying", "Race"
  date: string; // ISO 8601
  status: "Upcoming" | "Live" | "Finished";
};

export type GrandPrix = {
  id: string;
  name: string;
  country: string;
  circuit: string;
  date: string; // Start date of weekend
  isSprintWeekend: boolean;
  sessions: Session[];
  status: "Upcoming" | "Ongoing" | "Finished";
  
  // Detailed fields
  length?: string;
  distance?: string;
  laps?: number;
  firstCompeted?: number;
  description?: string;
};

export type DriverStanding = {
  position: number;
  driverId: string;
  code?: string;
  firstName: string;
  lastName: string;
  team: string;
  points: number;
  wins: number;
  positionChange: number;
};

export type ConstructorStanding = {
  position: number;
  teamId: string;
  name: string;
  points: number;
  wins: number;
  positionChange: number;
};
