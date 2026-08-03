import { assign, setup } from 'xstate';
import { chapters, type ChapterId } from './chapters';

type Context = {
  index: number;
  completed: Record<ChapterId, boolean>;
  progress: Record<ChapterId, number>;
  sound: boolean;
  reducedMotion: boolean;
  quality: 'high' | 'medium' | 'low';
};

type Event =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO'; index: number }
  | { type: 'ACT'; chapter: ChapterId; amount?: number }
  | { type: 'COMPLETE'; chapter: ChapterId }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_MOTION' }
  | { type: 'SET_QUALITY'; quality: Context['quality'] }
  | { type: 'RESET' };

const emptyCompleted = Object.fromEntries(chapters.map(c => [c.id, false])) as Record<ChapterId, boolean>;
const emptyProgress = Object.fromEntries(chapters.map(c => [c.id, 0])) as Record<ChapterId, number>;

export const storyMachine = setup({
  types: { context: {} as Context, events: {} as Event },
  actions: {
    next: assign(({ context }) => ({ index: Math.min(chapters.length - 1, context.index + 1) })),
    prev: assign(({ context }) => ({ index: Math.max(0, context.index - 1) })),
    go: assign(({ event }) => ({ index: event.type === 'GO' ? Math.max(0, Math.min(chapters.length - 1, event.index)) : 0 })),
    act: assign(({ context, event }) => {
      if (event.type !== 'ACT') return {};
      const value = Math.min(100, context.progress[event.chapter] + (event.amount ?? 25));
      return {
        progress: { ...context.progress, [event.chapter]: value },
        completed: value >= 100 ? { ...context.completed, [event.chapter]: true } : context.completed
      };
    }),
    complete: assign(({ context, event }) => event.type === 'COMPLETE' ? ({ completed: { ...context.completed, [event.chapter]: true }, progress: { ...context.progress, [event.chapter]: 100 } }) : {}),
    sound: assign(({ context }) => ({ sound: !context.sound })),
    motion: assign(({ context }) => ({ reducedMotion: !context.reducedMotion })),
    quality: assign(({ event }) => event.type === 'SET_QUALITY' ? ({ quality: event.quality }) : {}),
    reset: assign(() => ({ index: 0, completed: { ...emptyCompleted }, progress: { ...emptyProgress } }))
  }
}).createMachine({
  id: 'home31-story',
  initial: 'exploring',
  context: {
    index: 0,
    completed: emptyCompleted,
    progress: emptyProgress,
    sound: false,
    reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    quality: typeof window !== 'undefined' && window.innerWidth < 720 ? 'low' : 'high'
  },
  states: { exploring: { on: {
    NEXT: { actions: 'next' }, PREV: { actions: 'prev' }, GO: { actions: 'go' }, ACT: { actions: 'act' }, COMPLETE: { actions: 'complete' },
    TOGGLE_SOUND: { actions: 'sound' }, TOGGLE_MOTION: { actions: 'motion' }, SET_QUALITY: { actions: 'quality' }, RESET: { actions: 'reset' }
  }}}
});
