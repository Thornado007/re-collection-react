// src/lib/archiveUrl.js

export function readArchiveStateFromUrl(search) {
    const sp = new URLSearchParams(search);

    const page = sp.get("page") || "home";

    return {
        page,
        year: sp.get("year") || "All",
        film: sp.get("film") || "All",
        scanner: sp.get("scanner") || "All",
        authors: sp.getAll("author"), // multi
        tags: sp.getAll("tag"),       // multi
        q: sp.get("q") || "",
        view: sp.get("view") || "grid",
    };
}

export function buildUrlSearch({
    page,
    year,
    film,
    scanner,
    authors,
    tags,
    q,
    view,
}) {
    // Home = clean URL (no query)
    if (!page || page === "home") return "";

    const sp = new URLSearchParams();
    sp.set("page", page);

    if (page === "archive") {
        if (year && year !== "All") sp.set("year", year);
        if (film && film !== "All") sp.set("film", film);
        if (scanner && scanner !== "All") sp.set("scanner", scanner);

        (authors || []).forEach(a => a && sp.append("author", a));
        (tags || []).forEach(t => t && sp.append("tag", t));

        if (q) sp.set("q", q);
        if (view && view !== "grid") sp.set("view", view);
    }

    const s = sp.toString();
    return s ? `?${s}` : "";
}