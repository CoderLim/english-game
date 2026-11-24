export type RobotBodyPart = 'ear' | 'eye' | 'mouth' | 'hand' | 'arm';
const parts: { part: RobotBodyPart; label: string; className: string }[] = [
  { part: 'ear', label: '耳朵 ear', className: 'robot-hotspot--ear' },
  { part: 'eye', label: '眼睛 eye', className: 'robot-hotspot--eye' },
  { part: 'mouth', label: '嘴巴 mouth', className: 'robot-hotspot--mouth' },
  { part: 'arm', label: '手臂 arm', className: 'robot-hotspot--arm' },
  { part: 'hand', label: '手 hand', className: 'robot-hotspot--hand' },
];

export function RobotArt({ interactive = false, onSelect, selected }: { interactive?: boolean; onSelect?: (part: RobotBodyPart) => void; selected?: string }) {
  return (
    <div className={'robot-art ' + (interactive ? 'robot-art--interactive' : '')}>
      <svg viewBox="0 0 330 365" role="img" aria-label="有耳朵、眼睛、嘴巴、手和手臂的蓝色机器人">
        <ellipse cx="165" cy="345" rx="88" ry="12" fill="#1B6478" opacity=".14"/>
        <path d="M118 270 L109 330 M207 270 L220 330" stroke="#528A9E" strokeWidth="26" strokeLinecap="round"/>
        <ellipse cx="104" cy="331" rx="34" ry="15" fill="#376B81"/><ellipse cx="228" cy="331" rx="34" ry="15" fill="#376B81"/>
        <rect x="86" y="153" width="157" height="143" rx="42" fill="#76BED0" stroke="#417F99" strokeWidth="7"/>
        <rect x="114" y="183" width="100" height="65" rx="22" fill="#E8F6D5"/>
        <circle cx="164" cy="213" r="19" fill="#FFCC82"/><path d="M150 213h28M164 200v26" stroke="#E99A65" strokeWidth="6" strokeLinecap="round"/>
        <path d="M91 196 L47 237" stroke="#5F9EB3" strokeWidth="28" strokeLinecap="round"/>
        <path d="M237 196 L280 237" stroke="#5F9EB3" strokeWidth="28" strokeLinecap="round"/>
        <circle cx="39" cy="247" r="27" fill="#86C6D6" stroke="#43849D" strokeWidth="6"/>
        <circle cx="290" cy="247" r="27" fill="#86C6D6" stroke="#43849D" strokeWidth="6"/>
        <path d="M164 48 V30" stroke="#43849D" strokeWidth="9" strokeLinecap="round"/><circle cx="164" cy="25" r="13" fill="#FFE089" stroke="#DEAE62" strokeWidth="4"/>
        <rect x="53" y="59" width="224" height="142" rx="52" fill="#83C8D9" stroke="#427F98" strokeWidth="7"/>
        <rect x="42" y="108" width="21" height="49" rx="11" fill="#F3B66D" stroke="#427F98" strokeWidth="4"/>
        <rect x="267" y="108" width="21" height="49" rx="11" fill="#F3B66D" stroke="#427F98" strokeWidth="4"/>
        <rect x="77" y="82" width="175" height="91" rx="34" fill="#EAF8EB"/>
        <ellipse cx="126" cy="125" rx="15" ry="21" fill="#2E647B"/><ellipse cx="207" cy="125" rx="15" ry="21" fill="#2E647B"/>
        <circle cx="129" cy="116" r="5" fill="white"/><circle cx="210" cy="116" r="5" fill="white"/>
        <path d="M142 150 Q165 173 190 150" stroke="#B27870" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <circle cx="94" cy="153" r="9" fill="#F1AEAE" opacity=".7"/><circle cx="238" cy="153" r="9" fill="#F1AEAE" opacity=".7"/>
      </svg>
      {interactive && parts.map((p) => (
        <button
          key={p.part}
          type="button"
          className={'robot-hotspot ' + p.className + (selected === p.part ? ' is-selected' : '')}
          aria-label={'点击' + p.label}
          title={p.label}
          onClick={() => onSelect?.(p.part)}
        ><span className="sr-only">{p.label}</span></button>
      ))}
    </div>
  );
}
