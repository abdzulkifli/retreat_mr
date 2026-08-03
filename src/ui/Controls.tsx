import { chapters } from '../story/chapters';

export function Controls({ index, sound, reducedMotion, quality, onGo, onSound, onMotion, onQuality, onReset }: any) {
  return <>
    <nav className="chapter-nav" aria-label="Journey chapters">
      {chapters.map((c, i) => <button key={c.id} className={i === index ? 'active' : ''} onClick={() => onGo(i)} aria-label={`Go to ${c.title}`}>{c.number}</button>)}
    </nav>
    <div className="utility-controls">
      <button onClick={onSound} aria-pressed={sound}>{sound ? 'Sound on' : 'Sound off'}</button>
      <button onClick={onMotion} aria-pressed={reducedMotion}>{reducedMotion ? 'Reduced motion' : 'Full motion'}</button>
      <select aria-label="Visual quality" value={quality} onChange={e => onQuality(e.target.value)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
      <button onClick={onReset}>Restart</button>
    </div>
  </>;
}
