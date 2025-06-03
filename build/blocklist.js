// List of blocked words so no bad
const BLOCKED_TERMS = [
  "porn", "nazi", "drugs", "violence", "malware", "exploit"
];

function isBlocked(query) {
  const lowered = query.toLowerCase();
  return BLOCKED_TERMS.some(word => lowered.includes(word));
}
