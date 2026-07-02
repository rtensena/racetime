import { GrandPrix, DriverStanding, ConstructorStanding } from "@/lib/types";
import { addDays, subDays } from "date-fns";

const raceTemplates = [
  { country: "Bahrain", name: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: "2026-03-01T15:00:00Z" },
  { country: "Saudi Arabia", name: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", date: "2026-03-08T17:00:00Z" },
  { country: "Australia", name: "Australian Grand Prix", circuit: "Albert Park Grand Prix Circuit", date: "2026-03-22T04:00:00Z" },
  { country: "Japan", name: "Japanese Grand Prix", circuit: "Suzuka Circuit", date: "2026-04-05T05:00:00Z" },
  { country: "China", name: "Chinese Grand Prix", circuit: "Shanghai International Circuit", date: "2026-04-19T07:00:00Z" },
  { country: "USA", name: "Miami Grand Prix", circuit: "Miami International Autodrome", isSprint: true, date: "2026-05-03T20:00:00Z" },
  { country: "Italy", name: "Emilia Romagna Grand Prix", circuit: "Autodromo Enzo e Dino Ferrari", date: "2026-05-17T13:00:00Z" },
  { country: "Monaco", name: "Monaco Grand Prix", circuit: "Circuit de Monaco", date: "2026-05-24T13:00:00Z" },
  { country: "Canada", name: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", date: "2026-06-07T18:00:00Z" },
  { country: "Spain", name: "Spanish Grand Prix", circuit: "Circuit de Barcelona-Catalunya", date: "2026-06-21T13:00:00Z" },
  { country: "Austria", name: "Austrian Grand Prix", circuit: "Red Bull Ring", isSprint: true, date: "2026-06-28T13:00:00Z" },
  { country: "Great Britain", name: "British Grand Prix", circuit: "Silverstone Circuit", date: "2026-07-05T14:00:00Z" },
  { country: "Hungary", name: "Hungarian Grand Prix", circuit: "Hungaroring", date: "2026-07-19T13:00:00Z" },
  { country: "Belgium", name: "Belgian Grand Prix", circuit: "Circuit de Spa-Francorchamps", date: "2026-07-26T13:00:00Z" },
  { country: "Netherlands", name: "Dutch Grand Prix", circuit: "Circuit Zandvoort", date: "2026-08-30T13:00:00Z" },
  { country: "Italy", name: "Italian Grand Prix", circuit: "Autodromo Nazionale Monza", date: "2026-09-06T13:00:00Z" },
  { country: "Azerbaijan", name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", date: "2026-09-20T11:00:00Z" },
  { country: "Singapore", name: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", date: "2026-10-04T12:00:00Z" },
  { country: "USA", name: "United States Grand Prix", circuit: "Circuit of the Americas", isSprint: true, date: "2026-10-18T19:00:00Z" },
  { country: "Mexico", name: "Mexico City Grand Prix", circuit: "Autódromo Hermanos Rodríguez", date: "2026-10-25T20:00:00Z" },
  { country: "Brazil", name: "São Paulo Grand Prix", circuit: "Autódromo José Carlos Pace", isSprint: true, date: "2026-11-08T17:00:00Z" },
  { country: "USA", name: "Las Vegas Grand Prix", circuit: "Las Vegas Strip Street Circuit", date: "2026-11-22T06:00:00Z" },
  { country: "Qatar", name: "Qatar Grand Prix", circuit: "Lusail International Circuit", isSprint: true, date: "2026-11-29T17:00:00Z" },
  { country: "UAE", name: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", date: "2026-12-06T13:00:00Z" }
];

export const mockGrandPrix: GrandPrix[] = raceTemplates.map((template, index) => {
  const raceDate = new Date(template.date);
  const now = new Date();
  
  let gpStatus: "Upcoming" | "Ongoing" | "Finished" = "Upcoming";
  let sessionStatus: "Upcoming" | "Live" | "Finished" = "Upcoming";
  
  const msDiff = raceDate.getTime() - now.getTime();
  const daysDiff = msDiff / (1000 * 60 * 60 * 24);
  
  if (daysDiff < -1) {
    gpStatus = "Finished";
    sessionStatus = "Finished";
  } else if (daysDiff >= -1 && daysDiff <= 3) {
    gpStatus = "Ongoing";
    sessionStatus = "Live";
  } else {
    gpStatus = "Upcoming";
    sessionStatus = "Upcoming";
  }

  return {
    id: `gp-${index + 1}`,
    name: template.name,
    country: template.country,
    circuit: template.circuit,
    date: raceDate.toISOString(),
    isSprintWeekend: !!template.isSprint,
    status: gpStatus,
    length: "5.000",
    distance: "305.000",
    laps: 50,
    firstCompeted: 1950,
    description: `The ${template.name} takes place at the iconic ${template.circuit}, offering fans an unforgettable weekend of speed and precision.`,
    sessions: template.isSprint ? [
      { id: `s1-${index}`, name: "FP1", date: subDays(raceDate, 2).toISOString(), status: sessionStatus },
      { id: `s2-${index}`, name: "Sprint Quali", date: subDays(raceDate, 2).toISOString(), status: sessionStatus },
      { id: `s3-${index}`, name: "Sprint", date: subDays(raceDate, 1).toISOString(), status: sessionStatus },
      { id: `s4-${index}`, name: "Qualifying", date: subDays(raceDate, 1).toISOString(), status: sessionStatus },
      { id: `s5-${index}`, name: "Race", date: raceDate.toISOString(), status: sessionStatus },
    ] : [
      { id: `s1-${index}`, name: "FP1", date: subDays(raceDate, 2).toISOString(), status: sessionStatus },
      { id: `s2-${index}`, name: "FP2", date: subDays(raceDate, 2).toISOString(), status: sessionStatus },
      { id: `s3-${index}`, name: "FP3", date: subDays(raceDate, 1).toISOString(), status: sessionStatus },
      { id: `s4-${index}`, name: "Qualifying", date: subDays(raceDate, 1).toISOString(), status: sessionStatus },
      { id: `s5-${index}`, name: "Race", date: raceDate.toISOString(), status: sessionStatus },
    ]
  };
});

export const mockDriverStandings: DriverStanding[] = [
  { position: 1, driverId: "d1", firstName: "Max", lastName: "Verstappen", team: "Red Bull Racing", points: 255, wins: 7, positionChange: 0 },
  { position: 2, driverId: "d2", firstName: "Lando", lastName: "Norris", team: "McLaren", points: 199, wins: 1, positionChange: 1 },
  { position: 3, driverId: "d3", firstName: "Charles", lastName: "Leclerc", team: "Ferrari", points: 150, wins: 1, positionChange: -1 },
  { position: 4, driverId: "d4", firstName: "Carlos", lastName: "Sainz", team: "Ferrari", points: 135, wins: 1, positionChange: 0 },
  { position: 5, driverId: "d5", firstName: "Oscar", lastName: "Piastri", team: "McLaren", points: 112, wins: 0, positionChange: 2 },
];
