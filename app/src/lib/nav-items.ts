export type NavItem = {
  label: string;
  href: string;
  managerOnly?: boolean;
  adminOnly?: boolean;
};

// PRD §4 information architecture. Nav visibility is cosmetic — /admin/* is
// actually protected by the server-side role check in (app)/admin/layout.tsx.
export const NAV_ITEMS: NavItem[] = [
  { label: "Home / My Queue", href: "/" },
  { label: "Training & Orientation", href: "/training" },
  { label: "Case Simulator", href: "/simulator" },
  { label: "Case History", href: "/history" },
  { label: "Learning Path", href: "/learning-path" },
  { label: "Accreditation Center", href: "/accreditation" },
  { label: "Manager Dashboard", href: "/manager", managerOnly: true },
  { label: "Admin", href: "/admin", adminOnly: true },
  { label: "Settings", href: "/settings" },
];
