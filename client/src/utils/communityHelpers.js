/* ─── Helpers for Community Area ─────────────────────────── */

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-rose-500", "bg-amber-500", "bg-cyan-500",
];

export function avatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function voteTier(count) {
  if (count <= 0)  return { label: "",              color: "text-gray-500",   bg: "bg-gray-100",   glow: "" };
  if (count < 10)  return { label: "Liked",         color: "text-rose-600",  bg: "bg-rose-100",   glow: "" };
  if (count < 50)  return { label: "Hot ✦",         color: "text-violet-600",bg: "bg-violet-100", glow: "shadow-violet-200" };
  return              { label: "Legendary ★",    color: "text-amber-500", bg: "bg-amber-100",  glow: "shadow-amber-200" };
}
