export interface Stylist {
  id: string;
  name: string;
  title: string;
  location: string;
  specialties: string[];
  imageUrl: string;
  bio: string;
  featured?: boolean;
  // Profile page fields
  profileIntro?: string;
  areasOfPractice?: string[];
  approach?: string;
  clientContext?: string[];
}

export const stylists: Stylist[] = [
  {
    id: "1",
    name: "Eleanor Vance",
    title: "Personal Stylist · Image Consultant",
    location: "Paris / New York",
    specialties: ["Editorial", "Red Carpet", "Luxury Branding"],
    imageUrl: "https://images.unsplash.com/photo-1563481048455-47f30665058f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGlzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTk1OTUxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "With over a decade of experience in the fashion capitals of the world, Eleanor brings an unparalleled eye for detail and a deep understanding of luxury aesthetics.",
    featured: true,
    profileIntro: "Eleanor Vance works with individuals who seek to refine their visual presence through thoughtful curation and long-term aesthetic development. Her practice is rooted in listening, context, and a deep understanding of how personal style evolves alongside life transitions.",
    areasOfPractice: [
      "Personal Styling",
      "Professional & Corporate Image",
      "Special Occasion Styling",
      "Long-term Style Development",
      "Wardrobe Editing"
    ],
    approach: "Eleanor approaches each engagement as a collaborative process, beginning with observation and dialogue. She prioritizes understanding the individual's lifestyle, aspirations, and existing relationship with clothing before suggesting any changes. Her work emphasizes continuity over transformation — building wardrobes that evolve naturally over time.",
    clientContext: [
      "Working professionals",
      "Founders and entrepreneurs",
      "Individuals in transition"
    ]
  },
  {
    id: "2",
    name: "Julian Saint",
    title: "Personal Stylist · Wardrobe Strategist",
    location: "London",
    specialties: ["Minimalism", "Sustainable Fashion", "Personal Branding"],
    imageUrl: "https://images.unsplash.com/photo-1539109132382-381bb3f1cff6?q=80&w=1000&auto=format&fit=crop",
    bio: "Julian specializes in creating timeless capsules that transcend seasons, focusing on quality over quantity and ethical sourcing.",
    profileIntro: "Julian Saint specializes in building intentional wardrobes that prioritize longevity, ethical sourcing, and personal clarity. His practice centers on helping individuals define their aesthetic through minimalism and thoughtful curation.",
    areasOfPractice: [
      "Personal Styling",
      "Wardrobe Editing",
      "Sustainable Fashion Consulting",
      "Long-term Style Development"
    ],
    approach: "Julian's process begins with a comprehensive wardrobe audit, identifying pieces that serve the individual's life and releasing those that no longer align. He emphasizes quality fabrication, ethical production, and versatile design — creating capsules that work across contexts and seasons.",
    clientContext: [
      "Conscious consumers",
      "Working professionals",
      "Individuals seeking clarity"
    ]
  },
  {
    id: "3",
    name: "Sophia Chen",
    title: "Personal Stylist · Image Consultant",
    location: "Tokyo / LA",
    specialties: ["Streetwear", "Gender-Neutral", "Avant-Garde"],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    bio: "Sophia bridges the gap between high fashion and street culture, bringing a fresh, edgy perspective to her global clientele.",
    featured: true,
    profileIntro: "Sophia Chen works at the intersection of contemporary streetwear and high fashion, helping individuals express identity through progressive, gender-inclusive styling. Her practice embraces experimentation while maintaining wearability and personal authenticity.",
    areasOfPractice: [
      "Personal Styling",
      "Gender-Neutral Styling",
      "Contemporary & Streetwear",
      "Creative Industry Styling"
    ],
    approach: "Sophia's work is guided by curiosity and cultural awareness. She explores emerging designers, independent brands, and archival pieces to create looks that feel current yet personal. Her approach balances boldness with intention, ensuring that every piece serves a purpose.",
    clientContext: [
      "Creatives",
      "Entrepreneurs",
      "Individuals exploring identity"
    ]
  },
  {
    id: "4",
    name: "Marcus Thorne",
    title: "Menswear Specialist · Image Consultant",
    location: "Milan",
    specialties: ["Bespoke Tailoring", "Heritage Brands", "Corporate Styling"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    bio: "Marcus is the go-to consultant for the modern gentleman, specializing in heritage brands and the art of bespoke tailoring.",
    profileIntro: "Marcus Thorne specializes in menswear, with a focus on bespoke tailoring, heritage brands, and the refinement of professional presence. His practice serves individuals who value craftsmanship, fit, and timeless design.",
    areasOfPractice: [
      "Bespoke & Tailored Menswear",
      "Professional & Corporate Image",
      "Heritage Brand Consulting",
      "Special Occasion Styling"
    ],
    approach: "Marcus begins each engagement with an understanding of the individual's professional and personal contexts. He prioritizes fit, fabric quality, and garment construction, working closely with tailors and heritage brands to ensure every piece meets exacting standards.",
    clientContext: [
      "Working professionals",
      "Executives",
      "Individuals seeking sartorial refinement"
    ]
  },
  {
    id: "5",
    name: "Amara Okoro",
    title: "Personal Stylist · Visual Storyteller",
    location: "Lagos / Paris",
    specialties: ["Vibrant Color Theory", "Cultural Fusion", "Editorial"],
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1000&auto=format&fit=crop",
    bio: "Amara's work is a celebration of color and heritage, blending traditional influences with contemporary silhouettes.",
    profileIntro: "Amara Okoro brings a global perspective to personal styling, blending cultural heritage with contemporary design. Her practice celebrates color, texture, and the intersection of tradition and modernity.",
    areasOfPractice: [
      "Personal Styling",
      "Color Theory & Application",
      "Cultural & Heritage Styling",
      "Special Occasion Styling"
    ],
    approach: "Amara's work is rooted in storytelling and cultural respect. She collaborates with individuals to honor their heritage while embracing contemporary expression. Her process involves deep dialogue, research, and a celebration of individual identity.",
    clientContext: [
      "Creatives",
      "Individuals exploring cultural identity",
      "Those seeking bold, intentional style"
    ]
  },
  {
    id: "6",
    name: "David Rossi",
    title: "Vintage Specialist · Image Consultant",
    location: "Florence",
    specialties: ["Archival Fashion", "Sourcing", "Runway History"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    bio: "David possesses an encyclopedic knowledge of fashion history and specializes in sourcing rare archival pieces for collectors.",
    profileIntro: "David Rossi specializes in archival and vintage fashion, working with collectors and enthusiasts who value historical significance and rare craftsmanship. His practice combines research, sourcing, and curation.",
    areasOfPractice: [
      "Archival & Vintage Sourcing",
      "Personal Styling",
      "Collection Building",
      "Fashion History Consulting"
    ],
    approach: "David approaches each project with scholarly attention and curatorial precision. He works to understand the individual's aesthetic interests and then sources pieces that carry historical value, craftsmanship, and cultural significance.",
    clientContext: [
      "Collectors",
      "Fashion enthusiasts",
      "Individuals seeking unique, archival pieces"
    ]
  },
];