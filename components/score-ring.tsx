"use client"

interface ScoreRingProps {
  score: number
  size?: number
}

export function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 85
      ? "hsl(var(--accent))"
      : score >= 70
        ? "hsl(var(--primary))"
        : "hsl(var(--muted-foreground))"

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-lg font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground">{"分"}</span>
      </div>
    </div>
  )
}
