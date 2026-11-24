import type { ReactNode } from 'react';

export function ForestLandscape({ children, compact = false }: { children?: ReactNode; compact?: boolean }) {
  return (
    <div className={'landscape ' + (compact ? 'landscape--compact' : '')}>
      <svg aria-hidden="true" className="landscape-svg" viewBox="0 0 900 490" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#C6F1F1"/><stop offset="1" stopColor="#F6F9C9"/></linearGradient>
          <linearGradient id="hill" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#BCE6AD"/><stop offset="1" stopColor="#72BD90"/></linearGradient>
          <linearGradient id="frontHill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#72C08C"/><stop offset="1" stopColor="#449D6F"/></linearGradient>
        </defs>
        <rect width="900" height="490" fill="url(#sky)" />
        <circle cx="732" cy="85" r="49" fill="#FFE9A3"/><circle cx="732" cy="85" r="70" fill="#FFF2B4" opacity=".25"/>
        <g fill="#fff" opacity=".75"><ellipse cx="161" cy="92" rx="70" ry="21"/><circle cx="131" cy="79" r="25"/><circle cx="178" cy="74" r="29"/><ellipse cx="461" cy="109" rx="58" ry="17"/><circle cx="434" cy="100" r="21"/><circle cx="476" cy="100" r="24"/></g>
        <path d="M0 283 Q122 212 275 285 Q429 200 565 272 Q739 204 900 274 V490 H0Z" fill="#C8E9BB"/>
        <path d="M0 332 Q190 250 351 328 Q528 232 900 310 V490 H0Z" fill="url(#hill)"/>
        <path d="M0 401 Q246 286 425 360 Q628 310 900 378 V490 H0Z" fill="url(#frontHill)"/>
        <path d="M365 491 Q410 416 432 393 Q468 356 550 355 Q614 353 643 326" stroke="#F4DEA7" strokeWidth="69" fill="none" strokeLinecap="round"/>
        <path d="M365 491 Q410 416 432 393 Q468 356 550 355 Q614 353 643 326" stroke="#F9EBC3" strokeWidth="52" fill="none" strokeLinecap="round"/>
        <g>
          <path d="M70 325 v-97" stroke="#80674D" strokeWidth="16" strokeLinecap="round"/><circle cx="70" cy="198" r="59" fill="#4EA477"/><circle cx="39" cy="212" r="43" fill="#64B889"/><circle cx="103" cy="221" r="39" fill="#6CC590"/>
          <path d="M814 352 v-136" stroke="#80674D" strokeWidth="20" strokeLinecap="round"/><circle cx="811" cy="193" r="70" fill="#479C73"/><circle cx="775" cy="214" r="50" fill="#65B887"/><circle cx="848" cy="222" r="48" fill="#6BC28F"/>
          <path d="M230 331 v-64" stroke="#8C6A4B" strokeWidth="11" strokeLinecap="round"/><circle cx="229" cy="252" r="39" fill="#59AF81"/><circle cx="205" cy="264" r="27" fill="#79C995"/>
          <path d="M710 316 v-72" stroke="#8C6A4B" strokeWidth="12" strokeLinecap="round"/><circle cx="706" cy="228" r="44" fill="#55B282"/><circle cx="734" cy="242" r="27" fill="#70C490"/>
        </g>
        <g transform="translate(576 213)"><path d="M-55 72 V5 L0 -38 55 5 V72Z" fill="#F3BB7E"/><path d="M-67 9 L0 -52 69 9" fill="none" stroke="#895B57" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"/><rect x="-17" y="27" width="34" height="45" rx="15" fill="#855B51"/><circle cx="25" cy="41" r="3" fill="#FFDCA0"/><rect x="-44" y="12" width="17" height="21" rx="5" fill="#FFF4CC"/></g>
        <g fill="#F6FCED" opacity=".9"><circle cx="119" cy="368" r="5"/><circle cx="127" cy="378" r="4"/><circle cx="288" cy="414" r="4"/><circle cx="800" cy="405" r="4"/><circle cx="752" cy="375" r="5"/></g>
        <g fill="#FDD18D"><circle cx="117" cy="368" r="3"/><circle cx="288" cy="414" r="3"/><circle cx="752" cy="375" r="3"/></g>
        <g transform="translate(137 388)"><path d="M0 18v-25" stroke="#478F5D" strokeWidth="3"/><circle cy="-9" r="8" fill="#FFEC95"/><circle cx="-10" cy="-9" r="7" fill="#FFE5C6"/><circle cx="10" cy="-9" r="7" fill="#FFE5C6"/><circle cy="-19" r="7" fill="#FFE5C6"/><circle cy="1" r="7" fill="#FFE5C6"/></g>
        <g transform="translate(830 422)"><path d="M0 18v-25" stroke="#478F5D" strokeWidth="3"/><circle cy="-9" r="8" fill="#FFD56F"/><circle cx="-10" cy="-9" r="7" fill="#FFB6B8"/><circle cx="10" cy="-9" r="7" fill="#FFB6B8"/><circle cy="-19" r="7" fill="#FFB6B8"/><circle cy="1" r="7" fill="#FFB6B8"/></g>
      </svg>
      <div className="landscape-content">{children}</div>
    </div>
  );
}

export function FoxIllustration({ small = false }: { small?: boolean }) {
  return (
    <svg className={'fox-illustration ' + (small ? 'fox-illustration--small' : '')} viewBox="0 0 280 300" role="img" aria-label="戴着绿色围巾的友善小狐狸">
      <ellipse cx="141" cy="284" rx="83" ry="12" fill="#397958" opacity=".15"/>
      <path d="M171 198 Q266 164 247 244 Q224 274 174 249" fill="#F79D56" stroke="#C77244" strokeWidth="5"/>
      <path d="M222 223 Q246 233 247 246 Q225 271 188 252" fill="#FFF1CF"/>
      <ellipse cx="143" cy="220" rx="75" ry="70" fill="#EC9255"/>
      <ellipse cx="139" cy="237" rx="48" ry="41" fill="#FFE4C2"/>
      <path d="M93 254 Q63 254 59 273" stroke="#BB6A3C" strokeWidth="15" strokeLinecap="round"/>
      <path d="M187 254 Q218 252 224 274" stroke="#BB6A3C" strokeWidth="15" strokeLinecap="round"/>
      <path d="M108 154 L68 37 Q72 16 95 35 L128 93" fill="#D87949" stroke="#B96842" strokeWidth="6"/>
      <path d="M174 155 L208 34 Q228 17 231 41 L215 139" fill="#D87949" stroke="#B96842" strokeWidth="6"/>
      <path d="M101 108 L83 52 119 115 M191 109 L216 55 205 127" fill="#FFCCAF"/>
      <path d="M52 143 Q53 76 137 71 Q230 75 229 146 Q230 210 141 222 Q54 215 52 143Z" fill="#F49A55" stroke="#C87545" strokeWidth="4"/>
      <path d="M54 155 Q65 136 96 154 Q114 180 138 184 Q165 180 179 154 Q215 132 230 155 Q211 222 143 224 Q71 224 54 155" fill="#FFF0D8"/>
      <ellipse cx="103" cy="143" rx="8" ry="11" fill="#3C3937"/><ellipse cx="177" cy="143" rx="8" ry="11" fill="#3C3937"/>
      <circle cx="105" cy="139" r="3" fill="#fff"/><circle cx="179" cy="139" r="3" fill="#fff"/>
      <path d="M128 174 Q140 166 153 174 L142 184Z" fill="#563D3A"/>
      <path d="M140 184 Q130 198 119 187 M143 184 Q154 198 166 187" stroke="#8B5347" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="83" cy="174" rx="13" ry="8" fill="#F8B7A0" opacity=".6"/><ellipse cx="197" cy="174" rx="13" ry="8" fill="#F8B7A0" opacity=".6"/>
      <path d="M83 208 Q142 235 197 208 L184 240 Q143 254 98 240Z" fill="#4B987C"/>
      <path d="M135 232 L151 277 171 266 169 229" fill="#65B69D"/>
      <path d="M85 233 Q49 222 39 197" stroke="#F3A266" strokeWidth="18" strokeLinecap="round"/><circle cx="36" cy="192" r="13" fill="#F3A266"/>
    </svg>
  );
}
