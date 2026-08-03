import { useCallback, useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { storyMachine } from '../story/storyMachine';
import { chapters } from '../story/chapters';
import { ExperienceCanvas } from '../experience/ExperienceCanvas';
import { StoryPanel } from '../ui/StoryPanel';
import { Controls } from '../ui/Controls';
import { LoadingExperience } from '../ui/LoadingExperience';

type Quality = 'high' | 'medium' | 'low';

let audioContext: AudioContext | null = null;

function playInteractionTone(enabled: boolean, completed: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') void audioContext.resume();
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
    // Audio is optional. The visual journey remains fully usable without it.
  }
}

function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'medium';
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const compactScreen = Math.min(window.innerWidth, window.innerHeight) < 760;
  if (deviceMemory <= 4 || cores <= 4 || compactScreen) return 'low';
  if (deviceMemory <= 8 || cores <= 8 || window.devicePixelRatio > 1.75) return 'medium';
  return 'high';
}

export function App() {
  const [state, send] = useMachine(storyMachine);
  const [started, setStarted] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [bootTarget, setBootTarget] = useState(12);
  const [bootProgress, setBootProgress] = useState(4);
  const [bootMessage, setBootMessage] = useState('Checking browser capabilities');
  const wheelLock = useRef(false);
  const qualityDetected = useRef(false);
  const { index, progress, completed, sound, reducedMotion, quality } = state.context;
  const chapter = chapters[index];
  const chapterProgress = progress[chapter.id];
  const loaderReady = (sceneReady || safeMode) && bootProgress >= 99.5;

  useEffect(() => {
    if (qualityDetected.current) return;
    qualityDetected.current = true;
    send({ type: 'SET_QUALITY', quality: detectQuality() });
  }, [send]);

  useEffect(() => {
    if (sceneReady) return;
    const watchdog = window.setTimeout(() => {
      setSafeMode(true);
      setBootTarget(100);
      setBootMessage('Performance mode ready');
      send({ type: 'SET_QUALITY', quality: 'low' });
    }, 7000);
    return () => window.clearTimeout(watchdog);
  }, [sceneReady, send]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBootProgress((current) => {
        if (current >= bootTarget) return current;
        const distance = bootTarget - current;
        const step = Math.max(.7, Math.min(3.2, distance * .13));
        return Math.min(bootTarget, current + step);
      });
    }, 28);
    return () => window.clearInterval(timer);
  }, [bootTarget]);

  const handleBootProgress = useCallback((value: number, message: string) => {
    setBootTarget((current) => Math.max(current, value));
    setBootMessage(message);
  }, []);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
    setSafeMode(false);
    setBootTarget(100);
    setBootMessage('Journey ready');
  }, []);

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

  const enterJourney = (withSound: boolean) => {
    if (!loaderReady) return;
    if (withSound && !sound) send({ type: 'TOGGLE_SOUND' });
    if (withSound) playInteractionTone(true, true);
    setLoaderLeaving(true);
    window.setTimeout(() => {
      setStarted(true);
      setLoaderVisible(false);
    }, reducedMotion ? 80 : 760);
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
      <a className="skip-link" href="#story-content">Skip to story</a>

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
          onBootProgress={handleBootProgress}
          onReady={handleSceneReady}
          onFailure={() => {
            setSafeMode(true);
            setBootTarget(100);
            setBootMessage('Performance mode ready');
            send({ type: 'SET_QUALITY', quality: 'low' });
          }}
        />
      </div>

      {started && (
        <div id="story-content">
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
        </div>
      )}

      {loaderVisible && (
        <div className={loaderLeaving ? 'loader-layer is-leaving' : 'loader-layer'}>
          <LoadingExperience
            progress={bootProgress}
            message={bootMessage}
            ready={loaderReady}
            safeMode={safeMode && !sceneReady}
            quality={quality}
            reducedMotion={reducedMotion}
            onQuality={(nextQuality) => send({ type: 'SET_QUALITY', quality: nextQuality })}
            onMotion={() => send({ type: 'TOGGLE_MOTION' })}
            onEnter={enterJourney}
          />
        </div>
      )}
    </main>
  );
}
