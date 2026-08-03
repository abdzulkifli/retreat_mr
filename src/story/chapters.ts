export type ChapterId =
  | 'retreat'
  | 'scanner'
  | 'duplicates'
  | 'dependencies'
  | 'priority'
  | 'ownership'
  | 'city';

export type Chapter = {
  id: ChapterId;
  number: string;
  title: string;
  kicker: string;
  body: string;
  action: string;
  completed: string;
  position: [number, number, number];
  camera: [number, number, number];
  accent: string;
};

export const chapters: Chapter[] = [
  {
    id: 'retreat', number: '01', title: 'The Retreat Room', kicker: 'Possibility is everywhere.',
    body: 'Hundreds of proposals wake up after the retreat. Every idea feels urgent—but clarity, ownership and readiness are still uneven.',
    action: 'Wake the proposals', completed: 'The room is awake. Now the real work begins.',
    position: [0, 0, 0], camera: [0, 2.4, 7.8], accent: '#DF745F'
  },
  {
    id: 'scanner', number: '02', title: 'Initiative Scanner', kicker: 'An idea needs an identity.',
    body: 'Idea 31 must explain its problem, alignment, owner, outcomes, cost, risks, dependencies and measures before Management can prioritise it.',
    action: 'Run the four scans', completed: 'Initiative passport complete.',
    position: [12, 0, -2], camera: [12, 2.2, 7], accent: '#4B9B9A'
  },
  {
    id: 'duplicates', number: '03', title: 'Duplicate Carnival', kicker: 'Different names. Familiar capabilities.',
    body: 'Overlapping proposals are not failures. They may be pieces of one stronger enterprise programme.',
    action: 'Merge the four proposals', completed: 'Four proposals became one connected capability.',
    position: [24, 0, 1], camera: [24, 2.6, 7.5], accent: '#C6A15B'
  },
  {
    id: 'dependencies', number: '04', title: 'Dependency Canyon', kicker: 'Transformation never travels alone.',
    body: 'Finance, ICT, data, people, risk, legal and the business owner create the conditions that allow delivery to happen.',
    action: 'Build the bridge', completed: 'The dependencies now form a route forward.',
    position: [36, -1, -1], camera: [36, 3.4, 8.5], accent: '#28558D'
  },
  {
    id: 'priority', number: '05', title: 'Priority Mountain', kicker: 'Good ideas still need sequence.',
    body: 'Prioritisation determines what moves now, what must prepare next, and what needs further assessment or integration.',
    action: 'Pass five priority gates', completed: 'Idea 31 has earned its place in the sequence.',
    position: [48, 0, 0], camera: [48, 4.5, 9.5], accent: '#C6A15B'
  },
  {
    id: 'ownership', number: '06', title: 'Ownership Harbour', kicker: 'Coordination is shared. Accountability is not.',
    body: 'CPS connects the portfolio journey. The accountable business owner must lead delivery and own the outcome.',
    action: 'Complete the handoff', completed: 'Ownership has moved to where delivery lives.',
    position: [60, 0, -2], camera: [60, 2.7, 8], accent: '#66A67A'
  },
  {
    id: 'city', number: '07', title: 'HOME31 City', kicker: 'One direction. One portfolio.',
    body: 'Idea 31 is no longer the centre of the universe. It becomes part of a connected, sequenced and measurable institution.',
    action: 'Activate all six districts', completed: 'HOME31 is alive—and every initiative has a place.',
    position: [72, 0, 0], camera: [72, 5, 11], accent: '#4B9B9A'
  }
];
