const ENGINES = [
  {
    name: "Google",
    url: q => `https://www.google.com/webhp?igu=1&hl=en&gl=us&q=${encodeURIComponent(q)}`,
    parser: doc => {
      const cards = [];
      const results = doc.querySelectorAll("a");
      results.forEach(link => {
        const href = link.href;
        const title = link.textContent.trim();
        if (href.startsWith("http") && title.length > 10 && !href.includes("/search?")) {
          cards.push({
            title: title,
            href: href,
            desc: "",
            source: "From Google"
          });
        }
      });
      return cards;
    }
  },
  {
    name: "DuckDuckGo",
    url: q => `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    parser: doc => [...doc.querySelectorAll(".result__title a")]
      .map(link => ({
        title: link.textContent,
        href: link.href,
        desc: link.closest(".result")?.querySelector(".result__snippet")?.textContent || "",
        source: "From DuckDuckGo"
      }))
  },
  {
    name: "Brave",
    url: q => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    parser: doc => [...doc.querySelectorAll("a")]
      .filter(a => a.href.startsWith("http") && a.textContent.length > 10)
      .map(link => ({
        title: link.textContent,
        href: link.href,
        desc: "",
        source: "From Brave"
      }))
  }
];
