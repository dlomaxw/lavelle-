import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import {
  Building2,
  Phone,
  MapPin,
  BedDouble,
  Bath,
  Square,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Car,
  Dumbbell,
  Waves,
  Users,
  Menu,
  X,
  Send,
  Calendar,
  Loader2,
  CheckSquare,
  Sparkles,
  ZoomIn,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InteriorShowcase from "@/components/InteriorShowcase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  increment,
  onSnapshot
} from "firebase/firestore";

export const DEFAULT_SETTINGS = {
  heroVideoUrl: "https://www.youtube.com/embed/bQaBlh1N7IA?autoplay=1&mute=1&controls=0&loop=1&playlist=bQaBlh1N7IA&rel=0&playsinline=1&vq=hd1080",
  waNumber: "256791224477",
  contactPhone: "+256 791 224 477",
  residence1Price: "$168,000",
  residence2Price: "$245,000",
  residence3Price: "$390,000"
};

export const SettingsContext = React.createContext(DEFAULT_SETTINGS);

// ─── Visitor tracking ─────────────────────────────────────────────────────────

async function trackPageVisit() {
  try {
    await setDoc(
      doc(db, "siteStats", "visitors"),
      { count: increment(1), lastVisit: serverTimestamp() },
      { merge: true }
    );
  } catch (_) {
    // silently fail — non-critical
  }
}

// ─── Data ────────────────────────────────────────────────────────────────────

const residences = [
  {
    id: 1,
    name: "Skyline Suite",
    price: "$168,000",
    beds: 2,
    baths: 2,
    size: "118 sqm",
    status: "Available",
    image:
      "/renders/3d render (1).png",
    blurb:
      "Open-plan city residence with warm finishes, panoramic glazing, and private balcony living.",
  },
  {
    id: 2,
    name: "Lavelle Signature",
    price: "$245,000",
    beds: 3,
    baths: 3,
    size: "176 sqm",
    status: "Reserved",
    image:
      "/renders/3d render (2).png",
    blurb:
      "A premium family apartment designed for long-term comfort, privacy, and elevated everyday living.",
  },
  {
    id: 3,
    name: "Penthouse Horizon",
    price: "$390,000",
    beds: 4,
    baths: 4,
    size: "248 sqm",
    status: "New",
    image:
      "/renders/3d render (3).png",
    blurb:
      "Expansive top-floor residence with statement interiors, entertaining zones, and skyline-facing terraces.",
  },
];

const amenities = [
  { icon: Waves, title: "Pool Deck", text: "Resort-inspired water and lounge experience." },
  { icon: Dumbbell, title: "Fitness Studio", text: "Contemporary training space for daily wellness." },
  { icon: Car, title: "Secure Parking", text: "Controlled-access basement and visitor parking." },
  { icon: ShieldCheck, title: "24/7 Security", text: "Round-the-clock access control and monitoring." },
  { icon: Users, title: "Resident Lounge", text: "Refined shared spaces for meetings and downtime." },
  { icon: Building2, title: "Modern Architecture", text: "A sleek façade with premium urban presence." },
];

const galleryItems = [
  {
    image: "/renders/3d render (4).png",
    title: "Lavelle Façade",
    description: "A striking architectural statement showcasing modern verticality, premium glass balconies, and warm wooden accents."
  },
  {
    image: "/renders/3d render (5).png",
    title: "Grand Entryway",
    description: "The secure landscaped entrance, greeting residents and guests with native Ugandan plantings and soft ambient lighting."
  },
  {
    image: "/renders/3d render (7).png",
    title: "Sunset Balcony View",
    description: "Private outdoor terrace offering open-air seating and beautiful panoramic vistas of the Kampala skyline."
  },
  {
    image: "/renders/3d render (8).png",
    title: "Premium Reception & Lobby",
    description: "Double-height ground floor reception desk with fluted timber panels and premium stone floor details."
  },
  {
    image: "/renders/3d render (11).png",
    title: "Rooftop Dining Deck",
    description: "An outdoor entertaining terrace equipped with premium dining layouts, BBQ stations, and skyline views."
  },
  {
    image: "/renders/3d render (12).png",
    title: "Skyline Pool & Wellness Deck",
    description: "Elevated swimming pool and sun loungers designed for daily relaxation and recreation under the Kampala sun."
  },
  {
    image: "/renders/3d render (14).png",
    title: "Modern Facade Detail",
    description: "Close-up detailing of the bespoke bronze framing, premium glass panels, and external column structures."
  },
  {
    image: "/renders/3d render (15).png",
    title: "Evening Residence View",
    description: "The building illuminated at night, highlighting the warm interior layouts and architectural geometry."
  }
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c88e71]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {text ? <p className="text-sm leading-7 text-white/65 md:text-base">{text}</p> : null}
    </div>
  );
}

function NavLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero({ onNavigate, onImageClick }: { onNavigate: (id: string) => void; onImageClick: (img: string) => void }) {
  const settings = React.useContext(SettingsContext);
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,142,113,0.18),transparent_35%),radial-gradient(circle_at_left,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />
      
      {/* Floating Animated Icons */}
      <motion.div 
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-[40%] text-[#c88e71]/20 hidden lg:block"
      >
        <Sun className="h-8 w-8" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, -4, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-16 left-6 text-[#c88e71]/5 hidden md:block animate-pulse"
      >
        <Building2 className="h-16 w-16" />
      </motion.div>
      
      <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center px-6 py-12 md:px-10 lg:px-14 min-h-[70vh]">
        
        {/* Left Column: Text Content and Details */}
        <div className="space-y-7 text-center md:text-left z-20">
          <motion.div 
            initial={{ letterSpacing: "0.15em", opacity: 0, y: -10 }}
            animate={{ letterSpacing: "0.25em", opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="flex items-center justify-center md:justify-start gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#c88e71]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#c88e71] animate-pulse" />
            Refined Urban Living in Kampala
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.2 }
                }
              }}
              className="font-cinzel text-3xl font-light tracking-[0.2em] md:text-4xl lg:text-[2.75rem] leading-[1.1] flex flex-wrap justify-center md:justify-start overflow-hidden py-1"
            >
              {"LAVELLE".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { y: 40, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { type: "spring", damping: 15, stiffness: 130 }
                    }
                  }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#efc2aa] to-white inline-block select-none mr-[0.05em]"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
              className="font-cormorant text-lg md:text-xl italic text-[#efc2aa] tracking-wide text-center md:text-left font-medium"
            >
              Bespoke apartments engineered for elevated living.
            </motion.div>

            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              className="text-xs md:text-sm leading-relaxed text-white/60 text-center md:text-left max-w-lg font-light"
            >
              Situated in Bugolobi's most desirable enclave, Lavelle combines modern architectural form with timeless interior finishes to create Kampala's premier boutique residence.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.15 }}
            className="flex flex-wrap justify-center md:justify-start gap-3"
          >
            <Button
              className="rounded-full bg-[#c88e71] px-6 py-5 text-xs text-black font-semibold hover:bg-[#ddb09a] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c88e71]/10"
              onClick={() => onNavigate("residences")}
            >
              Explore Residences <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-6 py-5 text-xs text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              onClick={() => onNavigate("contact")}
            >
              Book a Private Tour
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            className="flex items-center justify-center md:justify-start gap-6 pt-6 border-t border-white/5 max-w-md mx-auto md:mx-0 text-center md:text-left"
          >
            {[
              ["24", "PREMIUM UNITS"],
              ["04", "FLOORS"],
              ["100%", "FULLY MANAGED"],
            ].map(([val, label], idx) => (
              <div key={label} className="flex gap-4 items-center">
                {idx > 0 && <div className="h-6 w-[1px] bg-white/10 hidden md:block" />}
                <div className="space-y-0.5">
                  <div className="font-cinzel text-base md:text-lg font-medium text-white tracking-wider">{val}</div>
                  <div className="text-[8px] font-semibold text-white/40 tracking-[0.15em]">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Featured Video Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, x: 25 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="relative w-full"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[#c88e71]/8 blur-2xl pointer-events-none" />
          <div 
            className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 p-2.5 shadow-2xl shadow-black/60 backdrop-blur-xl group transition-all duration-500 hover:border-white/15"
          >
            <div className="relative overflow-hidden rounded-[1.4rem]">
              <iframe
                src={settings.heroVideoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="h-[280px] md:h-[390px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01] pointer-events-none border-0"
                title="Lavelle Hero Video"
              />
            </div>
            
            <div className="mt-3.5 rounded-2xl border border-white/5 bg-black/45 p-3.5 backdrop-blur-md flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <span className="text-[8px] font-semibold tracking-[0.2em] text-[#efc2aa] uppercase">Featured Residence</span>
                <h4 className="text-sm font-semibold text-white">Lavelle Signature Suite</h4>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-white/60">
                <div>3 Bed</div>
                <div className="h-2.5 w-[1px] bg-white/15" />
                <div>3 Bath</div>
                <div className="h-2.5 w-[1px] bg-white/15" />
                <div>176 SQM</div>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}

function ResidencesSection({ onImageClick }: { onImageClick: (img: string) => void }) {
  const settings = React.useContext(SettingsContext);
  return (
    <section className="space-y-8" id="residences">
      <SectionTitle
        eyebrow="Residences"
        title="Curated units with pricing, specs, and direct inquiry"
        text="Each listing is structured to convert. View details, shortlist your preferred home, and move directly into a sales conversation."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {residences.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: item.id * 0.1 }}
          >
            <Card className="overflow-hidden rounded-[1.6rem] border-white/10 bg-white/5 text-white backdrop-blur-xl h-full transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 group">
              <div 
                className="relative overflow-hidden cursor-pointer"
                onClick={() => onImageClick(item.image)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                  <ZoomIn className="text-white drop-shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 h-10 w-10 scale-50 group-hover:scale-100" />
                </div>
                <Badge className="absolute left-4 top-4 bg-black/70 text-white hover:bg-black/70 backdrop-blur-md">
                  {item.status}
                </Badge>
              </div>
              <CardContent className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/65">{item.blurb}</p>
                  </div>
                  <div className="text-right text-lg font-semibold text-[#efc2aa] whitespace-nowrap">
                    {item.id === 1 ? settings.residence1Price : item.id === 2 ? settings.residence2Price : settings.residence3Price}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm text-white/75">
                  <div className="rounded-2xl bg-black/30 p-3">
                    <BedDouble className="mb-2 h-4 w-4" />
                    {item.beds} Beds
                  </div>
                  <div className="rounded-2xl bg-black/30 p-3">
                    <Bath className="mb-2 h-4 w-4" />
                    {item.baths} Baths
                  </div>
                  <div className="rounded-2xl bg-black/30 p-3">
                    <Square className="mb-2 h-4 w-4" />
                    {item.size}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 rounded-full bg-[#c88e71] text-black hover:bg-[#ddb09a]"
                    onClick={() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Request Details
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(item.name)}.`,
                        "_blank"
                      )
                    }
                  >
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AmenitiesSection() {
  return (
    <section className="space-y-8" id="amenities">
      <SectionTitle
        eyebrow="Amenities"
        title="Premium amenities for an elevated lifestyle"
        text="The building experience is crafted to sell the full lifestyle, not just the square meters."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="rounded-[1.5rem] border-white/10 bg-white/5 text-white h-full transition-all duration-300 hover:border-[#c88e71]/30 hover:bg-white/10 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{item.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function GallerySection({ onImageClick }: { onImageClick: (img: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll inside the gallery section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Safely update the active index on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.floor(latest * galleryItems.length),
      galleryItems.length - 1
    );
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  // Calculate transforms for each gallery image
  const images = galleryItems.map((item, i) => {
    const len = galleryItems.length;
    const start = (i - 0.35) / len;
    const peakStart = i / len;
    const peakEnd = (i + 0.7) / len;
    const end = (i + 1.05) / len;

    // First image starts opaque, last image stays opaque at the end
    const opacityRange = [
      i === 0 ? 0 : start,
      i === 0 ? 0 : peakStart,
      i === len - 1 ? 1 : peakEnd,
      i === len - 1 ? 1 : end
    ];

    const opacity = useTransform(
      scrollYProgress,
      opacityRange,
      [0, 1, 1, 0]
    );

    const scale = useTransform(
      scrollYProgress,
      [start, end],
      [1.0, 1.08],
      { clamp: true }
    );

    return { ...item, opacity, scale };
  });

  return (
    <div
      ref={containerRef}
      id="gallery"
      className="relative h-[400vh] bg-[#060607] pt-12 pb-24 overflow-visible"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-8">
        
        {/* Sticky Header Section */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 z-20">
          <SectionTitle
            eyebrow="Cinematic Gallery"
            title="A walkthrough of life at Lavelle"
            text="Scroll down to immerse yourself in the spaces, architectural facades, and premium amenities."
          />
        </div>

        {/* Viewport Frame */}
        <div className="w-full h-[55vh] md:h-[65vh] max-w-7xl mx-auto px-4 md:px-8 relative mt-6 mb-6">
          <div className="relative w-full h-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl">
            
            {/* Absolute Images with Crossfade and Zoom */}
            {images.map((item, i) => (
              <motion.div
                key={item.image}
                style={{ opacity: item.opacity, scale: item.scale }}
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={() => onImageClick(item.image)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Subtle vignetting shadow inside the viewport */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
              </motion.div>
            ))}

            {/* Floating Info Card (Bottom-Left) */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-8 z-30 max-w-md bg-black/75 border border-white/10 rounded-[1.5rem] p-5 backdrop-blur-md shadow-2xl pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-1.5 text-left"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#efc2aa]">
                    Residences Gallery — {activeIndex + 1} of {galleryItems.length}
                  </span>
                  <h3 className="text-lg font-bold text-white font-cinzel tracking-wider">
                    {galleryItems[activeIndex].title}
                  </h3>
                  <p className="text-xs text-white/65 leading-relaxed font-light">
                    {galleryItems[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Zoom Button (Bottom-Right) */}
            <div className="absolute bottom-8 right-8 z-30 hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(galleryItems[activeIndex].image);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[#efc2aa] backdrop-blur-md transition hover:scale-105 hover:bg-black/80 hover:text-white"
                title="Expand View"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Floating Index Indicator (Top-Right) */}
            <div className="absolute top-6 right-6 z-30 bg-black/65 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-3">
              <span className="font-cinzel text-xs font-semibold text-white tracking-wider">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="h-3 w-[1px] bg-white/20" />
              <span className="font-cinzel text-xs font-semibold text-white/40 tracking-wider">
                {String(galleryItems.length).padStart(2, "0")}
              </span>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-35">
              <motion.div
                className="h-full bg-[#c88e71]"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>

          </div>
        </div>

        {/* Scroll Helper Bottom indicator */}
        <div className="w-full text-center z-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
            Keep scrolling to walk through
          </p>
        </div>

      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" id="about">
      <Card className="rounded-[1.8rem] border-white/10 bg-[#121216] text-white">
        <CardContent className="p-8">
          <SectionTitle
            eyebrow="About Lavelle"
            title="A premium address in the heart of Kampala"
            text="Lavelle is a desirable residential address: sophisticated, architecturally considered, and built for buyers who care about design, comfort, and enduring value."
          />
        </CardContent>
      </Card>
      <Card className="rounded-[1.8rem] border-white/10 bg-white/5 text-white">
        <CardContent className="grid gap-6 p-8 md:grid-cols-2">
          {[
            [
              "Prime location",
              "Situated in one of Kampala's most sought-after urban districts, minutes from business and leisure hubs.",
            ],
            [
              "WhatsApp-first sales",
              "Every page routes interested buyers directly into a guided sales conversation with your team.",
            ],
            [
              "Trust-driven design",
              "Clean typography, spacious layout, and motion cues that communicate credibility and premium quality.",
            ],
            [
              "Qualified buyers only",
              "Inquiry forms capture budget, unit interest, and purchase timeline — so your team speaks to serious clients.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.2rem] bg-black/30 p-5">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/65">{body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

// ─── Contact with Firebase ────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  unit: "",
  budget: "",
  timeline: "",
  message: "",
  siteVisitRequested: false,
  preferredVisitDate: "",
};

function ContactSection() {
  const settings = React.useContext(SettingsContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setStatus("loading");
    try {
      await addDoc(collection(db, "leads"), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        unit: form.unit,
        budget: form.budget,
        timeline: form.timeline,
        message: form.message,
        siteVisitRequested: form.siteVisitRequested,
        preferredVisitDate: form.preferredVisitDate || null,
        source: "Website Form",
        status: "New",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Firestore error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" id="contact">
      <Card className="rounded-[1.8rem] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Client Inquiry Form</CardTitle>
          <p className="text-sm text-white/55 mt-1">All fields are saved to our sales dashboard instantly.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name & Phone */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="h-12 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
              placeholder="Full name *"
            />
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="h-12 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
              placeholder="Phone number *"
            />
          </div>

          {/* Email & Unit */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="h-12 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
              placeholder="Email address"
            />
            <Input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="h-12 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
              placeholder="Preferred unit"
            />
          </div>

          {/* Budget & Timeline */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="h-12 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
              placeholder="Budget range"
            />
            <Input
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              className="h-12 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
              placeholder="When are you buying?"
            />
          </div>

          {/* Message */}
          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="min-h-[110px] rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
            placeholder="Tell us what you're looking for..."
          />

          {/* Site visit request */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  name="siteVisitRequested"
                  checked={form.siteVisitRequested}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="h-5 w-5 rounded-md border border-white/20 bg-black/30 peer-checked:bg-[#c88e71] peer-checked:border-[#c88e71] transition flex items-center justify-center">
                  {form.siteVisitRequested && (
                    <CheckSquare className="h-4 w-4 text-black" />
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Request a site visit</div>
                <div className="text-xs text-white/50">We'll book a private tour at your preferred time</div>
              </div>
            </label>

            {form.siteVisitRequested && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
              >
                <label className="text-xs text-white/60 block mb-1.5">Preferred visit date</label>
                <Input
                  type="date"
                  name="preferredVisitDate"
                  value={form.preferredVisitDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="h-11 rounded-xl border-white/10 bg-black/30 text-white [color-scheme:dark]"
                />
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              className="rounded-full bg-[#c88e71] px-6 text-black hover:bg-[#ddb09a] disabled:opacity-60"
              onClick={handleSubmit}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Inquiry
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={() =>
                window.open(
                  `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20I%27m%20interested%20in%20the%20project.`,
                  "_blank"
                )
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
            </Button>
          </div>

          {status === "success" && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
              ✓ Inquiry submitted and saved to our dashboard. We'll reach out within 24 hours.
              {form.siteVisitRequested && " Your site visit request has been noted."}
            </div>
          )}
          {status === "error" && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              ✗ Something went wrong. Please try again or reach us on WhatsApp.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[1.8rem] border-white/10 bg-[#121216] text-white">
        <CardContent className="space-y-6 p-8">
          <SectionTitle
            eyebrow="Contact"
            title="Direct response channels for high-intent buyers"
            text="The contact stack is designed to reduce friction and move prospects quickly from interest to conversation."
          />
          <div className="space-y-4">
            {[
              [Phone, settings.contactPhone, "Sales line"],
              [MessageCircle, "WhatsApp direct chat", "Instant response"],
              [MapPin, "Kampala, Uganda", "Project location"],
              [Calendar, "Private site visits", "By appointment"],
            ].map(([Icon, title, sub]: any) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-white/60">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060607]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img src="/logo.svg" alt="Lavelle Logo" className="h-32 w-auto object-contain" />
      </motion.div>
      <motion.div 
        className="mt-8 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i}
            className="h-2 w-2 rounded-full bg-[#c88e71]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function Lightbox({ image, onClose }: { image: string | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <button 
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-xl transition hover:bg-white/20 hover:text-white" 
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={image}
            alt="Enlarged view"
            className="max-h-[90vh] max-w-[90vw] rounded-[1.5rem] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LavelleWebsite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [section, setSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);

  // Track every page visit in Firestore
  useEffect(() => {
    trackPageVisit();
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2200);
    
    // Load Settings
    const unsub = onSnapshot(doc(db, "siteSettings", "general"), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(prev => ({ ...prev, ...docSnap.data() as typeof DEFAULT_SETTINGS }));
      }
    });

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setSection(id);
    setMobileOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links: [string, string][] = [
    ["home", "Home"],
    ["about", "About"],
    ["residences", "Residences"],
    ["interiors", "Interiors"],
    ["amenities", "Amenities"],
    ["gallery", "Gallery"],
    ["contact", "Contact"],
  ];

  return (
    <SettingsContext.Provider value={siteSettings}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-[#060607] text-white"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="sticky top-4 z-50 mb-6 rounded-full border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => scrollToSection("home")} className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="Lavelle" 
                className="h-16 w-auto object-contain" 
              />
            </button>

            <nav className="hidden items-center gap-1 lg:flex">
              {links.map(([id, label]) => (
                <NavLink key={id} active={section === id} onClick={() => scrollToSection(id)}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Button
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() =>
                  window.open(
                    `https://wa.me/${siteSettings.waNumber}?text=Hello%20Lavelle%2C%20I%27m%20interested%20in%20the%20project.`,
                    "_blank"
                  )
                }
              >
                WhatsApp Chat
              </Button>
              <Button
                className="rounded-full bg-[#c88e71] text-black hover:bg-[#ddb09a]"
                onClick={() => scrollToSection("contact")}
              >
                Request Callback
              </Button>
            </div>

            <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 lg:hidden">
              {links.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="rounded-2xl bg-white/5 px-4 py-3 text-left text-white/80 hover:bg-white/10"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="space-y-24 pb-24">
          <div id="home">
            <Hero onNavigate={scrollToSection} onImageClick={setSelectedImage} />
          </div>
          <AboutSection />
          <ResidencesSection onImageClick={setSelectedImage} />
          <InteriorShowcase />
          <AmenitiesSection />
          <GallerySection onImageClick={setSelectedImage} />
          <ContactSection />
        </main>
      </div>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />

      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${siteSettings.waNumber}?text=Hello%20Lavelle%2C%20I%27m%20interested%20in%20the%20project.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-[#25D366] px-5 py-4 font-medium text-black shadow-2xl shadow-black/30 transition hover:scale-[1.02]"
      >
        <MessageCircle className="h-5 w-5" /> WhatsApp Direct Chat
      </a>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6 lg:px-8">
          <div>
            <div className="mb-6">
              <img 
                src="/logo.svg" 
                alt="Lavelle" 
                className="h-32 w-auto object-contain" 
              />
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/60">
              Premium luxury residences in Kampala, Uganda. Sophisticated design, world-class amenities, and a sales experience built to move fast.
            </p>
          </div>
          <div>
            <div className="mb-3 font-semibold">Pages</div>
            <div className="grid gap-2 text-sm text-white/60">
              {[["about", "About"], ["residences", "Residences"], ["interiors", "Interiors"], ["amenities", "Amenities"], ["gallery", "Gallery"], ["contact", "Contact"]].map(
                ([id, label]) => (
                  <button key={id} className="text-left hover:text-white" onClick={() => scrollToSection(id)}>
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <div className="mb-3 font-semibold">Contact</div>
            <div className="grid gap-2 text-sm text-white/60">
              <div>{siteSettings.contactPhone}</div>
              <div>Kampala, Uganda</div>
              <div>Private viewings available</div>
              <button
                className="text-left text-[#efc2aa] hover:text-[#ddb09a]"
                onClick={() =>
                  window.open(
                    `https://wa.me/${siteSettings.waNumber}?text=Hello%20Lavelle%2C%20I%27m%20interested%20in%20the%20project.`,
                    "_blank"
                  )
                }
              >
                Chat on WhatsApp →
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Lavelle Luxury Residences. All rights reserved.
        </div>
      </footer>
    </motion.div>
      )}
    </AnimatePresence>
    </SettingsContext.Provider>
  );
}
