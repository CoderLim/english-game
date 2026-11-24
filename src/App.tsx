import { useEffect, useRef, useState } from 'react';
import { selectEnglishVoice } from './engine/speech';
import { knowledgePoints, missions, pointMap, textbook, units } from './content/unit1';
import { ForestLandscape, FoxIllustration } from './components/ForestArt';
import { RobotArt, type RobotBodyPart } from './components/RobotArt';
import { completeMission, createEmptyState, getDueEntries, getReviewQueue, loadState, persistState, recordAttempt } from './engine/review';
import type { Challenge, GameState, Mission, Skill } from './engine/types';

type Page = 'map' | 'worlds' | 'lesson' | 'review' | 'parent' | 'finish';
type Feedback = { correct: boolean; chosen: string; independent: boolean };
const skillLabels: Record<Skill, string> = { listening: '听力', recognition: '词汇识别', reading: '阅读', speaking: '口语自评' };
const futureMissions = [
  { id: 'letters', index: 3, title: '字母石门', subtitle: 'Aa–Dd · 字母与发音', emoji: '🔤' },
  { id: 'sharing', index: 4, title: '玩具分享日', subtitle: '分享 · 礼貌表达', emoji: '🧸' },
  { id: 'good-friend', index: 5, title: '谁是好朋友？', subtitle: '友好行为 · 阅读', emoji: '💌' },
  { id: 'festival', index: 6, title: '友谊庆典', subtitle: '综合冒险任务', emoji: '🎉' },
];
function Character({ kind, interactive = false, onSelect, selected }: {
  kind: 'fox' | 'robot'; interactive?: boolean; onSelect?: (part: RobotBodyPart) => void; selected?: string;
}) {
  return kind === 'fox' ? <FoxIllustration /> : <RobotArt interactive={interactive} onSelect={onSelect} selected={selected} />;
}
function SpeakButton({ text, onUnavailable }: { text: string; onUnavailable: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const refreshVoice = () => setVoiceName(selectEnglishVoice(synth.getVoices())?.name ?? null);
    refreshVoice();
    synth.addEventListener?.('voiceschanged', refreshVoice);
    return () => {
      synth.removeEventListener?.('voiceschanged', refreshVoice);
      activeUtterance.current = null;
      synth.cancel();
    };
  }, []);

  function play(slow: boolean) {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      onUnavailable();
      return;
    }
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = selectEnglishVoice(synth.getVoices());
      if (voice) {
        utterance.voice = voice;
        setVoiceName(voice.name);
      }
      utterance.lang = voice?.lang ?? 'en-US';
      utterance.rate = slow ? 0.7 : 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      activeUtterance.current = utterance;
      utterance.onstart = () => {
        if (activeUtterance.current === utterance) setPlaying(true);
      };
      utterance.onend = () => {
        if (activeUtterance.current === utterance) setPlaying(false);
      };
      utterance.onerror = (event) => {
        if (activeUtterance.current !== utterance) return;
        setPlaying(false);
        if (event.error !== 'canceled' && event.error !== 'interrupted') onUnavailable();
      };
      synth.cancel();
      synth.speak(utterance);
    } catch {
      setPlaying(false);
      onUnavailable();
    }
  }

  return (
    <div className="audio-controls">
      <button type="button" className="speak-button" onClick={() => play(false)} aria-label="正常速度播放英语">
        🔊 {playing ? '重新播放英语' : '播放英语'}
      </button>
      <button type="button" className="speak-button speak-button--slow" onClick={() => play(true)} aria-label="慢速播放英语">
        🐢 慢速重听
      </button>
      <span className="audio-voice-note">{voiceName ? '系统英语语音' : '使用系统语音'} · 听不清可以点“看文字提示”</span>
    </div>
  );
}
function ChallengeView({ challenge, mission, feedback, revealed, transcript, onAnswer, onSelfGrade, onReveal, onTranscript, onNext }: {
  challenge: Challenge; mission: Mission | null; feedback: Feedback | null; revealed: boolean; transcript: boolean;
  onAnswer: (answer: string) => void; onSelfGrade: (correct: boolean, independent: boolean) => void;
  onReveal: () => void; onTranscript: () => void; onNext: () => void;
}) {
  const isListening = challenge.skill === 'listening' && Boolean(challenge.spoken);
  const answerText = challenge.mode === 'choice'
    ? (challenge.options?.find((option) => option.id === challenge.correctAnswer)?.label ?? challenge.correctAnswer)
    : challenge.correctAnswer;
  return (
    <>
      <span className="eyebrow">{skillLabels[challenge.skill]} · {challenge.mode === 'self-recall' ? '主动回忆' : '情境挑战'}</span>
      <h1>{challenge.title}</h1>
      <p className="lesson-subtitle">{challenge.instruction}</p>
      {challenge.mode !== 'robot-tap' && (
        <div className="story-scene">
          <ForestLandscape>
            <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center', height: '100%' }}>
              <Character kind={mission?.character ?? (challenge.pointId.includes('body') ? 'robot' : 'fox')} />
            </div>
          </ForestLandscape>
          {challenge.mode !== 'self-recall' && <div className="story-bubble">{isListening ? '🔊 Tap to listen!' : 'Ready for the quest?'}</div>}
        </div>
      )}
      {challenge.spoken && <SpeakButton key={challenge.id} text={challenge.spoken} onUnavailable={onTranscript} />}
      {isListening && !transcript && !feedback && <button type="button" className="btn btn-outline btn-small" style={{ marginLeft: 10 }} onClick={onTranscript}>看文字提示</button>}
      <div className="question-card" aria-live="polite">
        <strong>{isListening && !transcript && !feedback ? '先听语音，再完成任务 🎧' : challenge.prompt}</strong>
        <small>{isListening && !transcript && !feedback ? '听力题默认隐藏英文文字；需要时可使用提示。' : '想一想，再作答。'}</small>
      </div>
      {challenge.mode === 'choice' && (
        <div className="options">
          {challenge.options?.map((option) => {
            const chosen = feedback?.chosen === option.id;
            const correct = feedback && option.id === challenge.correctAnswer;
            return (
              <button key={option.id} type="button" disabled={Boolean(feedback)}
                className={'option' + (chosen && !feedback?.correct ? ' is-wrong' : '') + (correct ? ' is-correct' : '')}
                onClick={() => onAnswer(option.id)}>
                <span>{option.label}</span>
                <span className="answer-tag">{correct ? '✓' : chosen ? '↻' : '○'}</span>
              </button>
            );
          })}
        </div>
      )}
      {challenge.mode === 'robot-tap' && (
        <div className="robot-activity">
          <span className="robot-instruction">点击 Robo 的身体部位 ✨</span>
          <RobotArt interactive={!feedback} onSelect={(part) => { if (!feedback) onAnswer(part); }} selected={feedback?.chosen} />
        </div>
      )}
      {challenge.mode === 'self-recall' && (
        <>
          <div className="recall-prompt"><strong>🎤 先自己大声说出答案</strong><p className="hint">不用开启麦克风，也不收集你的声音。</p></div>
          {!revealed ? <button type="button" className="btn btn-soft" onClick={onReveal}>我已经说好了 · 看参考答案</button> : (
            <div className="recall-answer">
              <strong>{answerText}</strong>
              <p>请根据自己刚才的表现选择，而不是看答案后再尝试。</p>
              {!feedback && <div className="recall-actions">
                <button className="btn btn-primary" onClick={() => onSelfGrade(true, true)}>✓ 我独立说对了</button>
                <button className="btn btn-light" onClick={() => onSelfGrade(true, false)}>看提示才会</button>
                <button className="btn btn-outline" onClick={() => onSelfGrade(false, false)}>还不会</button>
              </div>}
            </div>
          )}
        </>
      )}
      {feedback && (
        <div className={'feedback ' + (!feedback.correct ? 'is-wrong' : '')} role="status">
          <span style={{ fontSize: 24 }}>{feedback.correct && feedback.independent ? '🌟' : '💡'}</span>
          <div>
            <strong>{feedback.correct && feedback.independent ? '做得好！独立完成！' : feedback.correct ? '完成练习！下次再试着独立回答。' : '没关系，我们下次再练！'}</strong>
            <span>{challenge.explanation}</span>
            {!feedback.correct && <div style={{ marginTop: 5 }}>正确答案：{answerText}</div>}
            {transcript && challenge.mode !== 'self-recall' && <div style={{ marginTop: 5 }}>这次使用了文字提示，不计入独立掌握。</div>}
          </div>
        </div>
      )}
      {feedback && <div className="lesson-footer"><button type="button" className="btn btn-primary" onClick={onNext}>继续冒险 →</button></div>}
    </>
  );
}

function MapPage({ game, onStart, onResume, onReview, onWorlds }: {
  game: GameState; onStart: (id: string) => void; onResume: () => void; onReview: () => void; onWorlds: () => void;
}) {
  const due = getDueEntries(game);
  const completed = game.completedMissions.length;
  const covered = Object.keys(game.entries).length;
  return (
    <>
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow">✦ English Adventure · Unit 01</div>
          <h1>欢迎来到<br/>友谊森林！</h1>
          <p>认识新朋友，帮助小机器人，在每一次探索中学会一点点英语。</p>
          <button className="btn btn-primary" onClick={game.session ? onResume : () => onStart('meet-fox')}>{game.session ? '▶ 继续上次冒险' : '🌱 开始森林冒险'} <span>→</span></button>
        </div>
        <div className="hero-forest"><ForestLandscape /></div>
        <FoxIllustration />
        <style>{'.hero > .fox-illustration{position:absolute;right:8%;bottom:-16px;width:225px;z-index:1;filter:drop-shadow(0 14px 10px #315d492b)}@media(max-width:650px){.hero > .fox-illustration{width:145px;right:-1%;bottom:-10px}}'}</style>
      </div>
      <div className="below-hero">
        <section className="status-card">
          <div className="status-title"><h2>🗺️ 冒险地图</h2><button className="btn btn-outline btn-small" onClick={onWorlds}>查看全册世界 →</button></div>
          <p className="hint">点击地图上的角色，开启对应的英语任务。</p>
          <div className="world-map">
            <ForestLandscape>
              <button className={'map-point mission-1' + (game.completedMissions.includes('meet-fox') ? ' done' : '')} onClick={() => onStart('meet-fox')}>
                <span>🦊</span><span><strong>森林里的新朋友</strong><small>{game.completedMissions.includes('meet-fox') ? '✓ 已探索' : '第 1 关 · 可进入'}</small></span>
              </button>
              <button className={'map-point mission-2' + (game.completedMissions.includes('help-robot') ? ' done' : '')} onClick={() => onStart('help-robot')}>
                <span>🤖</span><span><strong>机器人需要帮助</strong><small>{game.completedMissions.includes('help-robot') ? '✓ 已探索' : '第 2 关 · 可进入'}</small></span>
              </button>
              <div className="map-sign">🌼 更多探险区域即将开放</div>
            </ForestLandscape>
          </div>
        </section>
        <aside className="status-card">
          <div className="status-title"><h2>✨ 今天的学习</h2><span>你的成长日记</span></div>
          <div className="learning-snapshot">
            <div><div className="snapshot-number">{completed}<span style={{ fontSize: 18, color: '#91ad9e' }}>/ 2</span></div><div className="hint">已探索的开放关卡</div></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: (completed / 2 * 100) + '%' }} /></div>
            <div className="snapshot-stats">
              <div className="mini-stat"><strong>{covered}</strong><small>已练习的能力点</small></div>
              <div className="mini-stat"><strong>{due.length}</strong><small>今天到期的复习</small></div>
            </div>
            <div style={{ background: '#f3faf0', padding: 17, borderRadius: 17 }}>
              <strong style={{ fontSize: 14 }}>🧠 记得更牢的小秘诀</strong>
              <p className="hint" style={{ margin: '8px 0 0' }}>每天少量练习，隔几天再回忆一次，比反复刷同一道题更有帮助。</p>
            </div>
            <button className="btn btn-soft" onClick={onReview} disabled={due.length === 0}>{due.length ? '开始今日复习 · ' + due.length + ' 题 →' : '今天没有到期复习 ✓'}</button>
          </div>
        </aside>
      </div>
      <div className="section-header"><h2>本单元冒险任务</h2><p>Unit 1 · Making friends · 六个关卡规划中</p></div>
      <div className="missions-grid">
        {missions.map((mission) => (
          <button key={mission.id} className="mission-card" onClick={() => onStart(mission.id)}>
            <div className={'mission-card-art ' + mission.character}><Character kind={mission.character} /></div>
            <div className="mission-card-inner"><h3>{mission.index.toString().padStart(2, '0')} · {mission.title}</h3><p>{mission.subtitle}</p>
              <div className="mission-card-foot"><span className="chip chip-green">{game.completedMissions.includes(mission.id) ? '✓ 已完成' : '可以玩'}</span><span>→</span></div>
            </div>
          </button>
        ))}
        {futureMissions.map((mission) => (
          <div className="mission-card" key={mission.id} aria-label={mission.title + '尚未开放'}>
            <div className="mission-card-art locked"><span className="big-emoji">{mission.emoji}</span></div>
            <div className="mission-card-inner"><h3>{mission.index.toString().padStart(2, '0')} · {mission.title}</h3><p>{mission.subtitle}</p>
              <div className="mission-card-foot"><span className="chip">🔒 尚未开放</span></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
function WorldsPage({ onBack }: { onBack: () => void }) {
  const icons = ['🌳','🏘️','🦁','🌷','🌈','🔢','🏰'];
  return <><div className="page-head"><div><span className="eyebrow">Textbook Journey</span><h1>我的英语冒险世界</h1><p>严格区分已上线内容与课程规划，不会将未完成的单元展示为可玩。</p></div><button className="btn btn-light" onClick={onBack}>← 返回森林</button></div>
    <div className="world-grid">{units.map((unit, i) => <div key={unit.id} className={'world-tile ' + (!unit.available ? 'locked' : '')}><span style={{ fontSize: 38 }}>{icons[i]}</span><h3>{unit.number === 7 ? 'Revision' : 'Unit ' + unit.number} · {unit.name}</h3><p>{unit.world} · {unit.available ? '前两关开放' : '课程规划中'}</p><div style={{ marginTop: 12 }}><span className={'chip ' + (unit.available ? 'chip-green' : '')}>{unit.available ? '已开放部分任务' : '🔒 尚未开放'}</span></div></div>)}</div>
  </>;
}
function ParentPage({ game, onReset }: { game: GameState; onReset: () => void }) {
  const entries = Object.values(game.entries);
  const dueCount = getDueEntries(game).length;
  const independent = game.attempts.filter((a) => a.correct && a.independent).length;
  const groups: Skill[] = ['listening','recognition','reading','speaking'];
  return <><div className="page-head"><div><span className="eyebrow">For Parents · Learning Journal</span><h1>家长学习报告</h1><p>{textbook.displayName} · {textbook.grade} · Unit 1</p></div></div>
    <div className="notice">🔐 隐私说明：本 MVP 没有账号和服务器。仅将答题及复习数据保存到当前浏览器的 localStorage；没有上传孩子的真实姓名、照片或语音。</div>
    <div className="parent-grid">
      <div className="parent-stat"><span>已完成关卡</span><strong>{game.completedMissions.length} / 2</strong></div>
      <div className="parent-stat"><span>已练习的知识 × 能力组合</span><strong>{entries.length}</strong></div>
      <div className="parent-stat"><span>待复习</span><strong>{dueCount}</strong></div>
    </div>
    <section className="status-card"><div className="status-title"><h2>📚 学习轨迹</h2><span>共 {game.attempts.length} 条本地作答记录</span></div>
      <p className="hint">独立答对 {independent} 次；同一天重复答对不会当作跨天复习。下表仅展示练习状态，不代表标准化语言能力评估。</p>
      {entries.length === 0 ? <div className="empty-state">还没有练习记录。先和小狐狸打个招呼吧！</div> :
        <div className="table-wrap"><table><thead><tr><th>知识点</th><th>练习能力</th><th>独立回忆次数</th><th>阶段</th><th>下次复习</th></tr></thead><tbody>
          {entries.sort((a,b)=>a.pointId.localeCompare(b.pointId)).map((entry) => (
            <tr key={entry.key}><td>{pointMap[entry.pointId]?.english ?? entry.pointId}</td><td>{skillLabels[entry.skill]}</td><td>{entry.independentSuccesses}</td><td><span className={'chip ' + (entry.status === 'consolidated' ? 'chip-green' : '')}>{entry.status === 'consolidated' ? '阶段性巩固' : entry.status === 'reviewing' ? '正在复习' : '需要多练'}</span></td><td>{new Date(entry.dueAt).toLocaleDateString('zh-CN')}</td></tr>
          ))}
        </tbody></table></div>}
    </section>
    <div className="section-header"><h2>能力维度</h2></div>
    <div className="world-grid" style={{ marginBottom: 24 }}>
      {groups.map((skill) => { const set = entries.filter((entry)=>entry.skill===skill);return <div className="world-tile" key={skill}><div className="eyebrow">{skillLabels[skill]}</div><h3 style={{ fontSize: 27, color: '#2e8660' }}>{set.length}</h3><p>已练习的能力点</p>{skill === 'speaking' && <p style={{ marginTop: 8 }}>口语结果来自孩子自评，不是自动发音测评。</p>}</div>; })}
    </div>
    <section className="status-card"><div className="status-title"><h2>🧩 教材覆盖情况</h2><span>Unit 1</span></div><p className="hint">目前内容库包含 {knowledgePoints.length} 个知识点（含原创拓展），只开放了两关。其他知识点仍在开发，不能将“通关两关”标记为“完成整个单元”。</p>
      <div className="progress-track" style={{ margin: '18px 0 10px' }}><div className="progress-fill" style={{ width: (new Set(game.attempts.map((a)=>a.pointId)).size / knowledgePoints.length * 100) + '%' }}/></div>
      <span className="hint">本机已接触 {new Set(game.attempts.map((a)=>a.pointId)).size} / {knowledgePoints.length} 个已收录知识点</span>
    </section>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 22, flexWrap: 'wrap' }}>
      <a href={textbook.officialCatalog} target="_blank" rel="noreferrer" className="btn btn-light">查看教材官方目录 ↗</a>
      <button className="btn btn-outline btn-small" onClick={onReset}>清除本机学习记录</button>
    </div>
  </>;
}
export default function App() {
  const [game, setGame] = useState<GameState>(loadState);
  const [page, setPage] = useState<Page>('map');
  const [intro, setIntro] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [reviewDeck, setReviewDeck] = useState<Challenge[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [finishedMission, setFinishedMission] = useState<Mission | null>(null);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => { setStorageError(!persistState(game)); }, [game]);

  const mission = missions.find((m)=>m.id===game.session?.missionId) ?? null;
  const step = game.session?.step ?? 0;
  const question = page === 'lesson' ? mission?.challenges[step] : page === 'review' ? reviewDeck[reviewIndex] : undefined;
  const progress = page === 'lesson' ? (mission ? step + 1 : 0) : reviewIndex + 1;
  const total = page === 'lesson' ? (mission?.challenges.length ?? 0) : reviewDeck.length;

  function goTo(pageNext: Page) {
    window.speechSynthesis?.cancel();
    setPage(pageNext);
    setFeedback(null); setRevealed(false); setTranscript(false);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  }
  function startMission(id: string) {
    if (!missions.some((m) => m.id === id)) return;
    setGame((s) => ({ ...s, session: { missionId: id, step: 0 } }));
    setIntro(true);
    goTo('lesson');
  }
  function resumeMission() {
    if (!mission) { startMission('meet-fox'); return; }
    setIntro(false);goTo('lesson');
  }
  function startReview() {
    const queue = getReviewQueue(game).slice(0, 8);
    if (!queue.length) return;
    setReviewDeck(queue);
    setReviewIndex(0);
    setIntro(false);
    goTo('review');
  }
  function submit(correct: boolean, independent: boolean, chosen: string) {
    if (!question || feedback) return;
    // Opening the transcript is assistance even if the final selection was right.
    const isIndependent = independent && !transcript;
    setGame((s)=>recordAttempt(s, {
      challengeId: question.id, pointId: question.pointId, skill: question.skill,
      correct, independent: correct && isIndependent,
      missionId: page === 'lesson' ? mission?.id ?? null : null,
    }));
    setFeedback({ correct, independent: correct && isIndependent, chosen });
  }
  function answer(id: string) {
    if (!question || feedback) return;
    submit(id === question.correctAnswer, id === question.correctAnswer, id);
  }
  function nextQuestion() {
    setFeedback(null);setTranscript(false);setRevealed(false);
    if (page === 'lesson' && mission) {
      if (step + 1 < mission.challenges.length) {
        setGame((s)=>({...s,session:{missionId:mission.id,step:step+1}}));
      } else {
        setGame((s)=>completeMission(s,mission.id));
        setFinishedMission(mission);
        goTo('finish');
      }
    } else if (page === 'review') {
      if (reviewIndex + 1 < reviewDeck.length) setReviewIndex((i)=>i+1);
      else goTo('map');
    }
  }
  function resetProgress() {
    if (!window.confirm('确定要清除本机的所有英语学习记录吗？此操作无法撤销。')) return;
    setGame(createEmptyState());setFinishedMission(null);goTo('map');
  }
  return <div className="app">
    <header className="app-header">
      <button className="brand" onClick={()=>goTo('map')} aria-label="返回友谊森林首页"><span className="brand-logo">🌿</span><span><strong>English Adventure</strong><small>Learn, play, grow</small></span></button>
      <nav className="nav" aria-label="主要导航">
        <button className={page === 'map' || page === 'lesson' || page === 'finish' ? 'active' : ''} onClick={()=>goTo('map')}><span className="nav-emoji">🗺️</span>冒险地图</button>
        <button className={page === 'worlds' ? 'active' : ''} onClick={()=>goTo('worlds')}><span className="nav-emoji">🌏</span>课程世界</button>
        <button className={page === 'review' ? 'active' : ''} onClick={startReview} disabled={getReviewQueue(game).length === 0}><span className="nav-emoji">✨</span>今日复习 ({getDueEntries(game).length})</button>
        <button className={page === 'parent' ? 'active' : ''} onClick={()=>goTo('parent')}><span className="nav-emoji">📊</span>家长报告</button>
      </nav>
      <div className="header-right"><span className="unit-chip">📖 PEP 三上 · Unit 1</span></div>
    </header>
    <main>
      {storageError && <div className="notice" role="alert">⚠️ 当前浏览器无法保存本地进度。可以继续练习，但刷新后学习记录可能丢失。</div>}
      {page === 'map' && <MapPage game={game} onStart={startMission} onResume={resumeMission} onReview={startReview} onWorlds={()=>goTo('worlds')} />}
      {page === 'worlds' && <WorldsPage onBack={()=>goTo('map')} />}
      {page === 'parent' && <ParentPage game={game} onReset={resetProgress} />}
      {page === 'finish' && finishedMission && <div className="finish-card"><div className="celebrate">🏆</div><span className="eyebrow">Mission Completed</span><h1>冒险任务完成！</h1><p>{finishedMission.celebration}</p><p className="hint">你今天独立记住的知识会在后面的日子里再次出现。通关不等于永远不会忘记，记得回来复习哦。</p><button className="btn btn-primary" onClick={()=>goTo('map')}>返回冒险地图 →</button></div>}
      {page === 'lesson' && mission && (intro ? <div className="intro-card">
        <span className="eyebrow">Mission {String(mission.index).padStart(2,'0')} · {mission.zone}</span>
        <h1>{mission.title}</h1><p>{mission.introduction}</p>
        <div className="intro-illustration"><ForestLandscape><div style={{ display:'flex', justifyContent:'center',alignItems:'end',height:'100%' }}><Character kind={mission.character} /></div></ForestLandscape></div>
        <strong style={{ color:'#327f5b' }}>“{mission.introductionEnglish}”</strong>
        <div className="intro-footer"><span className="hint">本关 {mission.challenges.length} 个小挑战 · 约 5 分钟</span><button className="btn btn-primary" onClick={()=>setIntro(false)}>出发，开始任务！ →</button></div>
      </div> : <div className="lesson-shell">
        <div className="lesson-main">
          <div className="lesson-toolbar"><button className="btn btn-light btn-small" onClick={()=>goTo('map')}>← 暂时离开</button><span className="lesson-step">{mission.title} · {progress} / {total}</span></div>
          <div className="lesson-progress"><span style={{ width:(progress/total*100)+'%' }}/></div>
          <div className="lesson-panel">{question && <ChallengeView key={question.id} challenge={question} mission={mission} feedback={feedback} revealed={revealed} transcript={transcript} onAnswer={answer} onSelfGrade={(correct,independent)=>submit(correct,independent,independent?'independent':'assisted')} onReveal={()=>setRevealed(true)} onTranscript={()=>setTranscript(true)} onNext={nextQuestion}/>}</div>
        </div>
        <aside className="lesson-aside"><h3>🌱 你的冒险伙伴</h3><div className="lesson-character"><Character kind={mission.character}/></div><p className="tip-box">把英语真正听懂、说出来，比一口气做完所有题目更重要。答错没有关系，学习系统会安排稍后再练。</p><span className="chip chip-green">⏱ 建议每次 10–15 分钟</span></aside>
      </div>)}
      {page === 'review' && question && <div className="lesson-shell">
        <div className="lesson-main">
          <div className="lesson-toolbar"><button className="btn btn-light btn-small" onClick={()=>goTo('map')}>← 返回地图</button><span className="lesson-step">间隔复习 · {progress} / {total}</span></div>
          <div className="lesson-progress"><span style={{ width:(progress/total*100)+'%' }}/></div>
          <div className="lesson-panel">
            <ChallengeView key={question.id} challenge={question} mission={null} feedback={feedback} revealed={revealed} transcript={transcript} onAnswer={answer} onSelfGrade={(correct,independent)=>submit(correct,independent,independent?'independent':'assisted')} onReveal={()=>setRevealed(true)} onTranscript={()=>setTranscript(true)} onNext={nextQuestion}/>
          </div>
        </div>
        <aside className="lesson-aside"><h3>🧠 复习小贴士</h3><div className="lesson-character"><Character kind={question.pointId.includes('body') ? 'robot' : 'fox'}/></div><p className="tip-box">这次的题目和第一次学时不一样。先尝试自己回忆，需要帮助时可以看提示。提示后答对也很棒，但会在日后再练。</p></aside>
      </div>}
    </main>
    <footer className="footer">原创英语学习游戏 · 非人民教育出版社官方产品 · <a href={textbook.officialCatalog} target="_blank" rel="noreferrer">教材官方目录</a> · 学习数据仅保存在当前设备</footer>
  </div>;
}
