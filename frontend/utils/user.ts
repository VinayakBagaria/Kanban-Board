const colors = [
  "#FFB900",
  "#D83B01",
  "#B50E0E",
  "#E81123",
  "#B4009E",
  "#5C2D91",
  "#0078D7",
  "#00B4FF",
  "#008272",
  "#107C10",
];

// Convert string to a deterministic number
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getUserColor(username: string) {
  const hash = hashCode(username);
  return colors[hash % colors.length];
}

export function getInitials(fullName: string) {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/); // split by any whitespace
  const first = parts[0][0].toUpperCase();
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";

  return first + last;
}
