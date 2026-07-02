import axios from "axios";
import { GrandPrix, DriverStanding, ConstructorStanding } from "@/lib/types";

// Base URLs
const OPEN_F1_API = "https://api.openf1.org/v1";
const BALL_DONT_LIE_API = "https://api.balldontlie.io/f1/v1"; // Using hypothetical endpoint based on user instruction

// Note: In a real app, API keys should be in .env.local
const BDL_HEADERS = {
  // Authorization: `Bearer ${process.env.NEXT_PUBLIC_BDL_API_KEY}`
};

export const api = {
  // --- Events / Schedule ---
  getSchedule: async (season: string = "current"): Promise<GrandPrix[]> => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}.json`);
      const races = response.data.MRData.RaceTable.Races;
      
      const now = new Date();
      
      return races.map((r: any) => {
        const raceDate = new Date(`${r.date}T${r.time || '15:00:00Z'}`);
        // Simple status calculation
        let status: "Upcoming" | "Ongoing" | "Finished" = "Upcoming";
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        
        if (now.getTime() > raceDate.getTime() + 86400000) {
          status = "Finished";
        } else if (now.getTime() > raceDate.getTime() - threeDaysMs) {
          status = "Ongoing";
        }

        return {
          id: r.round,
          name: r.raceName,
          country: r.Circuit.Location.country,
          circuit: r.Circuit.circuitName,
          date: r.date,
          isSprintWeekend: !!r.Sprint,
          status,
          sessions: [],
          length: "",
          distance: "",
          laps: 0,
        };
      });
    } catch (error) {
      console.error("Failed to fetch schedule", error);
      return [];
    }
  },

  getEventDetails: async (eventId: string): Promise<GrandPrix> => {
    // We can fetch schedule and find it
    const schedule = await api.getSchedule();
    const gp = schedule.find(g => g.id === eventId);
    if (!gp) throw new Error("Event not found");
    return gp;
  },

  // --- Standings ---
  getDriverStandings: async (season: string = "current"): Promise<DriverStanding[]> => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`);
      const standingsLists = response.data.MRData.StandingsTable.StandingsLists;
      
      if (!standingsLists || standingsLists.length === 0) return [];
      
      return standingsLists[0].DriverStandings.map((d: any) => ({
        position: parseInt(d.position),
        driverId: d.Driver.driverId,
        firstName: d.Driver.givenName,
        lastName: d.Driver.familyName,
        team: d.Constructors[0]?.name || "Unknown",
        points: parseFloat(d.points),
        wins: parseInt(d.wins),
        positionChange: 0,
      }));
    } catch (error) {
      console.error("Failed to fetch driver standings", error);
      return [];
    }
  },

  getConstructorStandings: async (season: string = "current"): Promise<ConstructorStanding[]> => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`);
      const standingsLists = response.data.MRData.StandingsTable.StandingsLists;
      
      if (!standingsLists || standingsLists.length === 0) return [];
      
      return standingsLists[0].ConstructorStandings.map((c: any) => ({
        position: parseInt(c.position),
        teamId: c.Constructor.constructorId,
        name: c.Constructor.name,
        points: parseFloat(c.points),
        wins: parseInt(c.wins),
        positionChange: 0,
      }));
    } catch (error) {
      console.error("Failed to fetch constructor standings", error);
      return [];
    }
  },

  // --- Live Data ---
  getLiveTelemetry: async (sessionKey: string) => {
    // OpenF1 is real-time, leaving this untouched
    const response = await axios.get(`${OPEN_F1_API}/car_data?session_key=${sessionKey}`);
    return response.data;
  }
};
