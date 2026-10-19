import { MapPin } from "lucide-react";

interface OriginMarqueeProps {
  origins: string[];
}

/** Infinite looping strip of sourcing origins — purely decorative texture under the hero. */
export function OriginMarquee({ origins }: OriginMarqueeProps) {
  const track = [...origins, ...origins];

  return (
    <div
      className="group relative overflow-hidden border-y border-white/10 bg-[#0a3338] py-4"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className="animate-marquee flex w-max items-center gap-10 group-hover:[animation-play-state:paused]">
        {track.map((origin, index) => (
          <span
            key={`${origin}-${index}`}
            className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-white/50 uppercase"
          >
            <MapPin className="h-3 w-3 text-[#6fc4bf]" />
            {origin}
          </span>
        ))}
      </div>
    </div>
  );
}
