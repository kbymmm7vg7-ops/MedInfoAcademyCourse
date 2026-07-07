import Link from "next/link";

// NAVIGATION PRINCIPLE: the case is always the anchor. This button is a
// persistent shortcut back into the active case, available from anywhere in
// the shell. Stubbed to /simulator until "active case" state exists.
export function ResumeCaseButton() {
  return (
    <Link
      href="/simulator"
      className="flex items-center justify-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
    >
      Resume active case
    </Link>
  );
}
