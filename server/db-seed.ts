import { db } from "./db";
import { aiArtists } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Seed AI Artists
  const aiArtistData = [
    {
      name: "Luna Nova",
      description: "Professional pop vocalist with crystal-clear tone and emotional depth",
      voiceType: "female",
      genre: "pop",
      language: "english",
      isAvailable: true,
      popularity: 95,
      sampleUrl: "/samples/luna-nova.mp3",
      thumbnailUrl: "/avatars/luna-nova.jpg"
    },
    {
      name: "Max Steel",
      description: "Dynamic hip-hop artist with powerful flow and urban style",
      voiceType: "male",
      genre: "hip-hop",
      language: "english",
      isAvailable: true,
      popularity: 88,
      sampleUrl: "/samples/max-steel.mp3",
      thumbnailUrl: "/avatars/max-steel.jpg"
    },
    {
      name: "Aria Rose",
      description: "Soulful R&B vocalist with rich harmonies and smooth delivery",
      voiceType: "female",
      genre: "r&b",
      language: "english",
      isAvailable: true,
      popularity: 92,
      sampleUrl: "/samples/aria-rose.mp3",
      thumbnailUrl: "/avatars/aria-rose.jpg"
    },
    {
      name: "Zane Rock",
      description: "High-energy rock vocalist with powerful range and attitude",
      voiceType: "male",
      genre: "rock",
      language: "english",
      isAvailable: true,
      popularity: 85,
      sampleUrl: "/samples/zane-rock.mp3",
      thumbnailUrl: "/avatars/zane-rock.jpg"
    },
    {
      name: "Nova Beat",
      description: "Electronic music specialist with futuristic vocal effects",
      voiceType: "non-binary",
      genre: "electronic",
      language: "english",
      isAvailable: true,
      popularity: 78,
      sampleUrl: "/samples/nova-beat.mp3",
      thumbnailUrl: "/avatars/nova-beat.jpg"
    },
    {
      name: "Country Kate",
      description: "Authentic country vocalist with storytelling charm",
      voiceType: "female",
      genre: "country",
      language: "english",
      isAvailable: true,
      popularity: 82,
      sampleUrl: "/samples/country-kate.mp3",
      thumbnailUrl: "/avatars/country-kate.jpg"
    }
  ];

  try {
    // Insert AI artists if they don't exist
    for (const artist of aiArtistData) {
      await db.insert(aiArtists).values(artist).onConflictDoNothing();
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

export { seedDatabase };