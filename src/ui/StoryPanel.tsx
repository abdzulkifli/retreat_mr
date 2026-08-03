import { chapters } from '../story/chapters';

const microcopy = [
  ['Every proposal believes it is urgent.', 'Wake the room and reveal the strategic chaos.'],
  ['Identity before priority.', 'Complete four scans to generate the initiative passport.'],
  ['Overlap is a design clue.', 'Merge familiar capabilities into one stronger programme.'],
  ['No initiative crosses alone.', 'Connect the conditions that make delivery possible.'],
  ['Priority is sequence, not rejection.', 'Help Idea 31 pass the five management gates.'],
  ['CPS connects. Owners deliver.', 'Move accountability to the business owner.'],
  ['A portfolio is a living system.', 'Activate the six HOME31 districts.']
];

export function StoryPanel({ index, progress, completed, onAct, onNext, onPrev }: {
  index: number; progress: number; completed: boolean; onAct: () => void; onNext: () => void; onPrev: () => void;
}) {
  const c = chapters[index];
  const [headline, instruction] = microcopy[index];
  return <section id="story-panel" className="story-panel" aria-live="polite" style={{ '--accent': c.accent } as React.CSSProperties}>
    <div className="chapter-meta"><span>Chapter {c.number}</span><span>{c.kicker}</span></div>
    <h1>{c.title}</h1>
    <p className="scene-hook">{headline}</p>
    <p>{c.body}</p>
    <div className="interaction-cue"><span aria-hidden="true">✦</span><span>{completed ? c.completed : instruction}</span></div>
    <div className="progress-track" aria-label={`${progress}% chapter completion`}><span style={{ width: `${progress}%` }} /></div>
    <p className="status">{completed ? 'Chapter complete' : `${Math.round(progress)}% complete`}</p>
    <div className="actions">
      <button type="button" className="secondary" onClick={onPrev} disabled={index === 0}>Back</button>
      {!completed ? <button type="button" className="primary pulse" onClick={onAct}>{c.action}</button> : <button type="button" className="primary" onClick={onNext}>{index === chapters.length - 1 ? 'Replay journey' : 'Continue journey'}</button>}
    </div>
    <p className="principle">CPS helps the idea find its place. The accountable business owner must bring it to life.</p>
  </section>;
}
