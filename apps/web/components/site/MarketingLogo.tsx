interface LogoMarkProps {
  className?: string;
  title?: string;
}

export function LogoMark({ className = "h-9 w-9", title = "Slabtrade" }: LogoMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <rect width="40" height="40" rx="12" fill="#0D5C63" />
      <path
        d="M8 26.5c3.2-6.8 7.4-10.2 12.6-10.2 3.4 0 5.7 1.6 5.7 4.1 0 2.7-2.2 4-5.8 5.1-4.4 1.4-7.2 3.1-7.2 6.2 0 3.3 3.1 5.3 7.6 5.3 4.1 0 7.5-1.5 10.1-3.9"
        stroke="#6FC4BF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 14.5c2.1-2.4 4.8-3.7 8-3.7 5.2 0 8.8 3 8.8 7.4"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="28.5" cy="12" r="2.2" fill="#6FC4BF" />
    </svg>
  );
}

interface BrandWordmarkProps {
  dark?: boolean;
  className?: string;
}

export function BrandWordmark({
  dark = false,
  className = "font-serif text-xl tracking-[-0.04em]",
}: BrandWordmarkProps) {
  return (
    <span className={className}>
      slab<span className={dark ? "text-[#6fc4bf]" : "text-[#0d5c63]"}>trade</span>
    </span>
  );
}
