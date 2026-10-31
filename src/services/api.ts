import axios from "axios";
import { GrandPrix, DriverStanding, ConstructorStanding } from "@/lib/types";
import { mockGrandPrix } from "@/lib/mockData";

// Base URLs
const OPEN_F1_API = "https://api.openf1.org/v1";

export const api = {
  // --- Events / Schedule ---
  getSchedule: async (season: string = "current"): Promise<GrandPrix[]> => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}.json`);
      const races = response.data.MRData.RaceTable.Races;
      
      const now = new Date();
      
      return races.map((r: any) => {
        const raceDate = new Date(`${r.date}T${r.time || '15:00:00Z'}`);
        let status: "Upcoming" | "Ongoing" | "Finished" = "Upcoming";
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        
        if (now.getTime() > raceDate.getTime() + 86400000) {
          status = "Finished";
        } else if (now.getTime() > raceDate.getTime() - threeDaysMs) {
          status = "Ongoing";
        }

        const sessions: any[] = [];
        
        const addSession = (name: string, sessionObj: any) => {
          if (sessionObj) {
            sessions.push({
              id: `${r.round}-${name.replace(/\s+/g, '')}`,
              name: name,
              date: `${sessionObj.date}T${sessionObj.time || '00:00:00Z'}`,
              status: "Upcoming"
            });
          }
        };

        addSession("Practice 1", r.FirstPractice);
        addSession("Practice 2", r.SecondPractice);
        addSession("Practice 3", r.ThirdPractice);
        addSession("Qualifying", r.Qualifying);
        addSession("Sprint Qualifying", r.SprintQualifying || r.SprintShootout);
        addSession("Sprint", r.Sprint);
        
        sessions.push({
          id: `${r.round}-Race`,
          name: "Race",
          date: `${r.date}T${r.time || '00:00:00Z'}`,
          status: status
        });

        sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sessions.forEach(s => {
          const sDate = new Date(s.date);
          if (now.getTime() > sDate.getTime() + 2 * 60 * 60 * 1000) {
            s.status = "Finished";
          } else if (now.getTime() >= sDate.getTime()) {
            s.status = "Live";
          } else {
            s.status = "Upcoming";
          }
        });

        const factualData = mockGrandPrix.find(m => m.circuit === r.Circuit.circuitName || m.country === r.Circuit.Location.country);

        return {
          id: r.round,
          name: r.raceName,
          country: r.Circuit.Location.country,
          circuit: r.Circuit.circuitName,
          date: r.date,
          isSprintWeekend: !!r.Sprint,
          status,
          sessions: sessions,
          length: factualData?.length || "5.000",
          distance: factualData?.distance || "300.000",
          laps: factualData?.laps || 50,
        };
      });
    } catch (error) {
      console.error("Failed to fetch schedule", error);
      return [];
    }
  },

  getEventDetails: async (eventId: string): Promise<GrandPrix> => {
    const schedule = await api.getSchedule("current");
    const gp = schedule.find(g => g.id === eventId);
    if (!gp) throw new Error("Event not found");
    return gp;
  },

  // --- Standings (100% Real-time dynamic from API) ---
  getDriverStandings: async (season: string = "current"): Promise<DriverStanding[]> => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`);
      const standingsLists = response.data.MRData.StandingsTable.StandingsLists;
      
      if (!standingsLists || standingsLists.length === 0) return [];
      
      return standingsLists[0].DriverStandings.map((d: any) => ({
        position: parseInt(d.position),
        driverId: d.Driver.driverId,
        code: d.Driver.code || d.Driver.familyName?.slice(0, 3).toUpperCase() || "DRV",
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
    const response = await axios.get(`${OPEN_F1_API}/car_data?session_key=${sessionKey}`);
    return response.data;
  }
};
