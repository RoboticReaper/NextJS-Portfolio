export function SystemsGraphic() {
  return (
    <svg
      className="systems-graphic"
      viewBox="0 0 440 400"
      role="img"
      aria-labelledby="systems-title"
    >
      <title id="systems-title">
        Connected paths between software, mathematics, and AI
      </title>
      <defs>
        <pattern
          id="systems-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.18" />
        </pattern>
      </defs>
      <rect
        x="10"
        y="10"
        width="420"
        height="380"
        rx="24"
        fill="url(#systems-grid)"
      />
      <g className="systems-paths" fill="none" stroke="currentColor">
        <ellipse
          cx="220"
          cy="200"
          rx="152"
          ry="90"
          transform="rotate(-30 220 200)"
        />
        <ellipse
          cx="220"
          cy="200"
          rx="152"
          ry="90"
          transform="rotate(30 220 200)"
        />
        <path
          d="M66 270C130 338 185 112 258 155S339 235 381 117"
          strokeWidth="2"
        />
        <path
          d="M75 134L220 200L355 292M220 200L282 90"
          strokeDasharray="4 6"
        />
      </g>
      <g className="systems-nodes">
        <circle cx="75" cy="134" r="7" />
        <circle cx="282" cy="90" r="7" />
        <circle cx="355" cy="292" r="7" />
        <circle className="systems-center" cx="220" cy="200" r="36" />
      </g>
      <g className="systems-labels">
        <text x="45" y="109">
          SOFTWARE
        </text>
        <text x="217" y="63">
          MATHEMATICS
        </text>
        <text x="344" y="326">
          AI
        </text>
      </g>
      <text className="systems-symbol" x="220" y="211" textAnchor="middle">
        ∑
      </text>
    </svg>
  );
}
