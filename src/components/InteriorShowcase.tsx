import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Plus, X, Sparkles, Layout, Info } from "lucide-react";

// ─── Data Definitions ────────────────────────────────────────────────────────

interface Hotspot {
  id: string;
  top: string;
  left: string;
  title: string;
  description: string;
}

interface View {
  id: string;
  label: string;
  image: string;
  hotspots: Hotspot[];
}

interface Space {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  views: View[];
}

const spacesData: Space[] = [
  {
    id: "living",
    title: "Living Lounge",
    subtitle: "The Art of Conversation",
    description: "An open-plan salon designed to maximize light and space. Anchored by bookmatched Calacatta Gold accent panels, curved seating arrangements, and bespoke ring lighting, it represents the absolute pinnacle of contemporary urban luxury.",
    views: [
      {
        id: "living-salon",
        label: "Main Salon",
        image: "/renders/interior-living-1.jpg",
        hotspots: [
          {
            id: "l1-chandelier",
            top: "12%",
            left: "33%",
            title: "Bespoke Ring Chandelier",
            description: "Custom interlocking golden rings suspended dynamically to provide warm, diffused ambient glow across the main seating zone."
          },
          {
            id: "l1-marble",
            top: "38%",
            left: "34%",
            title: "Calacatta Gold Accent Wall",
            description: "Bookmatched Calacatta marble wall paneling with rich gold and grey veining, framed by pristine fluted white marble trim."
          },
          {
            id: "l1-sofa",
            top: "75%",
            left: "60%",
            title: "Curved Bouclé Sofa",
            description: "An oversized, custom-tailored circular sofa in premium textured cream bouclé fabric, oriented for organic social interaction."
          },
          {
            id: "l1-art",
            top: "30%",
            left: "93%",
            title: "Gallery Wall Art",
            description: "Curated fine art triptych featuring subtle earthy tones, hand-painted on premium linen canvas with custom solid oak framing."
          }
        ]
      },
      {
        id: "living-dining",
        label: "Dining Hall",
        image: "/renders/interior-living-2.jpg",
        hotspots: [
          {
            id: "l2-dining",
            top: "68%",
            left: "16%",
            title: "Formal Dining Suite",
            description: "Polished Nero Marquina marble dining table paired with custom leather-back armchairs, seating up to eight guests."
          },
          {
            id: "l2-mirrors",
            top: "38%",
            left: "20%",
            title: "Organic Sculptural Mirrors",
            description: "Bespoke pebble-shaped frameless tinted mirrors adding depth and modern geometric contrast to the dining area wall."
          },
          {
            id: "l2-artwork",
            top: "40%",
            left: "63%",
            title: "Abstract Triptych",
            description: "A three-panel abstract collection emphasizing raw plaster texture and natural neutral pigments that echo the room's palette."
          }
        ]
      }
    ]
  },
  {
    id: "kitchen",
    title: "Culinary Studio",
    subtitle: "High-Performance Aesthetics",
    description: "A fully integrated show kitchen balancing warm walnut timber tones with clean cream lacquered cabinetry. Equipped with premium smart appliances, soft-close hardware, and invisible details that make cooking a sensory pleasure.",
    views: [
      {
        id: "kitchen-main",
        label: "Culinary Space",
        image: "/renders/interior-kitchen.jpg",
        hotspots: [
          {
            id: "k-fridge",
            top: "50%",
            left: "14%",
            title: "Smart Double-Door Refrigerator",
            description: "Fully integrated Samsung Family Hub smart refrigerator featuring a touch screen dashboard, internal cameras, and custom steel front."
          },
          {
            id: "k-cabinets",
            top: "68%",
            left: "55%",
            title: "Smoked Oak Joinery",
            description: "Hand-crafted fluted wooden base cabinets with push-to-open mechanics and soft-closing drawer glides."
          },
          {
            id: "k-upper",
            top: "25%",
            left: "32%",
            title: "Lacquered Upper Closets",
            description: "Minimalist handleless overhead storage finished in premium high-durability satin polyurethane cream lacquer."
          },
          {
            id: "k-cooktop",
            top: "54%",
            left: "55%",
            title: "Integrated Induction Cooktop",
            description: "Professional grade induction cooktop flush-mounted into the countertop for a seamless, easy-to-clean culinary workspace."
          }
        ]
      }
    ]
  },
  {
    id: "bedrooms",
    title: "Bedrooms Sanctuary",
    subtitle: "Restorative Solitude",
    description: "A collection of master and guest bedrooms designed for complete sensory calm. Vertical timber panels, custom lighting, and integrated dressing zones create distinct layers of privacy and comfort.",
    views: [
      {
        id: "bedroom-master",
        label: "Master Bedstead",
        image: "/renders/interior-bedroom-1.jpg",
        hotspots: [
          {
            id: "b1-headboard",
            top: "40%",
            left: "50%",
            title: "Fluted Bedhead Wall",
            description: "Custom floor-to-ceiling accent wall featuring vertical fluted oak panels paired with a soft sand-textured plaster backdrop."
          },
          {
            id: "b1-pendant",
            top: "48%",
            left: "34%",
            title: "Bedside Pendant Light",
            description: "A minimalist matte-finished dome pendant lamp suspended from a delicate textile cord, creating intimate bedside reading light."
          },
          {
            id: "b1-sconces",
            top: "46%",
            left: "64%",
            title: "Ambient Circular Sconces",
            description: "Minimalist circular wall fixtures casting a soft, indirect halo of light against the sand-textured headboard paneling."
          }
        ]
      },
      {
        id: "bedroom-junior",
        label: "Junior Suite",
        image: "/renders/interior-bedroom-2.jpg",
        hotspots: [
          {
            id: "b2-headboard",
            top: "40%",
            left: "78%",
            title: "Vertical Timber Bedhead",
            description: "Custom fluted wood accent paneling running vertically behind the bed to draw the eyes upward."
          },
          {
            id: "b2-pendants",
            top: "48%",
            left: "66%",
            title: "Minimalist Hanging Pendant",
            description: "White modern dome lamp suspended from a thin black cord to offer focused bedside task illumination."
          },
          {
            id: "b2-sconces",
            top: "46%",
            left: "93%",
            title: "Ambient Wall Sconces",
            description: "Double circular sconces casting an indirect warm glow on the bedhead paneling."
          }
        ]
      },
      {
        id: "bedroom-closet",
        label: "Dressing Closet",
        image: "/renders/interior-closet.jpg",
        hotspots: [
          {
            id: "bc-closets",
            top: "45%",
            left: "18%",
            title: "Concealed Closet System",
            description: "Full-height wardrobe units finished in premium sand lacquer with integrated oak handle tracks."
          },
          {
            id: "bc-mirror",
            top: "35%",
            left: "70%",
            title: "Back-Lit Vanity Mirror",
            description: "Oversized, wall-mounted backlit mirror creating a soft, shadow-free illumination zone for dressing."
          },
          {
            id: "bc-floor",
            top: "85%",
            left: "55%",
            title: "Herringbone Oak Floor",
            description: "Hand-laid premium white oak chevron parquet floor adding refined pattern and warmth."
          }
        ]
      }
    ]
  },
  {
    id: "bathrooms",
    title: "Bathrooms Oasis",
    subtitle: "Spa-Inspired Bathing",
    description: "Every suite contains a bathroom crafted with custom fixtures, recessed shelf lighting, and premium stone tiles to offer a truly restorative spa experience.",
    views: [
      {
        id: "bathroom-wellness",
        label: "Wellness Bath & Tub",
        image: "/renders/interior-bathroom-1.jpg",
        hotspots: [
          {
            id: "bath1-tub",
            top: "72%",
            left: "62%",
            title: "Wellness Bathtub",
            description: "Sleek composite stone freestanding bathtub on a solid oak platform base."
          },
          {
            id: "bath1-tiling",
            top: "38%",
            left: "65%",
            title: "Earthy Vertical Tiling",
            description: "Richly textured slate-grey vertical brick tiles adding height and organic touch to the bathroom walls."
          },
          {
            id: "bath1-shower",
            top: "35%",
            left: "34%",
            title: "Rainfall Shower Head",
            description: "Ceiling-recessed matte black rainfall shower head inside the glass enclosure."
          }
        ]
      },
      {
        id: "bathroom-vanity",
        label: "Powder Room Vanity",
        image: "/renders/interior-bathroom-2.jpg",
        hotspots: [
          {
            id: "bath2-basin",
            top: "73%",
            left: "31%",
            title: "Vessel Washbasin",
            description: "Custom circular ceramic basin sitting on a floating wood console with integrated wall mixers."
          },
          {
            id: "bath2-pendant",
            top: "54%",
            left: "15%",
            title: "Hanging Spherical Pendant",
            description: "Sleek suspended metallic sphere pendant lighting creating targeted ambient glow."
          },
          {
            id: "bath2-mirror",
            top: "51%",
            left: "33%",
            title: "Back-Lit Square Mirror",
            description: "Warm LED backlighting outlining the vanity mirror, casting a halo on concrete panels."
          }
        ]
      },
      {
        id: "bathroom-guest",
        label: "Guest Shower",
        image: "/renders/interior-bathroom-3.jpg",
        hotspots: [
          {
            id: "bath3-hextile",
            top: "34%",
            left: "21%",
            title: "Hexagonal Sand Tiling",
            description: "Earthy beige hexagonal tiling inside the shower zone to introduce tactile visual texture."
          },
          {
            id: "bath3-toilet",
            top: "78%",
            left: "49%",
            title: "Wall-Hung Smart WC",
            description: "Sleek wall-mounted toilet with a concealed tank and matching matte chrome flush plate."
          },
          {
            id: "bath3-closet",
            top: "30%",
            left: "49%",
            title: "Recessed Timber Closet",
            description: "Hand-crafted oak cabinetry recessed directly into the wall paneling for seamless storage."
          }
        ]
      }
    ]
  }
];

export default function InteriorShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSpaceIdx, setActiveSpaceIdx] = useState(0);
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // Scroll linkage using Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scale from 75% to 100% width based on scroll progress
  // Scroll progress goes from 0.15 (when entering section) to 0.45 (when section is fully centered)
  const scale = useTransform(scrollYProgress, [0.15, 0.45], ["75%", "100%"]);
  const borderRadius = useTransform(scrollYProgress, [0.15, 0.45], ["2rem", "0rem"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0.5, 0]);
  const textY = useTransform(scrollYProgress, [0.1, 0.35], [50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  const activeSpace = spacesData[activeSpaceIdx];
  const activeView = activeSpace.views[activeViewIdx];

  const handleSpaceChange = (idx: number) => {
    setActiveSpaceIdx(idx);
    setActiveViewIdx(0);
    setSelectedHotspot(null);
  };

  const handleViewChange = (idx: number) => {
    setActiveViewIdx(idx);
    setSelectedHotspot(null);
  };

  return (
    <div
      ref={containerRef}
      id="interiors"
      className="relative min-h-[170vh] bg-[#060607] pt-12 pb-24 overflow-visible"
    >
      {/* Sticky Inner Page Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-6">
        
        {/* Upper Info Header */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="w-full max-w-7xl mx-auto px-4 md:px-8 z-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#c88e71] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c88e71]">
                  Interior Showcase
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {activeSpace.title}
              </h2>
              <p className="text-sm font-medium text-white/50 tracking-wide">
                {activeSpace.subtitle}
              </p>
              <p className="max-w-xl pt-1 text-xs leading-relaxed text-[#efc2aa]/80">
                A specially designed signature theme runs throughout the building — earthy tones and natural finishes complementing the green backdrop, with 3.2M ceilings and panoramic terraces in every residence.
              </p>
            </div>
            
            <div className="max-w-md">
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                {activeSpace.description}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {spacesData.map((space, idx) => (
              <button
                key={space.id}
                onClick={() => handleSpaceChange(idx)}
                className={`relative px-5 py-2.5 rounded-full text-xs md:text-sm font-medium tracking-wide transition-all duration-300 ${
                  activeSpaceIdx === idx
                    ? "bg-[#c88e71] text-black shadow-lg shadow-[#c88e71]/15"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-white/5"
                }`}
              >
                {space.title}
              </button>
            ))}

            {/* Sub-view Toggle buttons if space has multiple views */}
            {activeSpace.views.length > 1 && (
              <div className="ml-auto flex gap-1.5 bg-black/40 border border-white/10 p-1 rounded-full">
                {activeSpace.views.map((view, idx) => (
                  <button
                    key={view.id}
                    onClick={() => handleViewChange(idx)}
                    className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300 ${
                      activeViewIdx === idx
                        ? "bg-white/15 text-white"
                        : "text-white/45 hover:text-white"
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Expanding Showcase Image */}
        <div className="w-full h-[50vh] md:h-[60vh] flex items-center justify-center relative mt-6 mb-6">
          <motion.div
            style={{
              width: scale,
              height: "100%",
              borderRadius: borderRadius,
            }}
            className="relative overflow-hidden border border-white/10 bg-black/60 shadow-2xl transition-all duration-300"
          >
            {/* Dark overlay that fades out as image expands */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-black z-10 pointer-events-none"
            />

            {/* Background image render */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeView.image}
                src={activeView.image}
                alt={`${activeView.label} — ${activeSpace.title} interior of Lavelle Bugolobi luxury apartments, Kampala`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-cover select-none"
              />
            </AnimatePresence>

            {/* Highlight Hotspots */}
            <AnimatePresence>
              {activeView.hotspots.map((hotspot) => {
                const isSelected = selectedHotspot?.id === hotspot.id;
                return (
                  <motion.div
                    key={hotspot.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ top: hotspot.top, left: hotspot.left }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* Pulsing button */}
                    <button
                      onClick={() => setSelectedHotspot(isSelected ? null : hotspot)}
                      className={`relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full backdrop-blur-md transition-all duration-300 border ${
                        isSelected 
                          ? "bg-[#c88e71] border-white text-black scale-110" 
                          : "bg-black/60 hover:bg-black/90 text-white border-white/40 hover:border-white scale-100"
                      }`}
                    >
                      {/* Pulse Ring */}
                      {!isSelected && (
                        <span className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping opacity-60 pointer-events-none" />
                      )}
                      {isSelected ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                      )}
                    </button>

                    {/* Popup Card */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 md:w-72 bg-black/90 border border-white/10 rounded-[1.2rem] p-4 text-white shadow-2xl backdrop-blur-xl z-30"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <Info className="w-3.5 h-3.5 text-[#efc2aa]" />
                            <h4 className="text-xs md:text-sm font-semibold text-[#efc2aa] uppercase tracking-wider">
                              {hotspot.title}
                            </h4>
                          </div>
                          <p className="text-2xs md:text-xs text-white/70 leading-relaxed">
                            {hotspot.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Bottom Left Watermark */}
            <div className="absolute bottom-4 left-6 z-15 hidden md:flex items-center gap-2 bg-black/60 px-3.5 py-2 rounded-full border border-white/5 backdrop-blur-sm">
              <Layout className="w-3.5 h-3.5 text-[#efc2aa]" />
              <span className="text-[10px] font-semibold text-[#efc2aa] uppercase tracking-[0.2em]">
                Lavelle Residence Rendered Showcase
              </span>
            </div>

            {/* Swipe/Click Helper on top right */}
            <div className="absolute top-4 right-6 z-15 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/5 backdrop-blur-sm text-[10px] text-white/50 tracking-wider">
              Click <Plus className="inline w-3 h-3 mx-0.5 text-[#efc2aa]" /> to view details
            </div>
          </motion.div>
        </div>

        {/* Scroll Helper Bottom indicator */}
        <div className="w-full text-center z-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
            Scroll to expand perspective
          </p>
        </div>

      </div>
    </div>
  );
}
