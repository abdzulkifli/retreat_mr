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
  hook: string;
  body: string;
  quote: string;
  instruction: string;
  action: string;
  completed: string;
  steps: number;
  position: [number, number, number];
  camera: [number, number, number];
  accent: string;
  atmosphere: string;
};

export const chapters: Chapter[] = [
  {
    id: 'retreat',
    number: '01',
    title: 'The Retreat Room',
    kicker: 'Possibility is everywhere.',
    hook: 'Every proposal believes it should move first.',
    body: 'The retreat created valuable possibilities, but each proposal arrived with a different level of clarity, ownership and readiness.',
    quote: '“Implementation starts tomorrow… right?”',
    instruction: 'Wake each highlighted proposal and listen to the room come alive.',
    action: 'Wake the next proposal',
    completed: 'The room is awake. Now every possibility must explain itself.',
    steps: 7,
    position: [0, 0, 0],
    camera: [0, 2.5, 8.4],
    accent: '#DF745F',
    atmosphere: '#E9DED2'
  },
  {
    id: 'scanner',
    number: '02',
    title: 'Initiative Scanner',
    kicker: 'Identity before priority.',
    hook: 'An exciting title is not yet an initiative.',
    body: 'Idea 31 must establish what problem it solves, how it aligns, who owns it, what it costs and how its outcomes will be measured.',
    quote: '“You need my budget too?”',
    instruction: 'Activate Identity, Accountability, Delivery and Governance in sequence.',
    action: 'Run the next scan',
    completed: 'Initiative passport complete. Idea 31 now has an identity.',
    steps: 4,
    position: [12, 0, -2],
    camera: [12, 2.35, 7.8],
    accent: '#4B9B9A',
    atmosphere: '#D8E7E4'
  },
  {
    id: 'duplicates',
    number: '03',
    title: 'Duplicate Carnival',
    kicker: 'Different names. Familiar capabilities.',
    hook: 'Four “unique” ideas are looking strangely familiar.',
    body: 'Overlap is not automatically waste. It may reveal several proposals trying to create the same shared enterprise capability.',
    quote: '“I did not disappear. I became part of something stronger.”',
    instruction: 'Select each proposal and pull its shared capability into the centre.',
    action: 'Merge the next proposal',
    completed: 'Four proposals have become one connected customer capability.',
    steps: 4,
    position: [24, 0, 1],
    camera: [24, 2.7, 8.1],
    accent: '#C6A15B',
    atmosphere: '#EFE2C9'
  },
  {
    id: 'dependencies',
    number: '04',
    title: 'Dependency Canyon',
    kicker: 'Transformation never travels alone.',
    hook: 'The destination is visible. The route is not.',
    body: 'Finance, ICT, data, people, risk and the business owner are not side issues. They are the conditions that allow delivery to happen.',
    quote: '“That shortcut has no owner, architecture or budget.”',
    instruction: 'Activate each island to assemble a safe route across the canyon.',
    action: 'Connect the next dependency',
    completed: 'The dependencies now form a credible route forward.',
    steps: 6,
    position: [36, -1, -1],
    camera: [36, 3.6, 9.1],
    accent: '#28558D',
    atmosphere: '#D8E0E8'
  },
  {
    id: 'priority',
    number: '05',
    title: 'Priority Mountain',
    kicker: 'Good ideas still need sequence.',
    hook: 'Reaching the summit does not mean every idea moves now.',
    body: 'Prioritisation determines what moves, what prepares next, what integrates with existing work and what requires further assessment.',
    quote: '“A place in the portfolio is better than a race without a route.”',
    instruction: 'Pass Why, Value, Feasibility, Readiness and Confidence.',
    action: 'Pass the next priority gate',
    completed: 'Idea 31 has earned an appropriate place in the sequence.',
    steps: 5,
    position: [48, 0, 0],
    camera: [48, 4.8, 10.2],
    accent: '#C6A15B',
    atmosphere: '#E7DDC9'
  },
  {
    id: 'ownership',
    number: '06',
    title: 'Ownership Harbour',
    kicker: 'Coordination is shared. Accountability is not.',
    hook: 'Idea 31 tries to leave all its luggage with CPS.',
    body: 'CPS connects, structures and coordinates the portfolio journey. The accountable business owner must lead delivery and own the outcome.',
    quote: '“We will connect your journey. Your owner must lead it.”',
    instruction: 'Move the delivery responsibilities to the accountable owner.',
    action: 'Complete the next handoff',
    completed: 'Accountability has moved to where delivery lives.',
    steps: 4,
    position: [60, 0, -2],
    camera: [60, 2.9, 8.7],
    accent: '#66A67A',
    atmosphere: '#DCE9DE'
  },
  {
    id: 'city',
    number: '07',
    title: 'HOME31 City',
    kicker: 'One direction. One portfolio.',
    hook: 'The city is quiet until its six districts connect.',
    body: 'Idea 31 is no longer the centre of the universe. It becomes one accountable part of a connected, sequenced and measurable institution.',
    quote: '“I found my place—and the institution became stronger.”',
    instruction: 'Activate the six enterprise districts and bring HOME31 to life.',
    action: 'Activate the next district',
    completed: 'HOME31 is alive. Every initiative has a place, an owner and a route.',
    steps: 6,
    position: [72, 0, 0],
    camera: [72, 5.3, 11.8],
    accent: '#4B9B9A',
    atmosphere: '#DCE7DF'
  }
];
