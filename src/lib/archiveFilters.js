// src/lib/archiveFilters.js

// Convert either:
// { author: "X", tag: "flower", location: "Antwerp" }
// or { authors: ["X"], tags: ["flower"] }
// into consistent UI state.
export function presetToUiState(preset = {}) {
    const year = preset.year ? String(preset.year) : "All";
    const film = preset.film || "All";
    const scanner = preset.scanner || "All";
    const location = preset.location || "All";

    const authors = Array.isArray(preset.authors)
        ? preset.authors
        : preset.author
            ? [preset.author]
            : [];

    const tags = Array.isArray(preset.tags)
        ? preset.tags
        : preset.tag
            ? [preset.tag]
            : [];

    return { year, film, scanner, location, authors, tags };
}

// AND logic for tags: image must contain *all* selected tags.
export function imageMatchesUiFilters(img, ui) {
    const yearOk = ui.year === "All" || String(img.year) === String(ui.year);
    const filmOk = ui.film === "All" || img.film === ui.film;
    const scannerOk = ui.scanner === "All" || img.scanner === ui.scanner;
    const locationOk = ui.location === "All" || img.location === ui.location;

    const authorOk =
        !ui.authors?.length || ui.authors.includes(img.author);

    const tagsOk =
        !ui.tags?.length ||
        ui.tags.every(t => (img.tags || []).includes(t));

    return yearOk && filmOk && scannerOk && locationOk && authorOk && tagsOk;
}