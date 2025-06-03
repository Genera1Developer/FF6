const BLOCKED_TERMS = {
  porn: [
    "porn", "sex", "xxx", "nude", "hentai", "nsfw", "onlyfans", "erotic", "fetish", "bdsm", "milf", "teen", "pussy", "dick", "cock", "boobs", "anal", "cum", "blowjob", "orgy", "gangbang", "naked", "bondage", "fuck", "rape"
  ],
  gore: [
    "gore", "blood", "dismember", "decapitate", "snuff", "mutilate", "disembowel", "exsanguinate", "carcass", "torture", "behead", "massacre", "cannibal", "crucify", "impale", "hang", "strangle", "dismemberment", "death", "murder", "kill"
  ],
  drugs: [
    "cocaine", "meth", "heroin", "lsd", "ecstasy", "fentanyl", "weed", "marijuana", "cannabis", "opioid", "opioids", "amphetamine", "crack", "pcp", "shrooms", "acid", "hashish", "ketamine", "drug", "crack"
  ],
  illegal: [
    "child", "cp", "torrent", "dark web", "silk road", "hack tool", "piracy", "counterfeit", "fraud", "phishing", "scam", "weapon", "gun", "firearm", "bomb", "explosive", "drug dealer", "gun", "tor", "illegal", "child", "conterfeit", "hack", "toolkit", "warez"
  ],
  violence: [
    "kill", "murder", "rape", "assault", "torture", "shoot", "stab", "beat", "abuse", "slaughter", "lynch", "terrorist", "terrorism", "mass shooting", "genocide", "war", "battle", "crime", "fight", "violence", "blood", "homocide", "suicide", "die", "genocide", "massacre", "shoot", "shooting"
  ],
  malware: [
    "malware", "exploit", "keylogger", "rat", "trojan", "virus", "worm", "spyware", "ransomware", "backdoor", "botnet", "ddos", "phishing", "rootkit"
  ],
  hate: [
    "nazi", "racist", "kkk", "white power", "hate crime", "supremacist", "antisemitic", "homophobic", "xenophobic", "islamophobe", "bigot", "terrorist", "neo-nazi", "white nationalist"
  ]
};

function isBlocked(query) {
  const lowered = query.toLowerCase();
  return Object.values(BLOCKED_TERMS).flat().some(term => lowered.includes(term));
}
