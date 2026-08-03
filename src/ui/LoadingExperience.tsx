import type { ChangeEvent, CSSProperties } from 'react';

type Quality = 'high' | 'medium' | 'low';

type LoadingExperienceProps = {
  progress: number;
  message: string;
  ready: boolean;
  safeMode: boolean;
  quality: Quality;
  reducedMotion: boolean;
  onQuality: (quality: Quality) => void;
  onMotion: () => void;
  onEnter: (withSound: boolean) => void;
};

const fragments = Array.from({ length: 12 }, (_, index) => index);

export function LoadingExperience({
  progress,
  message,
  ready,
  safeMode,
  quality,
  reducedMotion,
  onQuality,
  onMotion,
  onEnter
}: LoadingExperienceProps) {
  const rounded = Math.max(0, Math.min(100, Math.round(progress)));

  const handleQuality = (event: ChangeEvent<HTMLSelectElement>) => {
    onQuality(event.target.value as Quality);
  };

  return (
    <section
      className={`loading-experience ${ready ? 'is-ready' : ''}`}
      aria-labelledby="loading-title"
      aria-busy={!ready}
    >
      <div className="loading-ambient" aria-hidden="true">
        <span className="ambient-orb ambient-orb-one" />
        <span className="ambient-orb ambient-orb-two" />
        <span className="ambient-grid" />
      </div>

      <div className="loading-visual" aria-hidden="true">
        <div className="loading-symbol">
          {fragments.map((fragment) => (
            <span
              key={fragment}
              className="symbol-fragment"
              style={{ '--fragment': fragment } as CSSProperties}
            />
          ))}
          <div className="loading-character">
            <span className="loading-brow loading-brow-left" />
            <span className="loading-brow loading-brow-right" />
            <span className="loading-eye loading-eye-left" />
            <span className="loading-eye loading-eye-right" />
            <strong>31</strong>
            <span className="loading-mouth" />
          </div>
          <span className="loading-ring loading-ring-one" />
          <span className="loading-ring loading-ring-two" />
        </div>
      </div>

      <div className="loading-copy">
        <p className="loading-kicker">HOME31 · An interactive institutional story</p>
        <h1 id="loading-title">
          {ready ? (safeMode ? 'The journey is ready in performance mode.' : 'Idea 31 is awake.') : 'Preparing the journey of an idea…'}
        </h1>
        <p className="loading-description">
          {ready
            ? (safeMode
              ? 'The 3D engine took longer than expected, so HOME31 opened a lighter visual path. The complete story and interactions remain available.'
              : 'It believes implementation starts tomorrow. Help it discover what turns an exciting proposal into accountable delivery.')
            : 'Assembling the world, warming the 3D engine and preparing the first scene.'}
        </p>

        <div className="loading-status" aria-live="polite">
          <div className="loading-status-row">
            <span>{ready ? (safeMode ? 'Safe start available' : 'Journey ready') : message}</span>
            <strong>{rounded}%</strong>
          </div>
          <div className="loading-track" aria-label={`Loading progress ${rounded}%`}>
            <span style={{ width: `${rounded}%` }} />
          </div>
        </div>

        <div className="loading-settings" aria-label="Journey preferences">
          <label>
            <span>Graphics</span>
            <select value={quality} onChange={handleQuality}>
              <option value="high">High detail</option>
              <option value="medium">Balanced</option>
              <option value="low">Performance</option>
            </select>
          </label>
          <button type="button" onClick={onMotion} aria-pressed={reducedMotion}>
            {reducedMotion ? 'Reduced motion' : 'Cinematic motion'}
          </button>
        </div>

        <div className={`loading-entry ${ready ? 'is-visible' : ''}`} aria-hidden={!ready}>
          <button type="button" className="enter-primary" disabled={!ready} onClick={() => onEnter(true)}>
            Enter with sound
          </button>
          <button type="button" className="enter-secondary" disabled={!ready} onClick={() => onEnter(false)}>
            Enter quietly
          </button>
        </div>

        <p className="loading-footnote">
          Sound is optional. Keyboard navigation, reduced motion and a non-WebGL fallback remain available.
        </p>
      </div>
    </section>
  );
}
