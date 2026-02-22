import React from "react";

export default function About() {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "40px 20px 100px",
                animation: "up 0.4s ease"
            }}
        >
            <p
                style={{
                    fontSize: "0.78rem",
                    color: "var(--gray)",
                    marginBottom: "8px"
                }}
            >
                About
            </p>

            <h1
                style={{
                    fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    marginBottom: "20px"
                }}
            >
                About Re—collection
            </h1>

            <section style={{ marginBottom: "22px" }}>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300
                    }}
                >
                    This website is an ongoing exercise in curation, documentation, and
                    digital preservation. It serves as a personal repository for my lifelong
                    obsession with collecting and scanning — primarily images, but also objects
                    that interest me like vintage t-shirts or crystals.
                </p>
            </section>

            <section style={{ marginBottom: "22px" }}>
                <h2
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        marginBottom: "6px"
                    }}
                >
                    The Purpose
                </h2>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        marginBottom: "10px"
                    }}
                >
                    For as long as I can remember, I’ve been compelled to collect, organize,
                    and catalog. This digital space represents the convergence of several
                    passions:
                </p>
                <ul
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        paddingLeft: "20px"
                    }}
                >
                    <li>Archiving as a practice of memory and preservation</li>
                    <li>Photography as a means of documentation and expression</li>
                    <li>Cataloging as an exercise in finding meaning through organization</li>
                    <li>Web design as a medium for sharing these collections</li>
                </ul>
            </section>

            <section style={{ marginBottom: "22px" }}>
                <h2
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        marginBottom: "6px"
                    }}
                >
                    The Process
                </h2>
                <ul
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        paddingLeft: "20px"
                    }}
                >
                    <li>Digital Preservation — scanning and digitizing analog materials (35mm film, prints, documents)</li>
                    <li>Curation — selecting, sequencing, and contextualizing images</li>
                    <li>Organization — developing systems for categorization and retrieval</li>
                    <li>Presentation — creating interfaces that honor both the material and the viewer</li>
                </ul>
            </section>

            <section style={{ marginBottom: "22px" }}>
                <h2
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        marginBottom: "6px"
                    }}
                >
                    Technical Notes
                </h2>
                <ul
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        paddingLeft: "20px"
                    }}
                >
                    <li>Hugo — static site generator for performance and simplicity</li>
                    <li>Blowfish Theme — clean, minimal design foundation</li>
                    <li>Custom HTML/CSS — for specific presentation needs</li>
                    <li>Digital Asset Management — organized file structures and metadata</li>
                </ul>
            </section>

            <section style={{ marginBottom: "22px" }}>
                <h2
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        marginBottom: "6px"
                    }}
                >
                    Philosophy
                </h2>
                <ul
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        paddingLeft: "20px"
                    }}
                >
                    <li>Accessibility — collections should be viewable and navigable</li>
                    <li>Context — images gain meaning through arrangement and description</li>
                    <li>Openness — sharing work invites conversation and connection</li>
                </ul>
            </section>

            <section style={{ marginBottom: "22px" }}>
                <h2
                    style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        marginBottom: "6px"
                    }}
                >
                    Contact &amp; Collaboration
                </h2>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        marginBottom: "10px"
                    }}
                >
                    This is a personal project, but I’m always interested in:
                </p>
                <ul
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        paddingLeft: "20px"
                    }}
                >
                    <li>Technical discussions about archiving and digitization</li>
                    <li>Collaborative documentation projects</li>
                    <li>Feedback on presentation and organization</li>
                    <li>Sharing resources and methodologies</li>
                </ul>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        marginTop: "10px"
                    }}
                >
                    For inquiries, suggestions, or just to share your own archival projects,
                    please reach out.
                </p>
            </section>

            <section>
                <p
                    style={{
                        fontSize: "0.95rem",
                        color: "#444",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        marginBottom: "8px"
                    }}
                >
                    This site is a work in progress, much like the collections it contains.
                    New materials are added regularly as scanning, editing, and cataloging
                    work continues.
                </p>
                <p
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--gray)",
                        marginTop: "4px"
                    }}
                >
                    Last updated: {lastUpdated}
                </p>
            </section>
        </div>
    );
}