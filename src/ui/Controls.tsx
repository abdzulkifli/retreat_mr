import { chapters, type ChapterId } from '../story/chapters';

type Quality = 'high' | 'medium' | 'low';

type ControlsProps = {
  index: number;
  sound: boolean;
  reducedMotion: boolean;
  quality: Quality;
  completed: Record<ChapterId, boolean>;
  onGo: (index: number) => void;
  onSound: () => void;
  onMotion: () => void;
  onQuality: (quality: Quality) => void;
  onReset: () => void;
};

export function Controls({
  index,
  sound,
  reducedMotion,
  quality,
  completed,
  onGo,
  onSound,
  onMotion,
  onQuality,
  onReset
}: ControlsProps) {
  return (
    <>
      <nav className="chapter-nav" aria-label="Journey chapters">
        {chapters.map((chapter, chapterIndex) => (
          <button
            type="button"
            key={chapter.id}
            className={`${chapterIndex === index ? 'active' : ''} ${completed[chapter.id] ? 'complete' : ''}`}
            onClick={() => onGo(chapterIndex)}
            aria-current={chapterIndex === index ? 'step' : undefined}
            aria-label={`Go to ${chapter.title}${completed[chapter.id] ? ', completed' : ''}`}
          >
            {chapter.number}
          </button>
        ))}
      </nav>

      <div className="utility-controls" aria-label="Journey settings">
        <button type="button" onClick={onSound} aria-pressed={sound}>{sound ? 'Sound on' : 'Sound off'}</button>
        <button type="button" onClick={onMotion} aria-pressed={reducedMotion}>{reducedMotion ? 'Reduced motion' : 'Full motion'}</button>
        <label>
          <span className="sr-only">Visual quality</span>
          <select aria-label="Visual quality" value={quality} onChange={(event) => onQuality(event.target.value as Quality)}>
            <option value="high">High quality</option>
            <option value="medium">Medium quality</option>
            <option value="low">Low quality</option>
          </select>
        </label>
        <button type="button" onClick={onReset}>Restart</button>
      </div>
    </>
  );
}
