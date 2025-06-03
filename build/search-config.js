const BLOCKED_TERMS = ["nuke", "child", "darkweb", "ransom", "deepweb"];

function isBlocked(term) {
  return BLOCKED_TERMS.some(bad => term.toLowerCase().includes(bad));
}
