export function IsometricCity({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cta-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f26a1b" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#f26a1b" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#f26a1b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="line-fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f26a1b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f26a1b" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background radial ambient glow */}
      <ellipse cx="500" cy="380" rx="380" ry="240" fill="url(#cta-glow)" />

      {/* Isometric Grid Floor */}
      <g stroke="#f26a1b" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 4">
        {/* Isometric grid lines angled left-down and right-down */}
        <line x1="120" y1="460" x2="620" y2="170" />
        <line x1="180" y1="495" x2="680" y2="205" />
        <line x1="240" y1="530" x2="740" y2="240" />
        <line x1="300" y1="565" x2="800" y2="275" />
        <line x1="360" y1="600" x2="860" y2="310" />

        <line x1="320" y1="180" x2="820" y2="470" />
        <line x1="260" y1="215" x2="760" y2="505" />
        <line x1="200" y1="250" x2="700" y2="540" />
        <line x1="140" y1="285" x2="640" y2="575" />
        <line x1="80" y1="320" x2="580" y2="610" />
      </g>

      {/* Grid Floor intersection nodes / pulses */}
      <g fill="#f26a1b">
        <circle cx="440" cy="275" r="3" fillOpacity="0.7" />
        <circle cx="560" cy="345" r="3.5" fillOpacity="0.8" />
        <circle cx="680" cy="415" r="2.5" fillOpacity="0.5" />
        <circle cx="320" cy="345" r="3" fillOpacity="0.6" />
        <circle cx="500" cy="450" r="3" fillOpacity="0.7" />
        <circle cx="620" cy="520" r="2" fillOpacity="0.5" />
        <circle cx="260" cy="485" r="2.5" fillOpacity="0.4" />
        <circle cx="380" cy="555" r="2" fillOpacity="0.5" />

        {/* Small floating data cubes */}
        <path d="M 690 260 L 702 253 L 714 260 L 702 267 Z" fill="#f26a1b" fillOpacity="0.7" />
        <path d="M 690 260 L 690 274 L 702 281 L 702 267 Z" fill="#c9510d" fillOpacity="0.6" />
        <path d="M 702 267 L 702 281 L 714 274 L 714 260 Z" fill="#f26a1b" fillOpacity="0.4" />

        <path d="M 230 380 L 240 374 L 250 380 L 240 386 Z" fill="#f26a1b" fillOpacity="0.6" />
        <path d="M 230 380 L 230 392 L 240 398 L 240 386 Z" fill="#c9510d" fillOpacity="0.5" />
        <path d="M 240 386 L 240 398 L 250 392 L 250 380 Z" fill="#f26a1b" fillOpacity="0.3" />

        <path d="M 780 430 L 790 424 L 800 430 L 790 436 Z" fill="#f26a1b" fillOpacity="0.7" />
        <path d="M 780 430 L 780 442 L 790 448 L 790 436 Z" fill="#c9510d" fillOpacity="0.6" />
        <path d="M 790 436 L 790 448 L 800 442 L 800 430 Z" fill="#f26a1b" fillOpacity="0.4" />
      </g>

      {/* Main Isometric Tower / Building 1 (Center High-Rise) */}
      <g stroke="#f26a1b" strokeWidth="1.75" strokeLinejoin="round">
        {/* Roof */}
        <polygon
          points="460,90 530,50 600,90 530,130"
          fill="#1c120c"
          stroke="#f26a1b"
          strokeWidth="2"
        />
        {/* Roof Mechanical penthouse */}
        <polygon
          points="510,75 530,63 550,75 530,87"
          fill="#271810"
          stroke="#f26a1b"
          strokeWidth="1.2"
        />
        <line x1="510" y1="75" x2="510" y2="85" />
        <line x1="530" y1="87" x2="530" y2="97" />
        <line x1="550" y1="75" x2="550" y2="85" />
        <polygon points="510,85 530,97 550,85 530,73" fill="none" />

        {/* Antenna / Spire on top */}
        <line x1="530" y1="63" x2="530" y2="15" stroke="#f26a1b" strokeWidth="2" />
        <circle cx="530" cy="15" r="3" fill="#f26a1b" />
        <line x1="530" y1="30" x2="540" y2="35" strokeWidth="1" />
        <line x1="530" y1="40" x2="518" y2="46" strokeWidth="1" />

        {/* Left Facade */}
        <polygon
          points="460,90 530,130 530,450 460,410"
          fill="#160e09"
          fillOpacity="0.95"
        />
        {/* Left Windows / Floor levels */}
        {[130, 160, 190, 220, 250, 280, 310, 340, 370, 400, 430].map((y, i) => (
          <g key={`l-fl-${i}`}>
            <line x1="460" y1={y - 40} x2="530" y2={y} strokeOpacity="0.4" strokeWidth="1" />
            <line x1="475" y1={y - 25} x2="515" y2={y - 2} strokeOpacity="0.8" strokeWidth="1.5" />
            <line x1="485" y1={y - 19} x2="485" y2={y + 5} strokeOpacity="0.4" strokeWidth="0.8" />
            <line x1="505" y1={y - 8} x2="505" y2={y + 16} strokeOpacity="0.4" strokeWidth="0.8" />
          </g>
        ))}

        {/* Right Facade */}
        <polygon
          points="530,130 600,90 600,410 530,450"
          fill="#24150d"
          fillOpacity="0.95"
        />
        {/* Right Windows / Floor levels */}
        {[130, 160, 190, 220, 250, 280, 310, 340, 370, 400, 430].map((y, i) => (
          <g key={`r-fl-${i}`}>
            <line x1="530" y1={y} x2="600" y2={y - 40} strokeOpacity="0.4" strokeWidth="1" />
            <line x1="545" y1={y - 2} x2="585" y2={y - 25} strokeOpacity="0.8" strokeWidth="1.5" />
            <line x1="555" y1={y + 4} x2="555" y2={y - 20} strokeOpacity="0.4" strokeWidth="0.8" />
            <line x1="575" y1={y - 8} x2="575" y2={y - 32} strokeOpacity="0.4" strokeWidth="0.8" />
          </g>
        ))}
      </g>

      {/* Building 2 (Left Mid-Rise Complex / Logistics) */}
      <g stroke="#f26a1b" strokeWidth="1.5" strokeLinejoin="round">
        <polygon
          points="310,240 390,195 460,235 380,280"
          fill="#1f130b"
          strokeWidth="1.8"
        />
        {/* Left facade */}
        <polygon points="310,240 380,280 380,480 310,440" fill="#140c07" />
        {/* Right facade */}
        <polygon points="380,280 460,235 460,435 380,480" fill="#22140d" />

        {/* Architectural louvers / grids */}
        {[270, 305, 340, 375, 410, 445].map((y, i) => (
          <g key={`b2-fl-${i}`}>
            <line x1="310" y1={y - 40} x2="380" y2={y} strokeOpacity="0.5" strokeWidth="1" />
            <line x1="380" y1={y} x2="460" y2={y - 45} strokeOpacity="0.5" strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* Building 3 (Right Stepped Podium & Glass Pavilion) */}
      <g stroke="#f26a1b" strokeWidth="1.5" strokeLinejoin="round">
        <polygon
          points="600,210 680,165 740,200 660,245"
          fill="#1c110a"
          strokeWidth="1.8"
        />
        {/* Left facade */}
        <polygon points="600,210 660,245 660,470 600,435" fill="#160e08" />
        {/* Right facade */}
        <polygon points="660,245 740,200 740,425 660,470" fill="#25160e" />

        {/* Structural X-Bracing */}
        <line x1="600" y1="210" x2="660" y2="280" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="600" y1="280" x2="660" y2="210" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="600" y1="280" x2="660" y2="350" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="600" y1="350" x2="660" y2="280" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="600" y1="350" x2="660" y2="420" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="600" y1="420" x2="660" y2="350" strokeOpacity="0.6" strokeDasharray="2 3" />

        <line x1="660" y1="245" x2="740" y2="315" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="660" y1="315" x2="740" y2="245" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="660" y1="315" x2="740" y2="385" strokeOpacity="0.6" strokeDasharray="2 3" />
        <line x1="660" y1="385" x2="740" y2="315" strokeOpacity="0.6" strokeDasharray="2 3" />
      </g>

      {/* Construction Tower Crane (Rising above the city) */}
      <g stroke="#f26a1b" strokeWidth="1.5" strokeLinecap="round">
        {/* Crane vertical mast */}
        <line x1="400" y1="60" x2="400" y2="240" strokeWidth="2.5" />
        <line x1="412" y1="53" x2="412" y2="233" strokeWidth="2.5" />
        {/* Lattice lacings on mast */}
        {[70, 95, 120, 145, 170, 195, 220].map((y, i) => (
          <g key={`crane-${i}`}>
            <line x1="400" y1={y} x2="412" y2={y - 7} strokeWidth="1" strokeOpacity="0.7" />
            <line x1="400" y1={y} x2="412" y2={y + 18} strokeWidth="1" strokeOpacity="0.7" />
          </g>
        ))}

        {/* Crane operator cabin & turntable */}
        <polygon points="395,50 415,38 425,44 405,56" fill="#f26a1b" fillOpacity="0.3" strokeWidth="1.5" />

        {/* Crane Jib (Long boom extending right) */}
        <line x1="330" y1="95" x2="490" y2="0" strokeWidth="2" />
        <line x1="407" y1="45" x2="490" y2="0" strokeWidth="1.5" />
        {/* Counter-jib (Extending left with counterweight) */}
        <line x1="407" y1="45" x2="330" y2="90" strokeWidth="2" />
        {/* Counterweight block */}
        <polygon points="330,85 350,73 350,95 330,107" fill="#f26a1b" strokeWidth="1.5" />

        {/* Tie rods / pendants */}
        <line x1="407" y1="18" x2="490" y2="0" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="407" y1="18" x2="335" y2="85" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="407" y1="18" x2="407" y2="45" strokeWidth="2" />

        {/* Hoist cable & hook holding a structural beam */}
        <line x1="465" y1="15" x2="465" y2="80" stroke="#f26a1b" strokeWidth="1" strokeDasharray="2 2" />
        {/* Suspended steel I-beam */}
        <line x1="445" y1="88" x2="485" y2="65" stroke="#f26a1b" strokeWidth="3.5" />
      </g>

      {/* Foreground Shipping Containers / Modular Blocks (Like the port/logistics in reference) */}
      <g stroke="#f26a1b" strokeWidth="1.4" strokeLinejoin="round">
        {/* Container 1 (Orange accented) */}
        <polygon points="460,480 500,457 530,474 490,497" fill="#f26a1b" fillOpacity="0.25" />
        <polygon points="460,480 490,497 490,530 460,513" fill="#1f130b" />
        <polygon points="490,497 530,474 530,507 490,530" fill="#2c1a10" />
        {/* Corrugated ribs */}
        <line x1="498" y1="493" x2="498" y2="526" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="506" y1="488" x2="506" y2="521" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="514" y1="483" x2="514" y2="516" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="522" y1="479" x2="522" y2="512" strokeOpacity="0.6" strokeWidth="1" />

        {/* Container 2 (Stacked on top) */}
        <polygon points="460,447 500,424 530,441 490,464" fill="#f26a1b" fillOpacity="0.35" />
        <polygon points="460,447 490,464 490,497 460,480" fill="#24150d" />
        <polygon points="490,464 530,441 530,474 490,497" fill="#351f13" />

        {/* Container 3 (Beside) */}
        <polygon points="535,438 575,415 605,432 565,455" fill="#f26a1b" fillOpacity="0.2" />
        <polygon points="535,438 565,455 565,488 535,471" fill="#180f09" />
        <polygon points="565,455 605,432 605,465 565,488" fill="#24160e" />

        {/* Container 4 */}
        <polygon points="535,471 575,448 605,465 565,488" fill="#f26a1b" fillOpacity="0.15" />
        <polygon points="535,471 565,488 565,521 535,504" fill="#180f09" />
        <polygon points="565,488 605,465 605,498 565,521" fill="#24160e" />
      </g>

      {/* Decorative Technical UI Annotation Marks & Corner Brackets */}
      <g stroke="#f26a1b" strokeWidth="1" opacity="0.6">
        {/* Top-Right technical target mark */}
        <circle cx="820" cy="80" r="14" fill="none" strokeDasharray="3 3" />
        <circle cx="820" cy="80" r="4" fill="#f26a1b" />
        <line x1="795" y1="80" x2="845" y2="80" />
        <line x1="820" y1="55" x2="820" y2="105" />

        {/* Data readout text */}
        <text x="760" y="115" fill="#f26a1b" fontSize="9" fontFamily="monospace" letterSpacing="1">
          SYS.CAD // 05°40&apos;N 00°10&apos;W
        </text>
        <text x="760" y="128" fill="#f26a1b" fontSize="8" fontFamily="monospace" opacity="0.7">
          GHANA REAL ESTATE &amp; INFRASTRUCTURE
        </text>

        {/* Isometric axes compass in corner */}
        <path d="M 120 120 L 120 70 M 120 120 L 165 95 M 120 120 L 75 95" strokeWidth="1.5" />
        <text x="116" y="60" fill="#f26a1b" fontSize="10" fontFamily="monospace">Z</text>
        <text x="172" y="98" fill="#f26a1b" fontSize="10" fontFamily="monospace">Y</text>
        <text x="60" y="98" fill="#f26a1b" fontSize="10" fontFamily="monospace">X</text>
      </g>
    </svg>
  );
}
