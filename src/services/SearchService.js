// FastAPI backend (port 5002)
const FASTAPI = "http://localhost:5002/api";

const SearchService = {
  semanticSearch: (query, top_k = 10) =>
    fetch(`${FASTAPI}/search/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k }),
    }).then((r) => r.json()),

  weakInSubject: (subject, threshold = 50) =>
    fetch(`${FASTAPI}/search/weak-in-subject?subject=${encodeURIComponent(subject)}&threshold=${threshold}`)
      .then((r) => r.json()),

  topPerformers: (semester = "", limit = 10) =>
    fetch(`${FASTAPI}/search/top-performers?semester=${encodeURIComponent(semester)}&limit=${limit}`)
      .then((r) => r.json()),

  getSuggestions: () =>
    fetch(`${FASTAPI}/search/suggestions`).then((r) => r.json()),

  syncEmbeddings: (records) =>
    fetch(`${FASTAPI}/embeddings/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    }).then((r) => r.json()),

  embeddingCount: () =>
    fetch(`${FASTAPI}/embeddings/count`).then((r) => r.json()),
};

export default SearchService;
