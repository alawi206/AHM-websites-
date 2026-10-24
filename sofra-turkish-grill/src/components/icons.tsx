import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
  </Icon>
)

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </Icon>
)

export const Phone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.2 3.8h3l1.6 4.1-2 1.3a11 11 0 0 0 5 5l1.3-2 4.1 1.6v3a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 3.2 6a2 2 0 0 1 2-2.2Z" />
  </Icon>
)

export const MapPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Icon>
)

export const Clock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)

export const Mail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
    <path d="m4 6.5 8 6 8-6" />
  </Icon>
)

export const Instagram = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </Icon>
)

export const Calendar = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </Icon>
)

export const Bag = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1 12.5H6L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </Icon>
)

export const Search = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Icon>
)

export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

/** Filled five-point star used for review ratings. */
export const RatingStar = ({ size = 14, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...p}>
    <path
      fill="currentColor"
      d="m10 1.6 2.47 5.3 5.8.68-4.28 3.98 1.13 5.73L10 14.4l-5.12 2.9L6 11.56 1.73 7.58l5.8-.68L10 1.6Z"
    />
  </svg>
)

/** Eight-point star — the Rub el Hizb motif used throughout the brand. */
export function StarMotif({ size = 24, strokeWidth = 1, ...p }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      <rect x="8.3" y="8.3" width="23.4" height="23.4" />
      <rect x="8.3" y="8.3" width="23.4" height="23.4" transform="rotate(45 20 20)" />
      <circle cx="20" cy="20" r="4.2" />
    </svg>
  )
}
