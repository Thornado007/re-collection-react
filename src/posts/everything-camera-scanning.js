const post = {
    id: "camera-scanning",
    date: "Mar 10, 2025",
    category: "Method",
    title: "Everything camera scanning",
    excerpt:
        "Using a digital camera instead of a flatbed or film scanner changes not only the workflow, but the way you think about the negative itself.",

    // Main text. Double newlines = paragraphs or image blocks.
    // To insert an image, put a line like:  ![Alt text](/path/to/file.jpg)
    body:
        "Camera scanning is a way of re-photographing your film rather than passing it under a moving light. Instead of a scanner head, you use a digital camera, a macro lens, an even light source, and a simple rig to hold everything still.\n\n" +
        "The first time you set it up it feels improvised: a tripod balanced over a light panel, film taped down, a lens hovering a few centimetres above the emulsion. But once the rig is stable, the process is fast. One click per frame. Focus peaking and live view turn the smallest grain into a clear point of reference.\n\n" +
        "![Camera scanning rig on the desk](/blog/camera-scanning-rig.jpg)\n\n" +
        "What I like most is that camera scanning turns the negative back into a physical object in front of the lens. You can tilt, crop, and re-frame the strip itself. Dust becomes visible in real time. You are not feeding a machine; you are making another photograph of the photograph.\n\n" +
        "The files this produces are different from a traditional scanner. There is more micro-contrast, sometimes more apparent grain, and a different relationship between sharpness and texture. None of it is inherently better — but it is specific. And for an archive like this, specificity matters more than perfection.",

    // For the grey card/cover image -> we’ll wire this into BlogCard + PostDetail.
    coverTone: "mid",
    coverSrc: "/blog/camera-scanning-cover.jpg",

    // Optional: archive images to show as a strip at the top of the article
    // (these are IDs from images.json / archive)
};

export default post;