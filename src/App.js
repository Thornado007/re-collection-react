import { useState, useRef, useEffect } from "react";
import imageData from "./data/images.json";
import BLOG_POSTS from "./posts";
import About from "./About";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

// Featured collections as presets over the archive
const COLLECTIONS = [
    {
        id: "Thor Vermin Portraits",
        title: "Thor Vermin: A Collection of Portraits",
        coverTone: "dark",
        coverRatio: "3/2",
        description: "A small collection of recent portraits",
        body:
            "These negatives sat in a folder marked only with a year. It took time to understand that the year was the subject.\n\nBy 1948, Adams had already refined his way of looking — but something in these frames still feels experimental, as if the landscape is testing him back.",
        filters: {
            author: "Thor Vermin",
            tags: ["portrait"]
        },
        imageIds: [
            "202502_R1_NikonFE_KodakGold200_Coolscan5000_13",
            "202503_R1_NikonF2_FujiNPC160_Coolscan5000_09",
            "202504_R2_NikonFM_KodakGold200_Coolscan5000_07"
        ]
    },
    {
        id: "Vermin Flowers",
        title: "Thor Vermin: A collection of Flowers",
        coverTone: "mid",
        coverRatio: "3/2",
        description: "Dorothea Lange's work from 1936 — a year that defined her.",
        body:
            "1936 is the year Lange’s images entered the public imagination. The pictures here orbit the edges of that history — familiar gestures in unfamiliar frames.\n\nI am interested in the way her attention settles: hands, fabric, the lines of a face that has been looking back for a long time.",
        filters: { author: "Thor Vermin", tag: "flower" },
        imageIds: [
            "202505_R1_NikonFM_KodakUltramax400_03",
            "202504_R1_NikonFM_FujiC200_Coolscan5000_01",
            "202504_R1_NikonFM_FujiC200_Coolscan5000_01"
        ]
    }
];

// Map images.json into archive items
const EXTRA = imageData.map(p => ({
    id: p.id,
    // Short label shown in UI (e.g. "202501")
    name: p.filename,
    year: String(p.year),
    film: p.filmType,
    scanner: p.scanningEquipment,
    author: p.artist,
    tags: p.tags || [],
    ratio: "3/2",
    tone: "mid",
    // Actual file path: uses the full id as the filename
    src: `/images/${p.id}.jpg`,
    collection: null,
    collectionTitle: null
}));

const ALL_ARCHIVE = EXTRA;

// Pagination size for Archive "Load more"
const PAGE_SIZE = 45;

const uniq = k => [
    "All",
    ...Array.from(new Set(ALL_ARCHIVE.map(i => i[k]).filter(Boolean))).sort()
];

const YEARS = uniq("year");
const FILMS = uniq("film");
const SCANNERS = uniq("scanner");
const AUTHORS = uniq("author");
const TAGS = [
    "All",
    ...Array.from(new Set(ALL_ARCHIVE.flatMap(i => i.tags || [])))
].sort();

/* ─────────────────────────────────────────────
   THUMBNAIL
───────────────────────────────────────────── */

function Thumb({ tone, ratio, src, alt }) {
    const bg =
        { dark: "#1a1a1a", mid: "#808080", light: "#c8c8c8" }[tone] || "#999";

    const baseStyle = {
        width: "100%",
        display: "block",
        background: bg
    };

    if (!src) {
        return (
            <div
                style={{
                    ...baseStyle,
                    aspectRatio: ratio || "3/2"
                }}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt || ""}
            style={{
                ...baseStyle,
                height: "auto",
                objectFit: "contain"
            }}
            loading="lazy"
            decoding="async"
        />
    );
}

/* ─────────────────────────────────────────────
   LIGHTBOX — bigger, stable height, tags
───────────────────────────────────────────── */

function Lightbox({ items, index, onClose, setIndex }) {
    const img = items[index];
    const hasPrev = index > 0;
    const hasNext = index < items.length - 1;

    useEffect(() => {
        const fn = e => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && hasNext) setIndex(i => i + 1);
            if (e.key === "ArrowLeft" && hasPrev) setIndex(i => i - 1);
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [index, items.length, hasNext, hasPrev, onClose, setIndex]);

    const meta = [
        ["Year", img.year],
        ["Film", img.film],
        ["Scanner", img.scanner],
        ["Author", img.author],
        Array.isArray(img.tags) && img.tags.length > 0 && [
            "Tags",
            img.tags.join(", ")
        ],
        img.collectionTitle && ["Collection", img.collectionTitle]
    ].filter(Boolean);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                background: "rgba(10,10,10,0.97)",
                overflowY: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "40px 16px 80px"
            }}
        >
            {/* Close button pinned to viewport, not over the image */}
            <button className="lb-close-btn" onClick={onClose}>
                Close ✕
            </button>

            <div
                onClick={e => e.stopPropagation()}
                style={{ width: "100%", maxWidth: "1024px", position: "relative" }}
            >
                {/* Image area: fixed min-height so layout doesn't jump */}
                <div
                    style={{
                        width: "100%",
                        marginTop: "16px",
                        marginBottom: "20px"
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            minHeight: "80vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {img.src ? (
                            <img src={img.src} alt={img.name} className="lb-img" />
                        ) : (
                            <div
                                style={{
                                    width: "auto",
                                    height: "80vh",
                                    background:
                                        { dark: "#1a1a1a", mid: "#808080", light: "#c8c8c8" }[
                                        img.tone
                                        ] || "#999",
                                    aspectRatio: "3/2"
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Prev / Next */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    <button
                        onClick={() => setIndex(i => i - 1)}
                        disabled={!hasPrev}
                        style={{
                            flex: 1,
                            padding: "10px 0",
                            fontFamily: "var(--sans)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            border: "1px solid rgba(255,255,255,0.4)",
                            borderRadius: "999px",
                            background: "transparent",
                            color: hasPrev
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(255,255,255,0.3)",
                            cursor: hasPrev ? "pointer" : "default"
                        }}
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => setIndex(i => i + 1)}
                        disabled={!hasNext}
                        style={{
                            flex: 1,
                            padding: "10px 0",
                            fontFamily: "var(--sans)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            border: "1px solid rgba(255,255,255,0.4)",
                            borderRadius: "999px",
                            background: "transparent",
                            color: hasNext
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(255,255,255,0.3)",
                            cursor: hasNext ? "pointer" : "default"
                        }}
                    >
                        Next →
                    </button>
                </div>

                {/* Title */}
                <h2
                    style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 700,
                        fontSize: "1.4rem",
                        color: "white",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        marginBottom: "12px"
                    }}
                >
                    {img.name}
                </h2>

                {/* Metadata */}
                {meta.length > 0 && (
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "40px",
                            borderTop: "1px solid rgba(255,255,255,0.2)"
                        }}
                    >
                        {meta.map(([k, v]) => (
                            <div key={k} style={{ marginBottom: "12px" }}>
                                <div
                                    style={{
                                        fontFamily: "var(--mono)",
                                        fontSize: "0.6rem",
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.6)",
                                        marginBottom: "2px"
                                    }}
                                >
                                    {k}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--sans)",
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
                                        color: "rgba(255,255,255,0.95)"
                                    }}
                                >
                                    {v}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   DROPDOWN (single-select)
───────────────────────────────────────────── */

function Dropdown({ label, options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const fn = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const active = value !== "All";
    const display = active ? value : label;

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    padding: "8px 14px",
                    border: "1.5px solid",
                    borderRadius: "10px",
                    borderColor: active ? "var(--black)" : "var(--border)",
                    background: active ? "var(--black)" : "white",
                    color: active ? "white" : "#555",
                    cursor: "pointer",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s"
                }}
            >
                {display}
                <span style={{ fontSize: "0.5rem", opacity: 0.5, marginTop: "1px" }}>
                    {open ? "▲" : "▼"}
                </span>
            </button>
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        zIndex: 300,
                        background: "white",
                        border: "1.5px solid var(--border)",
                        borderRadius: "12px",
                        minWidth: "160px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        overflow: "hidden"
                    }}
                >
                    {options.map(opt => {
                        const sel = value === opt;
                        return (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setOpen(false);
                                }}
                                style={{
                                    padding: "10px 16px",
                                    fontFamily: "var(--sans)",
                                    fontSize: "0.78rem",
                                    fontWeight: sel ? 600 : 400,
                                    cursor: "pointer",
                                    background: sel ? "#f2f2f2" : "white",
                                    color: sel ? "var(--black)" : "#555"
                                }}
                                onMouseEnter={e => {
                                    if (!sel) e.currentTarget.style.background = "#f8f8f8";
                                }}
                                onMouseLeave={e => {
                                    if (!sel) e.currentTarget.style.background = "white";
                                }}
                            >
                                {opt}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   MULTI-DROPDOWN (Authors, Tags) with columns
───────────────────────────────────────────── */

function MultiDropdown({ label, options, values, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const fn = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const active = values.length > 0;

    let display = label;
    if (values.length === 1) display = values[0];
    else if (values.length === 2) display = `${values[0]}, ${values[1]}`;
    else if (values.length > 2) display = `${values.length} selected`;

    const toggleValue = val => {
        if (values.includes(val)) {
            onChange(values.filter(v => v !== val));
        } else {
            onChange([...values, val]);
        }
    };

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    fontFamily: "var(--sans)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    padding: "8px 14px",
                    border: "1.5px solid",
                    borderRadius: "10px",
                    borderColor: active ? "var(--black)" : "var(--border)",
                    background: active ? "var(--black)" : "white",
                    color: active ? "white" : "#555",
                    cursor: "pointer",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s"
                }}
            >
                {display}
                <span style={{ fontSize: "0.5rem", opacity: 0.5, marginTop: "1px" }}>
                    {open ? "▲" : "▼"}
                </span>
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        zIndex: 300,
                        background: "white",
                        border: "1.5px solid var(--border)",
                        borderRadius: "12px",
                        minWidth: "260px",
                        maxWidth: "480px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        overflow: "hidden"
                    }}
                >
                    {/* All */}
                    <div
                        onClick={() => onChange([])}
                        style={{
                            padding: "10px 16px",
                            fontFamily: "var(--sans)",
                            fontSize: "0.78rem",
                            fontWeight: values.length === 0 ? 600 : 400,
                            cursor: "pointer",
                            background: values.length === 0 ? "#f2f2f2" : "white",
                            color: values.length === 0 ? "var(--black)" : "#555",
                            borderBottom: "1px solid var(--border)"
                        }}
                    >
                        All
                    </div>

                    {/* Options in a grid with scroll */}
                    <div
                        style={{
                            maxHeight: "260px",
                            overflowY: "auto",
                            padding: "4px 0 6px",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                            columnGap: "4px"
                        }}
                    >
                        {options
                            .filter(opt => opt !== "All")
                            .map(opt => {
                                const checked = values.includes(opt);
                                return (
                                    <div
                                        key={opt}
                                        onClick={() => toggleValue(opt)}
                                        style={{
                                            padding: "6px 12px",
                                            fontFamily: "var(--sans)",
                                            fontSize: "0.78rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            background: "white",
                                            color: "#555"
                                        }}
                                        onMouseEnter={e =>
                                            (e.currentTarget.style.background = "#f8f8f8")
                                        }
                                        onMouseLeave={e =>
                                            (e.currentTarget.style.background = "white")
                                        }
                                    >
                                        <span
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "3px",
                                                border: "1px solid #ccc",
                                                background: checked ? "#111" : "white"
                                            }}
                                        />
                                        <span
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {opt}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */

export default function App() {
    const [page, setPage] = useState({ name: "home" });
    const [lb, setLb] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const [fYear, setFYear] = useState("All");
    const [fFilm, setFFilm] = useState("All");
    const [fScanner, setFScanner] = useState("All");
    const [fAuthors, setFAuthors] = useState([]); // multi-select
    const [fTags, setFTags] = useState([]); // multi-select
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const openLb = (items, i) => setLb({ items, index: i });
    const closeLb = () => setLb(null);

    const goToArchiveWithPreset = preset => {
        setFYear(preset?.year || "All");
        setFFilm(preset?.film || "All");
        setFScanner(preset?.scanner || "All");

        if (Array.isArray(preset?.authors)) {
            setFAuthors(preset.authors);
        } else if (preset?.author) {
            setFAuthors([preset.author]);
        } else {
            setFAuthors([]);
        }

        if (Array.isArray(preset?.tags)) {
            setFTags(preset.tags);
        } else if (preset?.tag) {
            setFTags([preset.tag]);
        } else {
            setFTags([]);
        }

        setSearch("");
        setPage({ name: "archive" });
    };

    const clearFilters = () => {
        setFYear("All");
        setFFilm("All");
        setFScanner("All");
        setFAuthors([]);
        setFTags([]);
        setSearch("");
    };

    const hasFilters =
        fYear !== "All" ||
        fFilm !== "All" ||
        fScanner !== "All" ||
        fAuthors.length > 0 ||
        fTags.length > 0 ||
        search;

    // Updated search: checks title, year, film, scanner, author, tags
    const filtered = ALL_ARCHIVE.filter(img => {
        const matchesFilters =
            (fYear === "All" || img.year === fYear) &&
            (fFilm === "All" || img.film === fFilm) &&
            (fScanner === "All" || img.scanner === fScanner) &&
            (fAuthors.length === 0 || fAuthors.includes(img.author)) &&
            (fTags.length === 0 ||
                (img.tags || []).some(tag => fTags.includes(tag)));

        if (!matchesFilters) return false;

        if (!search) return true;

        const q = search.toLowerCase();
        return (
            (img.name && img.name.toLowerCase().includes(q)) ||
            (img.year && String(img.year).toLowerCase().includes(q)) ||
            (img.film && img.film.toLowerCase().includes(q)) ||
            (img.scanner && img.scanner.toLowerCase().includes(q)) ||
            (img.author && img.author.toLowerCase().includes(q)) ||
            (img.tags || []).some(tag => tag.toLowerCase().includes(q))
        );
    });

    const navTo = name => {
        setPage({ name });
        setMenuOpen(false);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black:  #111;
          --off:    #f5f5f5;
          --border: #e2e2e2;
          --gray:   #888;
          --white:  #fff;
          --sans:   'Sora', sans-serif;
          --mono:   'DM Mono', monospace;
          --r:      14px;
          --rs:     10px;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--white); color: var(--black); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

        @keyframes up  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fin { from { opacity:0; } to { opacity:1; } }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        * { -webkit-tap-highlight-color: transparent; }

        .desktop-nav     { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 600px) {
          .desktop-nav     { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        .col-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }

        .archive-grid { columns: 3; column-gap: 10px; }
        @media (max-width: 800px) { .archive-grid { columns: 2; } }
        @media (max-width: 400px) { .archive-grid { columns: 1; } }

        .list-row    { display: grid; grid-template-columns: 48px 1fr 64px 130px 160px 110px; min-height: 48px; }
        .list-header { display: grid; grid-template-columns: 48px 1fr 64px 130px 160px 110px; }
        @media (max-width: 720px) {
          .list-row    { gridTemplateColumns: 48px 1fr 60px; }
          .list-header { gridTemplateColumns: 48px 1fr 60px; }
          .list-hide   { display: none !important; }
        }
        @media (max-width: 420px) {
          .list-row    { grid-template-columns: 48px 1fr; }
          .list-header { display: none; }
          .list-hide   { display: none !important; }
          .list-year   { display: none !important; }
        }

        /* Lightbox image sizing: big but stable height for all orientations */
        .lb-img {
          display: block;
          max-width: 100%;
          max-height: 80vh;
          width: auto;
          height: auto;
        }

        /* Lightbox close button pinned to viewport */
        .lb-close-btn {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 2100;
          background: rgba(0,0,0,0.75);
          color: white;
          border: none;
          border-radius: 999px;
          padding: 6px 10px;
          font-family: var(--sans);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
        }
        .lb-close-btn:hover {
          background: rgba(0,0,0,0.9);
        }
      `}</style>

            {/* NAV */}
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 500,
                    height: "60px",
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(14px)",
                    borderBottom: "1px solid var(--border)"
                }}
            >
                <div
                    onClick={() => navTo("home")}
                    style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        letterSpacing: "-0.02em",
                        cursor: "pointer"
                    }}
                >
                    Re—collection
                </div>
                <div className="desktop-nav" style={{ gap: "4px" }}>
                    {[
                        ["home", "Home"],
                        ["archive", "Archive"],
                        ["blog", "Notes"],
                        ["about", "About"]
                    ].map(([n, l]) => (
                        <button
                            key={n}
                            onClick={() => navTo(n)}
                            style={{
                                fontFamily: "var(--sans)",
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                padding: "7px 16px",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                background: page.name === n ? "var(--black)" : "transparent",
                                color: page.name === n ? "white" : "var(--gray)"
                            }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(o => !o)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px",
                        color: "var(--black)",
                        fontSize: "1.2rem",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </nav>

            {menuOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "60px",
                        left: 0,
                        right: 0,
                        zIndex: 400,
                        background: "white",
                        borderBottom: "1px solid var(--border)",
                        padding: "8px 16px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px"
                    }}
                >
                    {[
                        ["home", "Home"],
                        ["archive", "Archive"],
                        ["blog", "Notes"],
                        ["about", "About"]
                    ].map(([n, l]) => (
                        <button
                            key={n}
                            onClick={() => navTo(n)}
                            style={{
                                fontFamily: "var(--sans)",
                                fontSize: "0.9rem",
                                fontWeight: page.name === n ? 600 : 400,
                                padding: "13px 16px",
                                border: "none",
                                borderRadius: "var(--rs)",
                                cursor: "pointer",
                                background: page.name === n ? "var(--off)" : "transparent",
                                color: page.name === n ? "var(--black)" : "var(--gray)",
                                textAlign: "left"
                            }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            )}

            <main style={{ paddingTop: "60px", minHeight: "100vh" }}>
                {page.name === "home" && <Home setPage={setPage} />}
                {page.name === "archive" && (
                    <Archive
                        filtered={filtered}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        fYear={fYear}
                        setFYear={setFYear}
                        fFilm={fFilm}
                        setFFilm={setFFilm}
                        fScanner={fScanner}
                        setFScanner={setFScanner}
                        fAuthors={fAuthors}
                        setFAuthors={setFAuthors}
                        fTags={fTags}
                        setFTags={setFTags}
                        search={search}
                        setSearch={setSearch}
                        hasFilters={hasFilters}
                        clearFilters={clearFilters}
                        openLb={openLb}
                    />
                )}
                {page.name === "blog" && <Blog setPage={setPage} />}
                {page.name === "about" && <About />}
                {page.name === "collection" && (
                    <CollectionDetail
                        col={page.data}
                        setPage={setPage}
                        openLb={openLb}
                        goToArchiveWithPreset={goToArchiveWithPreset}
                    />
                )}
                {page.name === "post" && (
                    <PostDetail post={page.data} setPage={setPage} openLb={openLb} />
                )}
            </main>

            <Footer />

            {lb && (
                <Lightbox
                    items={lb.items}
                    index={lb.index}
                    onClose={closeLb}
                    setIndex={fn => setLb(l => ({ ...l, index: fn(l.index) }))}
                />
            )}
        </>
    );
}

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */

function Home({ setPage }) {
    return (
        <div
            style={{
                maxWidth: "820px",
                margin: "0 auto",
                padding: "48px 20px 100px",
                animation: "up 0.4s ease"
            }}
        >
            {/* Intro */}
            <div style={{ marginBottom: "52px" }}>
                <p
                    style={{
                        fontSize: "0.78rem",
                        fontWeight: 400,
                        color: "var(--gray)",
                        letterSpacing: "0.01em",
                        marginBottom: "10px"
                    }}
                >
                    Analog Photography Archive
                </p>
                <h1
                    style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 700,
                        fontSize: "clamp(2.2rem, 8vw, 3.4rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                        marginBottom: "14px"
                    }}
                >
                    Re—collection
                </h1>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "var(--gray)",
                        lineHeight: 1.75,
                        maxWidth: "440px",
                        fontWeight: 300
                    }}
                >
                    A personal archive of scanned analog photographs — collected,
                    catalogued, and given back to the light.
                </p>
            </div>

            {/* Featured Collections */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "16px"
                }}
            >
                <span
                    style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--black)"
                    }}
                >
                    Collections
                </span>
                <button
                    onClick={() => setPage({ name: "archive" })}
                    style={{
                        fontFamily: "var(--sans)",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        background: "none",
                        border: "none",
                        color: "var(--gray)",
                        cursor: "pointer",
                        padding: 0
                    }}
                >
                    Browse archive
                </button>
            </div>

            <div className="col-grid" style={{ marginBottom: "56px" }}>
                {COLLECTIONS.map((col, i) => {
                    const count = ALL_ARCHIVE.filter(
                        img =>
                            (!col.filters.year || img.year === col.filters.year) &&
                            (!col.filters.author || img.author === col.filters.author) &&
                            (!col.filters.film || img.film === col.filters.film) &&
                            (!col.filters.tag || (img.tags || []).includes(col.filters.tag))
                    ).length;

                    return (
                        <CollectionThumb
                            key={col.id}
                            col={{ ...col, count }}
                            index={i}
                            onClick={() => setPage({ name: "collection", data: col })}
                        />
                    );
                })}
            </div>

            {/* Recent Notes */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "16px"
                }}
            >
                <span
                    style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--black)"
                    }}
                >
                    Notes
                </span>
                <button
                    onClick={() => setPage({ name: "blog" })}
                    style={{
                        fontFamily: "var(--sans)",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        background: "none",
                        border: "none",
                        color: "var(--gray)",
                        cursor: "pointer",
                        padding: 0
                    }}
                >
                    All notes
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {BLOG_POSTS.map(p => (
                    <BlogCard
                        key={p.id}
                        post={p}
                        onClick={() => setPage({ name: "post", data: p })}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   COLLECTION THUMBNAIL
───────────────────────────────────────────── */

function CollectionThumb({ col, index, onClick }) {
    const [hov, setHov] = useState(false);
    const bg =
        { dark: "#1a1a1a", mid: "#808080", light: "#c8c8c8" }[col.coverTone];

    const coverImageId =
        col.coverImageId || (col.imageIds && col.imageIds[0]) || null;
    const coverImage = coverImageId
        ? ALL_ARCHIVE.find(img => img.id === coverImageId)
        : null;
    const coverSrc = coverImage?.src;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                aspectRatio: col.coverRatio || "4/3",
                background: bg,
                animation: `up 0.4s ease ${index * 0.07}s both`
            }}
        >
            {coverSrc ? (
                <img
                    src={coverSrc}
                    alt={col.title}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: hov ? "scale(1.03)" : "scale(1)",
                        transition: "transform 0.5s ease"
                    }}
                />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: bg,
                        transform: hov ? "scale(1.03)" : "scale(1)",
                        transition: "transform 0.5s ease"
                    }}
                />
            )}

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)"
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px 20px 18px"
                }}
            >
                <h2
                    style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 700,
                        fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                        color: "white",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        transform: hov ? "translateY(-2px)" : "translateY(0)",
                        transition: "transform 0.3s ease"
                    }}
                >
                    {col.title}
                </h2>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.85rem",
                    opacity: hov ? 1 : 0,
                    transition: "opacity 0.25s"
                }}
            >
                →
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   BLOG CARD (Home → Notes)
───────────────────────────────────────────── */

function BlogCard({ post, onClick }) {
    const [hov, setHov] = useState(false);

    return (
        <article
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                border: "1.5px solid",
                borderRadius: "var(--r)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
                borderColor: hov ? "#ccc" : "var(--border)",
                background: hov ? "var(--off)" : "white"
            }}
        >
            <div style={{ overflow: "hidden", flexShrink: 0 }}>
                <Thumb
                    tone={post.coverTone}
                    ratio={post.coverRatio || "4/3"}
                    src={post.coverSrc}
                    alt={post.title}
                />
            </div>
            <div
                style={{
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}
            >
                <div
                    style={{
                        fontSize: "0.6rem",
                        fontWeight: 400,
                        color: "var(--gray)",
                        marginBottom: "4px",
                        letterSpacing: "0.01em"
                    }}
                >
                    {post.date} · {post.category}
                </div>
                <h3
                    style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                    }}
                >
                    {post.title}
                </h3>
            </div>
        </article>
    );
}

/* ─────────────────────────────────────────────
   COLLECTION DETAIL
───────────────────────────────────────────── */

function CollectionDetail({ col, setPage, openLb, goToArchiveWithPreset }) {
    const images = (col.imageIds || [])
        .map(id => ALL_ARCHIVE.find(img => img.id === id))
        .filter(Boolean);

    const [slide, setSlide] = useState(0);
    const current = images[slide] || null;

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "40px 20px 100px",
                animation: "up 0.4s ease"
            }}
        >
            <BackBtn onClick={() => setPage({ name: "home" })}>← Home</BackBtn>

            <div style={{ marginBottom: "28px" }}>
                <p
                    style={{
                        fontSize: "0.72rem",
                        color: "var(--gray)",
                        marginBottom: "8px"
                    }}
                >
                    {col.date}
                    {images.length > 0 && ` · ${images.length} highlighted images`}
                </p>
                <h1
                    style={{
                        fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        marginBottom: "12px"
                    }}
                >
                    {col.title}
                </h1>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "var(--gray)",
                        lineHeight: 1.78,
                        maxWidth: "560px",
                        fontWeight: 300
                    }}
                >
                    {col.description}
                </p>
            </div>

            {current && (
                <>
                    <div
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: "center"
                        }}
                        onClick={() => openLb(images, slide)}
                    >
                        {current.src ? (
                            <img
                                src={current.src}
                                alt={current.name}
                                style={{
                                    height: "min(60vh, 45vw)",
                                    width: "auto",
                                    display: "block"
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    height: "min(60vh, 45vw)",
                                    width: "auto",
                                    background:
                                        { dark: "#1a1a1a", mid: "#808080", light: "#c8c8c8" }[
                                        current.tone
                                        ] || "#999"
                                }}
                            />
                        )}

                        {slide > 0 && (
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setSlide(s => s - 1);
                                }}
                                style={ssBtn("left")}
                            >
                                ‹
                            </button>
                        )}
                        {slide < images.length - 1 && (
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setSlide(s => s + 1);
                                }}
                                style={ssBtn("right")}
                            >
                                ›
                            </button>
                        )}

                        <div
                            style={{
                                position: "absolute",
                                bottom: "12px",
                                right: "12px",
                                fontFamily: "var(--mono)",
                                fontSize: "0.5rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.8)",
                                background: "rgba(0,0,0,0.4)",
                                padding: "4px 10px",
                                borderRadius: "20px"
                            }}
                        >
                            Tap to enlarge
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: "28px"
                        }}
                    >
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                            {current.name}
                        </span>
                    </div>
                </>
            )}

            <div
                style={{
                    marginBottom: "28px"
                }}
            >
                {col.body.split("\n\n").map((p, i) => (
                    <p
                        key={i}
                        style={{
                            fontSize: "0.95rem",
                            lineHeight: 1.82,
                            color: "#444",
                            marginBottom: "18px",
                            fontWeight: 300
                        }}
                    >
                        {p}
                    </p>
                ))}
            </div>

            <div
                style={{
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--r)",
                    padding: "22px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--off)",
                    gap: "16px",
                    flexWrap: "wrap"
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            marginBottom: "3px"
                        }}
                    >
                        Browse all images in this collection
                    </p>
                </div>
                <button
                    onClick={() => goToArchiveWithPreset(col.filters)}
                    style={{
                        fontFamily: "var(--sans)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        padding: "11px 20px",
                        background: "var(--black)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                    }}
                >
                    Browse collection →
                </button>
            </div>
        </div>
    );
}

function ssBtn(side) {
    return {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [side]: "12px",
        width: "36px",
        height: "36px",
        background: "rgba(255,255,255,0.9)",
        border: "none",
        borderRadius: "50%",
        fontSize: "1.15rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    };
}

/* ─────────────────────────────────────────────
   ARCHIVE with "Load more"
───────────────────────────────────────────── */

function Archive({
    filtered,
    viewMode,
    setViewMode,
    fYear,
    setFYear,
    fFilm,
    setFFilm,
    fScanner,
    setFScanner,
    fAuthors,
    setFAuthors,
    fTags,
    setFTags,
    search,
    setSearch,
    hasFilters,
    clearFilters,
    openLb
}) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [fYear, fFilm, fScanner, fAuthors, fTags, search]);

    const visibleItems = filtered.slice(0, visibleCount);

    return (
        <div
            style={{
                padding: "40px 20px 100px",
                maxWidth: "1100px",
                margin: "0 auto",
                animation: "up 0.4s ease"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "24px",
                    gap: "12px",
                    flexWrap: "wrap"
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            lineHeight: 1
                        }}
                    >
                        Archive
                    </h1>
                    <p
                        style={{
                            fontSize: "0.72rem",
                            color: "var(--gray)",
                            marginTop: "5px"
                        }}
                    >
                        Showing {visibleItems.length} of {filtered.length} matching images ·{" "}
                        {ALL_ARCHIVE.length} total
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        border: "1.5px solid var(--border)",
                        borderRadius: "10px",
                        overflow: "hidden"
                    }}
                >
                    {[
                        ["grid", "⊞ Grid"],
                        ["list", "☰ List"]
                    ].map(([m, lbl]) => (
                        <button
                            key={m}
                            onClick={() => setViewMode(m)}
                            style={{
                                fontFamily: "var(--sans)",
                                fontSize: "0.72rem",
                                fontWeight: 500,
                                padding: "8px 14px",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                background: viewMode === m ? "var(--black)" : "white",
                                color: viewMode === m ? "white" : "var(--gray)"
                            }}
                        >
                            {lbl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1.5px solid var(--border)",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    background: "white",
                    marginBottom: "10px"
                }}
            >
                <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>⌕</span>
                <input
                    type="text"
                    placeholder="Search title, year, film, scanner, author, or tags…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontFamily: "var(--sans)",
                        fontSize: "0.88rem",
                        color: "var(--black)",
                        width: "100%"
                    }}
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--gray)",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            padding: 0
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Filters */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: "28px"
                }}
            >
                <Dropdown
                    label="Year"
                    options={YEARS}
                    value={fYear}
                    onChange={setFYear}
                />
                <Dropdown
                    label="Film Stock"
                    options={FILMS}
                    value={fFilm}
                    onChange={setFFilm}
                />
                <Dropdown
                    label="Scanner"
                    options={SCANNERS}
                    value={fScanner}
                    onChange={setFScanner}
                />

                <MultiDropdown
                    label="Author"
                    options={AUTHORS}
                    values={fAuthors}
                    onChange={setFAuthors}
                />
                <MultiDropdown
                    label="Tag"
                    options={TAGS}
                    values={fTags}
                    onChange={setFTags}
                />

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        style={{
                            fontFamily: "var(--sans)",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            padding: "8px 14px",
                            border: "1.5px solid var(--border)",
                            borderRadius: "10px",
                            background: "white",
                            color: "var(--gray)",
                            cursor: "pointer",
                            marginLeft: "auto"
                        }}
                    >
                        Clear all ✕
                    </button>
                )}
            </div>

            {filtered.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "80px 0",
                        fontSize: "0.75rem",
                        color: "var(--gray)"
                    }}
                >
                    No images found
                </div>
            ) : viewMode === "grid" ? (
                <GridView items={visibleItems} openLb={openLb} />
            ) : (
                <ListView items={visibleItems} openLb={openLb} />
            )}

            {visibleCount < filtered.length && (
                <div
                    style={{
                        marginTop: "24px",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <button
                        onClick={() =>
                            setVisibleCount(c => Math.min(c + PAGE_SIZE, filtered.length))
                        }
                        style={{
                            fontFamily: "var(--sans)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            padding: "10px 20px",
                            borderRadius: "999px",
                            border: "1.5px solid var(--border)",
                            background: "white",
                            cursor: "pointer"
                        }}
                    >
                        Load more images
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   GRID + LIST for Archive
───────────────────────────────────────────── */

function GridView({ items, openLb }) {
    return (
        <div className="archive-grid">
            {items.map((img, i) => (
                <div
                    key={img.id}
                    onClick={() => openLb(items, i)}
                    style={{
                        breakInside: "avoid",
                        marginBottom: "10px",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        animation: `fin 0.3s ease ${i * 0.02}s both`
                    }}
                    onMouseEnter={e =>
                        (e.currentTarget.querySelector(".ov").style.opacity = "1")
                    }
                    onMouseLeave={e =>
                        (e.currentTarget.querySelector(".ov").style.opacity = "0")
                    }
                >
                    <Thumb
                        tone={img.tone}
                        ratio={img.ratio || "3/4"}
                        src={img.src}
                        alt={img.name}
                    />
                    <div
                        className="ov"
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 52%)",
                            opacity: 0,
                            transition: "opacity 0.2s",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: "12px"
                        }}
                    >
                        <div
                            style={{ fontSize: "0.8rem", fontWeight: 600, color: "white" }}
                        >
                            {img.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListView({ items, openLb }) {
    return (
        <div>
            <div
                className="list-header"
                style={{ borderBottom: "1.5px solid var(--black)", paddingBottom: "8px" }}
            >
                {["", "Title", "Year", "Film Stock", "Scanner", "Author"].map(
                    (h, i) => (
                        <div
                            key={i}
                            className={i > 2 ? "list-hide" : ""}
                            style={{
                                fontFamily: "var(--mono)",
                                fontSize: "0.5rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "var(--gray)",
                                padding: "0 8px"
                            }}
                        >
                            {h}
                        </div>
                    )
                )}
            </div>

            {items.map((img, i) => (
                <div
                    key={img.id}
                    className="list-row"
                    onClick={() => openLb(items, i)}
                    style={{
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                        transition: "background 0.12s",
                        animation: `fin 0.25s ease ${i * 0.015}s both`
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--off)")}
                    onMouseLeave={e =>
                        (e.currentTarget.style.background = "transparent")
                    }
                >
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            overflow: "hidden",
                            flexShrink: 0
                        }}
                    >
                        {img.src ? (
                            <img
                                src={img.src}
                                alt={img.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background:
                                        { dark: "#1a1a1a", mid: "#808080", light: "#c8c8c8" }[
                                        img.tone
                                        ] || "#999"
                                }}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            padding: "0 10px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {img.name}
                    </div>
                    <div
                        className="list-year"
                        style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.6rem",
                            color: "var(--gray)",
                            padding: "0 8px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {img.year}
                    </div>
                    <div
                        className="list-hide"
                        style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.6rem",
                            color: "var(--gray)",
                            padding: "0 8px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {img.film}
                    </div>
                    <div
                        className="list-hide"
                        style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.6rem",
                            color: "var(--gray)",
                            padding: "0 8px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {img.scanner}
                    </div>
                    <div
                        className="list-hide"
                        style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.6rem",
                            color: "var(--gray)",
                            padding: "0 8px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {img.author}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────
   BLOG (Field Notes)
───────────────────────────────────────────── */

function Blog({ setPage }) {
    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "40px 20px 100px",
                animation: "up 0.4s ease"
            }}
        >
            <div style={{ marginBottom: "32px" }}>
                <p
                    style={{
                        fontSize: "0.78rem",
                        color: "var(--gray)",
                        marginBottom: "8px"
                    }}
                >
                    Writing
                </p>
                <h1
                    style={{
                        fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em"
                    }}
                >
                    Field Notes
                </h1>
                <p
                    style={{
                        marginTop: "10px",
                        fontSize: "0.9rem",
                        color: "var(--gray)",
                        lineHeight: 1.72,
                        fontWeight: 300
                    }}
                >
                    On analog photography, archival practice, and the life of images.
                </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {BLOG_POSTS.map(p => (
                    <article
                        key={p.id}
                        onClick={() => setPage({ name: "post", data: p })}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "100px 1fr",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--r)",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "background 0.15s, border-color 0.15s"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "var(--off)";
                            e.currentTarget.style.borderColor = "#ccc";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "white";
                            e.currentTarget.style.borderColor = "var(--border)";
                        }}
                    >
                        <div style={{ overflow: "hidden" }}>
                            <Thumb
                                tone={p.coverTone}
                                ratio={p.coverRatio || "4/3"}
                                src={p.coverSrc}
                                alt={p.title}
                            />
                        </div>
                        <div style={{ padding: "18px 20px" }}>
                            <p
                                style={{
                                    fontSize: "0.62rem",
                                    color: "var(--gray)",
                                    marginBottom: "6px"
                                }}
                            >
                                {p.date} · {p.category}
                            </p>
                            <h2
                                style={{
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.3,
                                    marginBottom: "7px"
                                }}
                            >
                                {p.title}
                            </h2>
                            <p
                                style={{
                                    fontSize: "0.82rem",
                                    color: "var(--gray)",
                                    lineHeight: 1.65,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    fontWeight: 300
                                }}
                            >
                                {p.excerpt}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   POST DETAIL
───────────────────────────────────────────── */

function PostDetail({ post, setPage, openLb }) {
    const postImages = (post.images || [])
        .map(id => ALL_ARCHIVE.find(img => img.id === id))
        .filter(Boolean);

    return (
        <div
            style={{
                maxWidth: "640px",
                margin: "0 auto",
                padding: "40px 20px 100px",
                animation: "up 0.4s ease"
            }}
        >
            <BackBtn onClick={() => setPage({ name: "blog" })}>← Notes</BackBtn>
            <p
                style={{
                    fontSize: "0.65rem",
                    color: "var(--gray)",
                    marginBottom: "10px"
                }}
            >
                {post.date} · {post.category}
            </p>
            <h1
                style={{
                    fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    marginBottom: "24px"
                }}
            >
                {post.title}
            </h1>

            {postImages.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "24px",
                        overflowX: "auto"
                    }}
                >
                    {postImages.map((img, idx) => (
                        <div
                            key={img.id}
                            style={{ minWidth: "120px", cursor: "pointer" }}
                            onClick={() => openLb(postImages, idx)}
                        >
                            <Thumb
                                tone={img.tone}
                                ratio={img.ratio || "3/4"}
                                src={img.src}
                                alt={img.name}
                            />
                            <div
                                style={{
                                    fontSize: "0.7rem",
                                    marginTop: "4px",
                                    color: "var(--gray)"
                                }}
                            >
                                {img.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p
                style={{
                    borderLeft: "3px solid var(--black)",
                    paddingLeft: "18px",
                    margin: "0 0 28px",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: "var(--gray)",
                    lineHeight: 1.78,
                    fontWeight: 300
                }}
            >
                {post.excerpt}
            </p>

            {renderPostBodyWithImages(post.body, openLb)}
        </div>
    );
}

function renderPostBodyWithImages(body, openLb) {
    if (!body) return null;

    const blocks = body.split("\n\n");

    return blocks.map((block, i) => {
        const trimmed = block.trim();
        const imgMatch = /^!\[(.*?)\]\((.*?)\)$/.exec(trimmed);

        if (imgMatch) {
            const alt = imgMatch[1] || "";
            const src = imgMatch[2];

            const item = {
                id: `${src}-${i}`,
                src,
                name: alt || "Image",
                tone: "mid",
                ratio: "3/2"
            };

            return (
                <div key={`img-${i}`} style={{ margin: "20px 0" }}>
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            cursor: "pointer"
                        }}
                        onClick={() => openLb([item], 0)}
                    />
                    {alt && (
                        <div
                            style={{
                                fontSize: "0.8rem",
                                color: "var(--gray)",
                                marginTop: "4px"
                            }}
                        >
                            {alt}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <p
                key={`p-${i}`}
                style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    color: "#444",
                    marginBottom: "20px",
                    fontWeight: 300
                }}
            >
                {block}
            </p>
        );
    });
}

/* ─────────────────────────────────────────────
   SHARED
───────────────────────────────────────────── */

function BackBtn({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                fontFamily: "var(--sans)",
                fontSize: "0.78rem",
                fontWeight: 500,
                background: "none",
                border: "none",
                color: "var(--gray)",
                cursor: "pointer",
                marginBottom: "28px",
                display: "block",
                padding: 0
            }}
        >
            {children}
        </button>
    );
}

function Footer() {
    return (
        <footer
            style={{
                borderTop: "1.5px solid var(--border)",
                padding: "24px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px"
            }}
        >
            <span
                style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "-0.01em"
                }}
            >
                Re—collection
            </span>
            <span
                style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.52rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--gray)"
                }}
            >
                Analog photography archive
            </span>
        </footer>
    );
}