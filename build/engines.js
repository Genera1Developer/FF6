const ENGINES = [
  {
    name: "DuckDuckGo",
    url: q => `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    parser: doc => [...doc.querySelectorAll(".result__url")]
      .map(link => ({
        title: link.closest(".result")?.querySelector(".result__title")?.textContent || link.href,
        href: link.href,
        desc: link.closest(".result")?.querySelector(".result__snippet")?.textContent || "",
        source: "DuckDuckGo"
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
        source: "Brave"
      }))
  }
];
