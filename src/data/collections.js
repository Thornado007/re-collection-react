// src/data/collections.js

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
            tags: ["portrait"],
        },
        imageIds: [
            "202502_R1_NikonFE_KodakGold200_Coolscan5000_13",
            "202503_R1_NikonF2_FujiNPC160_Coolscan5000_09",
            "202504_R2_NikonFM_KodakGold200_Coolscan5000_07",
        ],
    },
    {
        id: "Vermin Flowers",
        title: "Thor Vermin: A collection of Flowers",
        coverTone: "mid",
        coverRatio: "3/2",
        description: "Dorothea Lange's work from 1936 — a year that defined her.",
        body:
            "1936 is the year Lange’s images entered the public imagination. The pictures here orbit the edges of that history — familiar gestures in unfamiliar frames.\n\nI am interested in the way her attention settles: hands, fabric, the lines of a face that has been looking back for a long time.",
        // normalize to tags: [] (instead of tag: "flower")
        filters: { author: "Thor Vermin", tags: ["flower"] },
        imageIds: [
            "202505_R1_NikonFM_KodakUltramax400_03",
            "202504_R1_NikonFM_FujiC200_Coolscan5000_01",
            "202504_R1_NikonFM_FujiC200_Coolscan5000_01",
        ],
    },
];

export default COLLECTIONS;