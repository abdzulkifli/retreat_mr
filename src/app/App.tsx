import { useMachine } from '@xstate/react';
import { storyMachine } from '../story/storyMachine';
import { chapters } from '../story/chapters';
import { ExperienceCanvas } from '../experience/ExperienceCanvas';
import { StoryPanel } from '../ui/StoryPanel';
import { Controls } from '../ui/Controls';

export function App() {
  const [state, send] = useMachine(storyMachine);
  const { index, progress, completed, sound, reducedMotion, quality } = state.context;
  const chapter = chapters[index];
  const act = () => send({ type: 'ACT', chapter: chapter.id, amount: chapter.id === 'retreat' ? 20 : chapter.id === 'city' ? 17 : 25 });
  const next = () => index === chapters.length - 1 ? send({ type: 'RESET' }) : send({ type: 'NEXT' });
  return <main className="app-shell">
    <div className="brand"><strong>HOME31</strong><span>The Journey of an Idea</span></div>
    <div className="canvas-zone" aria-hidden="true"><ExperienceCanvas index={index} progress={progress} reducedMotion={reducedMotion} quality={quality} /></div>
    <StoryPanel index={index} progress={progress[chapter.id]} completed={completed[chapter.id]} onAct={act} onNext={next} onPrev={() => send({ type: 'PREV' })} />
    <Controls index={index} sound={sound} reducedMotion={reducedMotion} quality={quality} onGo={(i:number)=>send({type:'GO',index:i})} onSound={()=>send({type:'TOGGLE_SOUND'})} onMotion={()=>send({type:'TOGGLE_MOTION'})} onQuality={(q:any)=>send({type:'SET_QUALITY',quality:q})} onReset={()=>send({type:'RESET'})} />
  </main>;
}
