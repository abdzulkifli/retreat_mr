import type { CSSProperties } from 'react';
import { chapters } from '../story/chapters';

export function StoryPanel({ index, progress, completed, onAct, onNext, onPrev }: {
  index: number;
  progress: number;
  completed: boolean;
  onAct: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const chapter = chapters[index];
  const completedSteps = Math.min(chapter.steps, Math.round((progress / 100) * chapter.steps));

  return (
    <section
      id="story-panel"
      className="story-panel"
      aria-live="polite"
      style={{ '--accent': chapter.accent } as CSSProperties}
    >
      <div className="chapter-meta">
        <span>Chapter {chapter.number}</span>
        <span>{chapter.kicker}</span>
      </div>
      <h1>{chapter.title}</h1>
      <p className="scene-hook">{chapter.hook}</p>
      <p>{chapter.body}</p>
      <blockquote>{chapter.quote}</blockquote>

      <div className="interaction-cue">
        <span className="interaction-star" aria-hidden="true">✦</span>
        <div>
          <strong>{completed ? 'Transformation complete' : `Interactive moment ${Math.min(completedSteps + 1, chapter.steps)} of ${chapter.steps}`}</strong>
          <span>{completed ? chapter.completed : chapter.instruction}</span>
        </div>
      </div>

      <div className="progress-track" aria-label={`${Math.round(progress)}% chapter completion`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="step-dots" aria-hidden="true">
        {Array.from({ length: chapter.steps }, (_, step) => (
          <span key={step} className={step < completedSteps ? 'done' : step === completedSteps && !completed ? 'current' : ''} />
        ))}
      </div>

      <div className="actions">
        <button type="button" className="secondary" onClick={onPrev} disabled={index === 0}>Back</button>
        {!completed ? (
          <button type="button" className="primary pulse" onClick={onAct}>{chapter.action}</button>
        ) : (
          <button type="button" className="primary" onClick={onNext}>
            {index === chapters.length - 1 ? 'Replay journey' : 'Continue journey'}
          </button>
        )}
      </div>

      <p className="navigation-note">
        Interact directly with the highlighted 3D object. The button is an accessible fallback.
      </p>
      <p className="principle">CPS helps the idea find its place. The accountable business owner must bring it to life.</p>
    </section>
  );
}
