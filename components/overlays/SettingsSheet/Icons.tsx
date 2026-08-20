import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LanguageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
    </svg>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function RadiusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="5" strokeOpacity="0.7" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.75" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function RainCardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Nuvem */}
      <path d="M4 14.8A5 5 0 0 1 7.8 7 6 6 0 0 1 18 9.2 4 4 0 0 1 18 17H7.5" />
      {/* Gotas de Chuva */}
      <path d="M8 19v2" />
      <path d="M12 19v2" />
      <path d="M16 19v2" />
    </svg>
  );
}