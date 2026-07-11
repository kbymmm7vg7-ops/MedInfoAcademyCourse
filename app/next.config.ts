import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dictionary-en v5 reads its .aff/.dic files via `new URL(..., import.meta.url)`;
  // bundling it breaks that resolution (fs receives a non-file URL) and the
  // evaluator's spell checker throws at runtime. Keep it external so Node
  // loads it from node_modules natively — same behavior as the tsx scripts.
  serverExternalPackages: ["dictionary-en"],
};

export default nextConfig;
