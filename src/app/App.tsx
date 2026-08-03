import { useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { storyMachine } from '../story/storyMachine';
import { chapters } from '../story/chapters';
import { ExperienceCanvas } from '../experience/ExperienceCanvas';
import { StoryPanel } from '../ui/StoryPanel';
import { Controls } from '../ui/Controls';

let audioContext: AudioContext | null = null;

function playInteractionTone(enabled: boolean, completed: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    audioContext ??= new AudioContext();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = completed ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(completed ? 520 : 280, now);
    oscillator.frequency.exponentialRampToValueAtTime(completed ? 880 : 440, now + .18);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.055, now + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .24);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + .26);
  } catch {
    // Audio is optional. The visual journey must remain fully usable without it.
  }
}

export function App() {
  const [state, send] = useMachine(storyMachine);
  const [started, setStarted] = useState(false);
  const wheelLock = useRef(false);
  const { index, progress, completed, sound, reducedMotion, quality } = state.context;
  const chapter = chapters[index];
  const chapterProgress = progress[chapter.id];

  const act = () => {
    if (completed[chapter.id]) return;
    const amount = 100 / chapter.steps;
    const willComplete = chapterProgress + amount >= 99.5;
    send({ type: 'ACT', chapter: chapter.id, amount });
    playInteractionTone(sound, willComplete);
  };

  const next = () => {
    if (index === chapters.length - 1) {
      send({ type: 'RESET' });
      return;
    }
    send({ type: 'NEXT' });
  };

  useEffect(() => {
    if (!started) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        send({ type: 'PREV' });
      }
      if ((event.key === 'ArrowRight' || event.key === 'ArrowDown') && completed[chapter.id]) {
        event.preventDefault();
        next();
      }
      if ((event.key === 'Enter' || event.key === ' ') && !completed[chapter.id]) {
        const target = event.target as HTMLElement | null;
        if (target?.matches('button, select, a, input')) return;
        event.preventDefault();
        act();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 45 || wheelLock.current) return;
      wheelLock.current = true;
      window.setTimeout(() => { wheelLock.current = false; }, 800);
      if (event.deltaY < 0) send({ type: 'PREV' });
      if (event.deltaY > 0 && completed[chapter.id]) next();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
    };
  }, [started, chapter.id, chapterProgress, completed, index]);

  return (
    <main className="app-shell">
      <div className="brand" aria-label="HOME31 The Journey of an Idea">
        <strong>HOME31</strong>
        <span>The Journey of an Idea</span>
      </div>

      <div className="canvas-zone" aria-hidden="true">
        <ExperienceCanvas
          index={index}
          progress={progress}
          reducedMotion={reducedMotion}
          quality={quality}
          onAct={act}
        />
      </div>

      {started && (
        <>
          <div className="chapter-transition" key={chapter.id} aria-hidden="true">
            <span>{chapter.number}</span>
          </div>
          <StoryPanel
            index={index}
            progress={chapterProgress}
            completed={completed[chapter.id]}
            onAct={act}
            onNext={next}
            onPrev={() => send({ type: 'PREV' })}
          />
          <Controls
            index={index}
            sound={sound}
            reducedMotion={reducedMotion}
            quality={quality}
            completed={completed}
            onGo={(targetIndex) => send({ type: 'GO', index: targetIndex })}
            onSound={() => send({ type: 'TOGGLE_SOUND' })}
            onMotion={() => send({ type: 'TOGGLE_MOTION' })}
            onQuality={(nextQuality) => send({ type: 'SET_QUALITY', quality: nextQuality })}
            onReset={() => send({ type: 'RESET' })}
          />
        </>
      )}

      {!started && (
        <section className="intro-screen" aria-labelledby="intro-title">
          <div className="intro-copy">
            <p className="eyebrow">An interactive HOME31 story</p>
            <h1 id="intro-title">Help one idea survive the journey.</h1>
            <p>
              Idea 31 wakes after the Management Retreat convinced that implementation starts tomorrow.
              It is about to discover what turns an exciting proposal into accountable delivery.
            </p>
            <button type="button" onClick={() => setStarted(true)}>Begin the journey</button>
            <span>Use highlighted objects, scrolling, arrow keys or the story controls.</span>
          </div>
        </section>
      )}
    </main>
  );
}
