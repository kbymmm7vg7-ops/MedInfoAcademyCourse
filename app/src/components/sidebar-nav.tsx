"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

export function SidebarNav({ showManagerNav }: { showManagerNav: boolean }) {
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => !item.managerOnly || showManagerNav);

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
