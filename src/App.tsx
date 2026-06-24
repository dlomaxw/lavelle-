import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import {
  Building2,
  Phone,
  Mail,
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
  Download,
  FileText,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  Factory,
  Plane,
  Landmark,
  Trees,
  Zap,
  Droplets,
  ArrowUpDown,
  Baby,
  CreditCard,
  CalendarCheck,
  Lock,
  HardHat,
  Hammer,
  KeyRound,
  PlayCircle,
  Mountain,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InteriorShowcase from "@/components/InteriorShowcase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { emailLeadNotification } from "@/lib/notify";
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
  waNumber: "256791272727",
  contactPhone: "+256 791 272727",
  contactEmail: "lavellebugolobi@outlook.com",
  contactEmail2: "despotic62@gmail.com",
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
    name: "2 BHK Residences",
    units: 15,
    beds: 2,
    baths: 2,
    size: "118 sqm",
    status: "15 Units",
    image: "/exterior/lavelle-balcony-detail.jpg",
    alt: "2 bedroom apartment for sale in Bugolobi Kampala — panoramic terraces at Lavelle, 118 sqm from $168,000",
    blurb:
      "Open-plan two-bedroom homes with warm earthy finishes, panoramic glazing, and private terrace living.",
  },
  {
    id: 2,
    name: "3 BHK Residences",
    units: 16,
    beds: 3,
    baths: 3,
    size: "176 sqm",
    status: "16 Units",
    image: "/exterior/lavelle-building-day.jpg",
    alt: "3 bedroom apartment for sale in Bugolobi Kampala — Lavelle luxury residence tower, 176 sqm from $245,000",
    blurb:
      "Generous three-bedroom family residences designed for long-term comfort, privacy, and elevated everyday living.",
  },
  {
    id: 3,
    name: "Penthouses",
    units: 4,
    beds: 4,
    baths: 4,
    size: "248 sqm",
    status: "4 Units",
    image: "/exterior/lavelle-rooftop-aerial.jpg",
    alt: "Penthouse for sale in Kampala — rooftop terraces of Lavelle Bugolobi, 248 sqm from $390,000",
    blurb:
      "Four exclusive top-floor penthouses with statement interiors, entertaining zones, and sweeping skyline-facing terraces.",
  },
];

const amenities = [
  { icon: ArrowUpDown, title: "3 High-Speed Elevators", text: "Three passenger elevators serving every floor — no waiting, no queues." },
  { icon: Car, title: "Podium & Basement Parking", text: "Generous controlled-access resident and visitor parking across two podium levels." },
  { icon: ShieldCheck, title: "24/7 Security & CCTV", text: "Gated perimeter, manned gatehouse, and round-the-clock monitoring." },
  { icon: Dumbbell, title: "Fitness Studio", text: "Contemporary training space for daily wellness." },
  { icon: Baby, title: "Children's Play Area", text: "Dedicated, safely fenced outdoor play zone within the gardens." },
  { icon: Trees, title: "Landscaped Gardens & Lounge", text: "Garden seating courts, pergolas, and a fire-pit lounge wrapped in greenery." },
  { icon: Zap, title: "Full Backup Power", text: "Standby generator power keeps every residence and amenity running." },
  { icon: Droplets, title: "Water Reserves", text: "Rooftop reserve tanks and treatment for uninterrupted water supply." },
  { icon: Users, title: "Resident Lounge & Reception", text: "Refined double-height lobby and shared spaces for meetings and downtime." },
  { icon: Building2, title: "Boutique Community", text: "Only 35 residences — a private, low-density address." },
  { icon: Sparkles, title: "Fully Managed Building", text: "Professional facilities management and concierge-style services." },
];

const exteriorGallery = [
  {
    image: "/exterior/lavelle-building-day.jpg",
    title: "Lavelle by Day",
    description: "The full architectural form — bronze portal frames, planted balconies, and the illuminated Lavelle crown rising above Bugolobi."
  },
  {
    image: "/exterior/lavelle-tower-portrait.jpg",
    title: "The Tower",
    description: "Twelve levels of layered stone, timber, and glass — the complete Lavelle silhouette above the open podium decks."
  },
  {
    image: "/exterior/lavelle-front-elevation.jpg",
    title: "Front Elevation",
    description: "The signature facade: sculpted timber-clad frames wrapping cascading green terraces across every level."
  },
  {
    image: "/exterior/lavelle-facade-low-angle.jpg",
    title: "Rising Above",
    description: "A street-level perspective of the tower's dramatic verticality, framed louvres, and panoramic glass balustrades."
  },
  {
    image: "/exterior/lavelle-entrance-dusk.jpg",
    title: "Arrival at Dusk",
    description: "The gated entrance and porte-cochère glowing warmly at sunset, with the backlit Lavelle monument sign welcoming you home."
  },
  {
    image: "/exterior/lavelle-gate-evening.jpg",
    title: "The Gatehouse",
    description: "Street view of the illuminated Lavelle stone sign, guarded entry, and the covered drop-off beyond."
  },
  {
    image: "/exterior/lavelle-aerial-entrance.jpg",
    title: "The Entrance Court",
    description: "An aerial look at the drop-off canopy, guarded gate, and landscaped arrival sequence beneath the green facade."
  },
  {
    image: "/exterior/lavelle-entrance-aerial-dusk.jpg",
    title: "Evening Arrival",
    description: "Dusk settles over the entrance court — edge-lit parking bays, the basement ramp, and gardens glowing at the perimeter."
  },
  {
    image: "/exterior/lavelle-rooftop-aerial.jpg",
    title: "The Rooftop Crown",
    description: "A bird's-eye view over the rooftop terraces, skylight atrium, and dedicated water reserve farm serving the building."
  },
  {
    image: "/exterior/lavelle-parking-deck.jpg",
    title: "Podium Parking",
    description: "Wide, edge-lit parking bays on the open podium deck — generous space for residents and guests, steps from the elevators."
  },
  {
    image: "/exterior/lavelle-garden-walkway.jpg",
    title: "Garden Walkway",
    description: "The landscaped promenade along the podium edge — lawn courts, a fire-pit circle, and benches under flowering trees."
  },
  {
    image: "/exterior/lavelle-playground.jpg",
    title: "Children's Playground",
    description: "A safely fenced play court with swings, slides, and pergola seating where parents can watch from the shade."
  }
];

const interiorGallery = [
  {
    image: "/renders/interior-living-1.jpg",
    title: "The Main Salon",
    description: "Bookmatched Calacatta panels, curved bouclé seating, and bespoke ring lighting in the open-plan living lounge."
  },
  {
    image: "/renders/interior-living-2.jpg",
    title: "The Dining Hall",
    description: "A formal dining suite in Nero Marquina marble framed by sculptural mirrors and raw-pigment artwork."
  },
  {
    image: "/renders/interior-kitchen.jpg",
    title: "Culinary Studio",
    description: "Warm walnut joinery and cream lacquered cabinetry with fully integrated smart appliances."
  },
  {
    image: "/renders/interior-bedroom-1.jpg",
    title: "Master Sanctuary",
    description: "Fluted oak bedhead wall, ambient sconces, and layered earthy textiles beneath 3.2-metre ceilings."
  },
  {
    image: "/renders/interior-bedroom-2.jpg",
    title: "Junior Suite",
    description: "Vertical timber paneling and soft pendant lighting create a calm, restorative guest retreat."
  },
  {
    image: "/renders/interior-closet.jpg",
    title: "Dressing Closet",
    description: "Concealed wardrobe systems, a back-lit vanity mirror, and herringbone oak parquet underfoot."
  },
  {
    image: "/renders/interior-bathroom-1.jpg",
    title: "Wellness Bath",
    description: "A freestanding stone tub on an oak platform with slate-textured walls and a recessed rainfall shower."
  },
  {
    image: "/renders/interior-bathroom-2.jpg",
    title: "Powder Vanity",
    description: "A floating timber console, vessel basin, and halo-lit mirror in spa-inspired earthy tones."
  }
];

const locationSpots = [
  { icon: ShoppingBag, name: "Village Mall, Bugolobi", time: "4 min", detail: "Shopping, dining & daily essentials" },
  { icon: Factory, name: "Industrial Area", time: "6 min", detail: "Kampala's business & enterprise hub" },
  { icon: GraduationCap, name: "Top Schools", time: "8 min", detail: "International & primary schools nearby" },
  { icon: Landmark, name: "Kampala CBD", time: "12 min", detail: "Banks, offices & city centre" },
  { icon: ShoppingBag, name: "Kololo & Acacia Mall", time: "14 min", detail: "Premium lifestyle & leisure district" },
  { icon: Plane, name: "Entebbe Int'l Airport", time: "45 min", detail: "Direct via the Expressway" },
];

const paymentPlans = [
  {
    icon: CheckSquare,
    title: "Reserve Your Residence",
    text: "Secure your preferred unit with a simple booking deposit and personalised offer letter.",
  },
  {
    icon: CreditCard,
    title: "Structured Installments",
    text: "Spread payments across construction milestones in a schedule shaped around your cash flow.",
  },
  {
    icon: CalendarCheck,
    title: "Settle on Handover",
    text: "Clear the comfortable balance at completion and collect the keys to your new home.",
  },
];

const whyLavelle = [
  { icon: Building2, text: "A boutique community of only 35 residences — private and low-density." },
  { icon: Sparkles, text: "Signature earthy interiors with 3.2M ceilings and panoramic terraces." },
  { icon: MapPin, text: "Prime Bugolobi address — minutes from malls, schools, and the CBD." },
  { icon: ArrowUpDown, text: "3 high-speed elevators, full backup power, and water reserves." },
  { icon: Trees, text: "Cascading green facade and landscaped gardens on every side." },
  { icon: CreditCard, text: "Flexible payment plans tailored around you." },
];

// ─── Construction progress (real site photos, June 2026) ──────────────────────

const constructionPhotos = [
  {
    image: "/construction/construction-floor-plate-aerial.jpg",
    title: "Lower Floor Slab Cast",
    alt: "Lavelle Bugolobi construction progress June 2026 — aerial of the cast concrete floor slab and column grid in Kampala",
  },
  {
    image: "/construction/construction-formwork-rebar.jpg",
    title: "Formwork & Reinforcement",
    alt: "Lavelle Bugolobi construction — timber formwork and steel reinforcement for the next floor of the Kampala apartment building",
  },
  {
    image: "/construction/construction-lower-floor-walls.jpg",
    title: "Walls Going Up",
    alt: "Lavelle Bugolobi construction progress — masonry walls and columns rising on the lower floors in Kampala, Uganda",
  },
  {
    image: "/construction/construction-columns-slab.jpg",
    title: "Columns & Crew On Site",
    alt: "Lavelle Bugolobi building site — reinforced columns and slab with the construction crew working in Bugolobi, Kampala",
  },
  {
    image: "/construction/construction-floor-walls-rooms.jpg",
    title: "Apartment Layouts Forming",
    alt: "Lavelle Bugolobi construction — block walls forming the apartment room layouts on a residential floor in Kampala",
  },
  {
    image: "/construction/construction-superstructure-aerial.jpg",
    title: "Superstructure Underway",
    alt: "Lavelle Bugolobi superstructure under construction June 2026 — aerial view of the apartment building in Bugolobi, Kampala",
  },
];

const constructionViews = [
  {
    image: "/construction/view-lake-victoria-islands.jpg",
    title: "Lake Victoria Views",
    alt: "View of Lake Victoria and islands from Lavelle Bugolobi — apartments for sale in Kampala with lake views",
  },
  {
    image: "/construction/view-lake-victoria-wide.jpg",
    title: "Across the Water",
    alt: "Panoramic Lake Victoria view from the Lavelle Bugolobi apartment site in Kampala, Uganda",
  },
  {
    image: "/construction/view-kampala-skyline.jpg",
    title: "Kampala Skyline",
    alt: "Kampala city skyline seen from Lavelle Bugolobi — luxury apartments and penthouses with city views",
  },
  {
    image: "/construction/view-kampala-hills.jpg",
    title: "The Kampala Hills",
    alt: "Rolling Kampala hills panorama from the upper floors of Lavelle Bugolobi in Kampala, Uganda",
  },
];

const constructionTimeline = [
  { icon: CheckCircle2, label: "Land & Foundation", state: "done" as const },
  { icon: HardHat, label: "Superstructure", state: "active" as const },
  { icon: Hammer, label: "Finishing & Fit-out", state: "upcoming" as const },
  { icon: KeyRound, label: "Handover", state: "upcoming" as const },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

// Word-by-word rising reveal, triggered when scrolled into view.
function AnimatedWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.045 } },
      }}
      className={className}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top pb-1 -mb-1">
          <motion.span
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="inline-block"
          >
            {word}{" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <motion.p
        initial={{ opacity: 0, x: -16, letterSpacing: "0.2em" }}
        whileInView={{ opacity: 1, x: 0, letterSpacing: "0.35em" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-xs font-semibold uppercase text-[#c88e71]"
      >
        {eyebrow}
      </motion.p>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
        <AnimatedWords text={title} />
      </h2>
      {text ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="text-sm leading-7 text-white/65 md:text-base"
        >
          {text}
        </motion.p>
      ) : null}
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

// ─── Register Your Interest popup ─────────────────────────────────────────────

function RegisterInterestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = React.useContext(SettingsContext);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setStatus("loading");
    try {
      await addDoc(collection(db, "leads"), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        unit: "",
        budget: "",
        timeline: "",
        message: "Registered interest via welcome popup",
        siteVisitRequested: false,
        preferredVisitDate: null,
        source: "Register Interest Popup",
        status: "New",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      // Fire-and-forget email copy to the sales inboxes
      emailLeadNotification({
        name: form.name,
        phone: form.phone,
        email: form.email,
        source: "Register Interest Popup",
      });
    } catch (err) {
      console.error("Firestore error:", err);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 240 }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#121216] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            <div className="relative h-36 w-full overflow-hidden">
              <img
                src="/exterior/lavelle-entrance-dusk.jpg"
                alt="Gated entrance of Lavelle Bugolobi luxury apartments in Kampala at dusk"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-black/30 to-transparent" />
              <button
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-md transition hover:bg-black/80 hover:text-white"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6 pt-4">
              {status === "success" ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <CheckSquare className="h-7 w-7" />
                  </div>
                  <h3 className="font-cinzel text-xl tracking-wider">Thank You!</h3>
                  <p className="text-sm text-white/60">
                    Your interest is registered. Our sales team will reach out shortly.
                  </p>
                  <Button
                    className="rounded-full bg-[#c88e71] px-6 text-black hover:bg-[#ddb09a]"
                    onClick={onClose}
                  >
                    Explore Lavelle
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c88e71]">Welcome to Lavelle</p>
                    <h3 className="font-cinzel text-2xl tracking-wider">Register Your Interest</h3>
                    <p className="text-xs text-white/55">
                      Only 35 residences. Leave your details and be the first to receive prices, plans, and availability.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="h-11 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                      placeholder="Full name *"
                    />
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className="h-11 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                      placeholder="Phone number *"
                    />
                    <Input
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="h-11 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                      placeholder="Email address"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-300">Something went wrong — please try again or use WhatsApp below.</p>
                  )}

                  <Button
                    className="w-full rounded-full bg-[#c88e71] py-5 text-sm font-semibold text-black hover:bg-[#ddb09a] disabled:opacity-60"
                    onClick={handleSubmit}
                    disabled={status === "loading" || !form.name || !form.phone}
                  >
                    {status === "loading" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Register My Interest
                  </Button>

                  {/* Direct contact channels */}
                  <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                    <a
                      href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 p-3 text-center transition hover:bg-white/10"
                    >
                      <Phone className="h-4 w-4 text-[#efc2aa]" />
                      <span className="text-[9px] text-white/60">Call Us</span>
                    </a>
                    <a
                      href={`mailto:${settings.contactEmail}?cc=${settings.contactEmail2}&subject=Lavelle%20Inquiry`}
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 p-3 text-center transition hover:bg-white/10"
                    >
                      <Mail className="h-4 w-4 text-[#efc2aa]" />
                      <span className="text-[9px] text-white/60">Email</span>
                    </a>
                    <a
                      href={`https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20I%27d%20like%20to%20register%20my%20interest.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 p-3 text-center transition hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      <span className="text-[9px] text-white/60">WhatsApp</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
            Refined Urban Living in Bugolobi, Kampala
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
              35 bespoke 2 &amp; 3 bedroom apartments and penthouses in Bugolobi, Kampala.
            </motion.div>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              className="text-xs md:text-sm leading-relaxed text-white/60 text-center md:text-left max-w-lg font-light"
            >
              Situated in Bugolobi's most desirable enclave, Lavelle combines modern architectural form with a signature earthy interior theme, 3.2M ceilings, and panoramic terraces — Kampala's premier boutique residence.
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
              Book a Private Viewing
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            className="flex items-center justify-center md:justify-start gap-6 pt-6 border-t border-white/5 max-w-md mx-auto md:mx-0 text-center md:text-left"
          >
            {[
              ["35", "RESIDENCES"],
              ["03", "ELEVATORS"],
              ["3.2M", "CEILING HEIGHT"],
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
                <h4 className="text-sm font-semibold text-white">Lavelle 3 BHK Signature</h4>
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

function AboutSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" id="about">
      <Card className="rounded-[1.8rem] border-white/10 bg-[#121216] text-white">
        <CardContent className="p-8">
          <SectionTitle
            eyebrow="About Us"
            title="Lavelle — a boutique address in the heart of Bugolobi"
            text="Lavelle is an exclusive collection of 35 bespoke residences rising above Bugolobi's greenest enclave. Architecturally bold yet quietly refined, it pairs a signature earthy interior theme with cascading planted terraces, 3.2-metre ceilings, and panoramic views — a home built for those who value design, comfort, and enduring value."
          />
        </CardContent>
      </Card>
      <Card className="rounded-[1.8rem] border-white/10 bg-white/5 text-white">
        <CardContent className="grid gap-6 p-8 md:grid-cols-2">
          {[
            [
              "Prime location",
              "Minutes from Village Mall, the Industrial Area, top schools, and the Kampala CBD.",
            ],
            [
              "Boutique by design",
              "Only 35 homes — 2 BHK, 3 BHK, and penthouse residences — for a private, low-density community.",
            ],
            [
              "Signature interiors",
              "Earthy tones and natural finishes complementing the green backdrop, with 3.2M ceilings throughout.",
            ],
            [
              "Built to last",
              "Three elevators, full backup power, water reserves, and professional building management.",
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

function WhyLavelleSection({ onImageClick }: { onImageClick: (img: string) => void }) {
  return (
    <section className="space-y-8" id="why">
      <SectionTitle
        eyebrow="Why Lavelle?"
        title="A residence that answers every question"
        text="From the architecture to the address, every decision at Lavelle was made to protect your lifestyle and your investment."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] items-center">
        {/* Animated feature image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group cursor-pointer"
          onClick={() => onImageClick("/exterior/lavelle-front-elevation.jpg")}
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-[#c88e71]/10 blur-2xl pointer-events-none" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/60">
            <motion.img
              src="/exterior/lavelle-front-elevation.jpg"
              alt="Lavelle Bugolobi front elevation — boutique building of 35 luxury apartments and penthouses for sale in Kampala"
              className="h-[420px] md:h-[520px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Floating stat badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md"
            >
              <div className="font-cinzel text-lg text-white">35</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/50">Residences Only</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute right-5 bottom-16 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md"
            >
              <div className="font-cinzel text-lg text-[#efc2aa]">3.2M</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/50">Ceiling Height</div>
            </motion.div>
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#efc2aa]">
              <ZoomIn className="h-3.5 w-3.5" /> Tap to expand
            </div>
          </div>
        </motion.div>

        {/* Reasons list */}
        <div className="grid gap-4">
          {whyLavelle.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-[#c88e71]/30 hover:bg-white/10 hover:translate-x-2"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm leading-6 text-white/75">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ResidencesSection({ onImageClick }: { onImageClick: (img: string) => void }) {
  const settings = React.useContext(SettingsContext);
  return (
    <section className="space-y-8" id="residences">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="The Residences"
          title="35 bespoke residences. Three ways to live."
          text="A curated unit mix of two-bedroom homes, three-bedroom family residences, and four crowning penthouses — each with a private terrace and the Lavelle signature interior theme."
        />
        {/* Unit mix summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 rounded-[1.4rem] border border-white/10 bg-white/5 px-6 py-4 self-start"
        >
          {[
            ["15", "2 BHK"],
            ["16", "3 BHK"],
            ["04", "PENTHOUSES"],
          ].map(([val, label], idx) => (
            <div key={label} className="flex items-center gap-5">
              {idx > 0 && <div className="h-7 w-[1px] bg-white/10" />}
              <div className="text-center">
                <div className="font-cinzel text-xl text-[#efc2aa]">{val}</div>
                <div className="text-[9px] font-semibold tracking-[0.2em] text-white/45">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

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
                  alt={item.alt}
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
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">{item.name}</h3>
                  <p className="text-sm leading-7 text-white/65">{item.blurb}</p>
                  <div className="pt-1">
                    <motion.span
                      initial={{ opacity: 0, letterSpacing: "0.1em" }}
                      whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="text-[10px] font-semibold uppercase text-white/40"
                    >
                      Starting from
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", damping: 18, stiffness: 200, delay: 0.3 }}
                      className="text-2xl font-semibold text-[#efc2aa]"
                    >
                      {item.id === 1 ? settings.residence1Price : item.id === 2 ? settings.residence2Price : settings.residence3Price}
                    </motion.div>
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

      {/* Availability CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[1.8rem] border border-[#c88e71]/25 bg-gradient-to-r from-[#c88e71]/15 via-[#121216] to-[#121216] p-7 md:p-9"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              <AnimatedWords text="Call and inquire about your favourite unit's availability today!" />
            </h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-white/60"
            >
              Units are allocated on a first-come, first-served basis — speak to our sales team now.
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>
              <Button className="rounded-full bg-[#c88e71] px-6 py-5 text-black hover:bg-[#ddb09a]">
                <Phone className="mr-2 h-4 w-4" /> {settings.contactPhone}
              </Button>
            </a>
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-6 py-5 text-white hover:bg-white/10"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Calendar className="mr-2 h-4 w-4" /> Book a Private Viewing
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function AmenitiesSection() {
  return (
    <section className="space-y-8" id="amenities">
      <SectionTitle
        eyebrow="Amenities"
        title="Every comfort, considered"
        text="From three high-speed elevators to landscaped gardens and full backup utilities, the Lavelle experience is crafted around effortless daily living."
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
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
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

function ConstructionSection({ onImageClick }: { onImageClick: (img: string) => void }) {
  const settings = React.useContext(SettingsContext);
  const [tab, setTab] = useState<"progress" | "views">("progress");
  const photos = tab === "progress" ? constructionPhotos : constructionViews;

  return (
    <section className="space-y-8" id="construction">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          eyebrow="Construction Progress"
          title="Watch Lavelle take shape"
          text="These are real photos from the Lavelle site in Bugolobi, captured in June 2026. The foundation is complete and the superstructure is now rising — buy early, off-plan, at today's best prices."
        />
        {/* Live status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 self-start rounded-full border border-[#c88e71]/30 bg-[#c88e71]/10 px-5 py-3"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c88e71] opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c88e71]" />
          </span>
          <div className="text-left">
            <div className="text-xs font-semibold text-white">Under Construction</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Updated June 2026</div>
          </div>
        </motion.div>
      </div>

      {/* Build timeline */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {constructionTimeline.map((step, i) => {
          const Icon = step.icon;
          const done = step.state === "done";
          const active = step.state === "active";
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-[1.3rem] border p-5 ${
                active
                  ? "border-[#c88e71]/40 bg-[#c88e71]/10"
                  : done
                  ? "border-emerald-400/25 bg-emerald-400/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                  active ? "bg-[#c88e71] text-black" : done ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white/50"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-white">{step.label}</div>
              <div
                className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                  active ? "text-[#efc2aa]" : done ? "text-emerald-300/80" : "text-white/40"
                }`}
              >
                {done ? "Complete" : active ? "In Progress" : "Upcoming"}
              </div>
              {active && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#c88e71] to-[#efc2aa]"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Drone video */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="absolute -inset-3 rounded-[2rem] bg-[#c88e71]/8 blur-2xl pointer-events-none" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl shadow-black/60">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/construction/construction-superstructure-aerial.jpg"
            className="h-[280px] w-full object-cover md:h-[520px]"
          >
            <source src="/construction/lavelle-construction-progress.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md">
            <PlayCircle className="h-4 w-4 text-[#efc2aa]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Site Drone Tour · June 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Progress / Views toggle */}
      <div className="flex gap-1.5 self-start rounded-full border border-white/10 bg-black/40 p-1.5 w-fit">
        {([["progress", "Site Progress", HardHat], ["views", "The Views", Mountain]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
              tab === key
                ? "bg-[#c88e71] text-black shadow-lg shadow-[#c88e71]/15"
                : "text-white/55 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.image}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative cursor-pointer overflow-hidden rounded-[1.4rem] border border-white/10"
            onClick={() => onImageClick(photo.image)}
          >
            <img
              src={photo.image}
              alt={photo.alt}
              loading="lazy"
              className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/20">
              <ZoomIn className="h-9 w-9 scale-50 text-white opacity-0 drop-shadow-xl transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                {tab === "progress" ? (
                  <HardHat className="h-3.5 w-3.5 text-[#efc2aa]" />
                ) : (
                  <Mountain className="h-3.5 w-3.5 text-[#efc2aa]" />
                )}
                <span className="text-sm font-semibold text-white drop-shadow">{photo.title}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-5"
      >
        <p className="text-sm text-white/70">
          Want the latest site update or a guided visit? Our team will walk you through every stage.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            className="rounded-full bg-[#c88e71] px-6 text-black hover:bg-[#ddb09a]"
            onClick={() =>
              window.open(
                `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20please%20share%20the%20latest%20construction%20update.`,
                "_blank"
              )
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Get Latest Update
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Calendar className="mr-2 h-4 w-4" /> Book a Site Visit
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function LocationSection() {
  const settings = React.useContext(SettingsContext);
  const [isMapInteractive, setIsMapInteractive] = useState(false);

  return (
    <section className="space-y-8" id="location">
      <SectionTitle
        eyebrow="Location & Connectivity"
        title="Everything you need, minutes away"
        text="Lavelle sits in Bugolobi — one of Kampala's most connected addresses. Daily life, business, schooling, and travel are all a short drive from your door."
      />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
        {/* Left Column: Connectivity Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {locationSpots.map((spot, i) => {
            const Icon = spot.icon;
            return (
              <motion.div
                key={spot.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              >
                <Card className="rounded-[1.5rem] border-white/10 bg-white/5 text-white h-full transition-all duration-300 hover:border-[#c88e71]/30 hover:bg-white/10 hover:-translate-y-0.5 group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1">
                        <Car className="h-3.5 w-3.5 text-[#efc2aa]" />
                        <span className="font-cinzel text-xs font-semibold text-white tracking-wide">{spot.time}</span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{spot.name}</h3>
                    <p className="mt-1 text-xs text-white/60">{spot.detail}</p>
                    {/* Animated drive-time bar */}
                    <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.2 + (i % 2) * 0.1, ease: "easeOut" }}
                        style={{ transformOrigin: "left", width: `${Math.min(parseInt(spot.time) * 2, 100)}%` }}
                        className="h-full bg-gradient-to-r from-[#c88e71] to-[#efc2aa]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Map Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative h-[480px] lg:h-auto min-h-[480px] rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden shadow-2xl group flex flex-col"
        >
          <iframe
            src="https://maps.google.com/maps?q=0.309984,32.623613&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full border-0 transition-all duration-700"
            style={{
              filter: isMapInteractive 
                ? "none" 
                : "grayscale(1) invert(0.9) contrast(1.2) brightness(0.85) hue-rotate(10deg)",
              pointerEvents: isMapInteractive ? "auto" : "none",
            }}
            allowFullScreen
            loading="lazy"
            title="Lavelle Location Map"
          />

          <AnimatePresence>
            {!isMapInteractive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 2.4],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className="absolute h-16 w-16 rounded-full border-2 border-[#efc2aa]/40 bg-[#efc2aa]/5"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.8],
                        opacity: [0.7, 0]
                      }}
                      transition={{
                        duration: 2.2,
                        delay: 0.7,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className="absolute h-16 w-16 rounded-full border-2 border-[#c88e71]/40 bg-[#c88e71]/5"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.2],
                        opacity: [0.9, 0]
                      }}
                      transition={{
                        duration: 2.2,
                        delay: 1.4,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className="absolute h-16 w-16 rounded-full border-2 border-[#efc2aa]/50 bg-[#efc2aa]/10"
                    />

                    <motion.div
                      animate={{
                        y: [0, -12, 0]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <motion.div
                        animate={{
                          scale: [0.7, 1.3, 0.7],
                          opacity: [0.8, 0.2, 0.8]
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -bottom-1 h-1.5 w-5 rounded-full bg-black/60 blur-[1.5px]"
                      />
                      
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#c88e71] to-[#efc2aa] shadow-xl border border-white/20">
                        <MapPin className="h-6 w-6 text-black" fill="black" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="relative mt-auto w-full pointer-events-auto">
                  <div className="rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
                    <div>
                      <h4 className="font-cinzel text-[#efc2aa] font-semibold tracking-wide text-base">Lavelle Residences</h4>
                      <p className="text-xs text-white/60 mt-1">Bugolobi, Kampala — Uganda</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        onClick={() => setIsMapInteractive(true)}
                        className="flex-1 sm:flex-initial rounded-full bg-gradient-to-r from-[#c88e71] to-[#efc2aa] text-black font-semibold hover:opacity-90 transition-all duration-300 text-xs px-4 py-2"
                      >
                        Explore Map
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open("https://maps.app.goo.gl/DjXtxFmKRbyxX39R6?g_st=aw", "_blank")}
                        className="flex-1 sm:flex-initial rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs px-4 py-2"
                      >
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isMapInteractive && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsMapInteractive(false)}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/85 px-3.5 py-2 text-xs font-semibold text-white hover:bg-black hover:border-white/20 transition-all shadow-lg pointer-events-auto"
            >
              <Lock className="h-3.5 w-3.5 text-[#efc2aa]" />
              Lock Map
            </motion.button>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-5"
      >
        <div className="flex items-center gap-3 text-sm text-white/70">
          <MapPin className="h-5 w-5 text-[#efc2aa]" />
          Bugolobi, Kampala — Uganda
        </div>
        <Button
          variant="outline"
          className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          onClick={() =>
            window.open(
              `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20please%20share%20the%20exact%20location%20pin.`,
              "_blank"
            )
          }
        >
          <MessageCircle className="mr-2 h-4 w-4" /> Request Location Pin
        </Button>
      </motion.div>
    </section>
  );
}

function PaymentPlansSection() {
  const settings = React.useContext(SettingsContext);
  return (
    <section className="space-y-8" id="payments">
      <SectionTitle
        eyebrow="Payment Plans"
        title="Flexible plans, built around you"
        text="Own at Lavelle on a schedule that suits you. Every plan is tailored individually — from booking to handover."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {paymentPlans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="relative rounded-[1.6rem] border-white/10 bg-white/5 text-white h-full overflow-hidden transition-all duration-300 hover:border-[#c88e71]/30 hover:bg-white/10 hover:-translate-y-1">
                <CardContent className="p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-cinzel text-3xl text-white/10">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{plan.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Discuss plan + downloads */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="relative overflow-hidden rounded-[1.8rem] border border-[#c88e71]/25 bg-gradient-to-r from-[#c88e71]/15 via-[#121216] to-[#121216] p-7 md:p-9 flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            <AnimatedWords text="Message us to discuss your plan today!" />
          </h3>
          <p className="mt-1.5 text-sm text-white/60">
            Share your budget and timeline — our team will structure a flexible payment plan around you.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              className="rounded-full bg-[#25D366] px-6 py-5 font-semibold text-black hover:bg-[#3ee07c]"
              onClick={() =>
                window.open(
                  `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20I%27d%20like%20to%20discuss%20a%20flexible%20payment%20plan.`,
                  "_blank"
                )
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Discuss My Plan
            </Button>
            <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>
              <Button
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 px-6 py-5 text-white hover:bg-white/10"
              >
                <Phone className="mr-2 h-4 w-4" /> Call Sales
              </Button>
            </a>
          </div>
        </div>

        {/* Downloads */}
        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7 space-y-4" id="downloads">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c88e71]">Downloads</p>
            <h3 className="text-lg font-semibold text-white">Take Lavelle with you</h3>
          </div>
          <a
            href="https://drive.google.com/file/d/1POnYabBNv8UtTHvxgAhjbyzhjVjDZfNw/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-[#c88e71]/30 hover:bg-black/50 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Project Brochure</div>
                <div className="text-xs text-white/50">PDF · Full project overview</div>
              </div>
            </div>
            <Download className="h-4 w-4 text-white/40 transition group-hover:text-[#efc2aa] group-hover:translate-y-0.5" />
          </a>
          <a
            href="https://drive.google.com/file/d/1SomwoHtHstNuJeeBMXCG4mcw-fO7N2pd/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-[#c88e71]/30 hover:bg-black/50 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Residence Booklet</div>
                <div className="text-xs text-white/50">PDF · Floor plans & finishes</div>
              </div>
            </div>
            <Download className="h-4 w-4 text-white/40 transition group-hover:text-[#efc2aa] group-hover:translate-y-0.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// One crossfading frame of the cinematic gallery. The scroll-driven transforms
// live here so exterior and interior sets can have different lengths without
// breaking the hook order in the parent.
function GalleryFrame({
  item,
  index,
  total,
  progress,
  onClick,
}: {
  item: { image: string; title: string };
  index: number;
  total: number;
  progress: any;
  onClick: () => void;
}) {
  const start = (index - 0.35) / total;
  const peakStart = index / total;
  const peakEnd = (index + 0.7) / total;
  const end = (index + 1.05) / total;

  // First image starts opaque, last image stays opaque at the end
  const opacityRange = [
    index === 0 ? 0 : start,
    index === 0 ? 0 : peakStart,
    index === total - 1 ? 1 : peakEnd,
    index === total - 1 ? 1 : end
  ];

  const opacity = useTransform(progress, opacityRange, [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.0, 1.08], { clamp: true });

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 w-full h-full cursor-pointer"
      onClick={onClick}
    >
      <img
        src={item.image}
        alt={`${item.title} — Lavelle Bugolobi luxury 2 & 3 bedroom apartments and penthouses, Kampala`}
        className="w-full h-full object-cover"
      />
      {/* Subtle vignetting shadow inside the viewport */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
    </motion.div>
  );
}

function GallerySection({ onImageClick }: { onImageClick: (img: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"exterior" | "interior">("exterior");
  const galleryItems = mode === "exterior" ? exteriorGallery : interiorGallery;

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

  const safeIndex = Math.min(activeIndex, galleryItems.length - 1);

  return (
    <div
      ref={containerRef}
      id="gallery"
      style={{ height: `${galleryItems.length * 50}vh` }}
      className="relative bg-[#060607] pt-12 pb-24 overflow-visible"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-8">

        {/* Sticky Header Section */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 z-20 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Cinematic Gallery"
            title="A walkthrough of life at Lavelle"
            text="Scroll down to immerse yourself — and switch between the architecture outside and the signature interiors within."
          />
          {/* Interior / Exterior toggle */}
          <div className="flex gap-1.5 self-start rounded-full border border-white/10 bg-black/40 p-1.5">
            {([["exterior", "Exterior", Building2], ["interior", "Interiors", Sparkles]] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  mode === key
                    ? "bg-[#c88e71] text-black shadow-lg shadow-[#c88e71]/15"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="w-full h-[55vh] md:h-[65vh] max-w-7xl mx-auto px-4 md:px-8 relative mt-6 mb-6">
          <div className="relative w-full h-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl">

            {/* Absolute Images with Crossfade and Zoom */}
            {galleryItems.map((item, i) => (
              <GalleryFrame
                key={`${mode}-${item.image}`}
                item={item}
                index={i}
                total={galleryItems.length}
                progress={scrollYProgress}
                onClick={() => onImageClick(item.image)}
              />
            ))}

            {/* Floating Info Card (Bottom-Left) */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-8 z-30 max-w-md bg-black/75 border border-white/10 rounded-[1.5rem] p-5 backdrop-blur-md shadow-2xl pointer-events-auto">
              <motion.div
                key={`${mode}-${safeIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-1.5 text-left"
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#efc2aa]">
                  {mode === "exterior" ? "Exterior" : "Interior"} Gallery — {safeIndex + 1} of {galleryItems.length}
                </span>
                <h3 className="text-lg font-bold text-white font-cinzel tracking-wider">
                  {galleryItems[safeIndex].title}
                </h3>
                <p className="text-xs text-white/65 leading-relaxed font-light">
                  {galleryItems[safeIndex].description}
                </p>
              </motion.div>
            </div>

            {/* Floating Zoom Button (Bottom-Right) */}
            <div className="absolute bottom-8 right-8 z-30 hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(galleryItems[safeIndex].image);
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
                {String(safeIndex + 1).padStart(2, "0")}
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
      // Fire-and-forget email copy to the sales inboxes
      emailLeadNotification({
        name: form.name,
        phone: form.phone,
        email: form.email,
        unit: form.unit,
        budget: form.budget,
        timeline: form.timeline,
        message: form.message,
        siteVisitRequested: form.siteVisitRequested ? "Yes" : "No",
        preferredVisitDate: form.preferredVisitDate || "—",
        source: "Website Form",
      });
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Firestore error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="space-y-8" id="contact">
      {/* Book a viewing banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10"
      >
        <img
          src="/exterior/lavelle-aerial-entrance.jpg"
          alt="Aerial view of the Lavelle Bugolobi entrance court — book a private viewing of apartments in Kampala"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="relative flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="space-y-2 max-w-xl">
            <motion.p
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#efc2aa]"
            >
              Experience It In Person
            </motion.p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              <AnimatedWords text="Book a private viewing today!" />
            </h3>
            <p className="text-sm text-white/65">
              Walk the site, feel the ceiling heights, and watch the sunset from a panoramic terrace. Private tours by appointment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              className="rounded-full bg-[#c88e71] px-6 py-5 font-semibold text-black hover:bg-[#ddb09a]"
              onClick={() =>
                window.open(
                  `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20I%27d%20like%20to%20book%20a%20private%20viewing.`,
                  "_blank"
                )
              }
            >
              <Calendar className="mr-2 h-4 w-4" /> Book a Viewing
            </Button>
            <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>
              <Button
                variant="outline"
                className="rounded-full border-white/20 bg-black/30 px-6 py-5 text-white backdrop-blur-md hover:bg-black/50"
              >
                <Phone className="mr-2 h-4 w-4" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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
              placeholder="Preferred unit (2 BHK / 3 BHK / Penthouse)"
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
            text="Call, email, or WhatsApp — whichever you prefer, our sales team responds fast."
          />
          <div className="space-y-4">
            {[
              [Phone, settings.contactPhone, "Sales line — call & inquire today", `tel:${settings.contactPhone.replace(/\s/g, "")}`],
              [Mail, settings.contactEmail, "Email our sales team", `mailto:${settings.contactEmail}?cc=${settings.contactEmail2}&subject=Lavelle%20Inquiry`],
              [MessageCircle, "WhatsApp direct chat", "Instant response", `https://wa.me/${settings.waNumber}?text=Hello%20Lavelle%2C%20I%27m%20interested%20in%20the%20project.`],
              [MapPin, "Bugolobi, Kampala — Uganda", "Project location", null],
              [Calendar, "Private viewings", "By appointment — book today", null],
            ].map(([Icon, title, sub, href]: any) => {
              const inner = (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c88e71]/15 text-[#efc2aa]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-white/60">{sub}</div>
                  </div>
                </>
              );
              return href ? (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
                >
                  {inner}
                </a>
              ) : (
                <div key={title} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                  {inner}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      </div>
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
        <img src="/logo.svg" alt="Lavelle Bugolobi — luxury apartments in Kampala" className="h-32 w-auto object-contain" />
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
  const [interestOpen, setInterestOpen] = useState(false);

  // Track every page visit in Firestore
  useEffect(() => {
    trackPageVisit();
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2200);
    // Show the Register Your Interest popup right after the loading screen
    // (once per browser session in production, on every reload in development)
    let interestTimer: ReturnType<typeof setTimeout> | undefined;
    const isDev = import.meta.env.DEV;
    if (isDev || !sessionStorage.getItem("lavelle_interest_shown")) {
      interestTimer = setTimeout(() => {
        setInterestOpen(true);
        if (!isDev) {
          sessionStorage.setItem("lavelle_interest_shown", "1");
        }
      }, 3400);
    }    // Load Settings
    const unsub = onSnapshot(doc(db, "siteSettings", "general"), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(prev => ({ ...prev, ...docSnap.data() as typeof DEFAULT_SETTINGS }));
      }
    });

    return () => {
      clearTimeout(timer);
      if (interestTimer) clearTimeout(interestTimer);
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
    ["construction", "Progress"],
    ["location", "Location"],
    ["payments", "Payments"],
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
                alt="Lavelle Bugolobi — 2 & 3 bedroom apartments and penthouses in Kampala"
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

            <div className="hidden items-center gap-3 xl:flex">
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
                onClick={() => setInterestOpen(true)}
              >
                Register Interest
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
              <button
                onClick={() => { setMobileOpen(false); setInterestOpen(true); }}
                className="rounded-2xl bg-[#c88e71] px-4 py-3 text-left font-semibold text-black"
              >
                Register Your Interest
              </button>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="space-y-24 pb-24">
          <div id="home">
            <Hero onNavigate={scrollToSection} onImageClick={setSelectedImage} />
          </div>
          <AboutSection />
          <WhyLavelleSection onImageClick={setSelectedImage} />
          <ResidencesSection onImageClick={setSelectedImage} />
          <InteriorShowcase />
          <AmenitiesSection />
          <GallerySection onImageClick={setSelectedImage} />
          <ConstructionSection onImageClick={setSelectedImage} />
          <LocationSection />
          <PaymentPlansSection />
          <ContactSection />
        </main>
      </div>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      <RegisterInterestModal open={interestOpen} onClose={() => setInterestOpen(false)} />

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
                alt="Lavelle Bugolobi luxury residences logo — apartments for sale in Kampala, Uganda"
                className="h-32 w-auto object-contain"
              />
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/60">
              35 bespoke luxury residences in Bugolobi, Kampala. Signature earthy interiors, 3.2M ceilings, panoramic terraces, and world-class amenities.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://drive.google.com/file/d/1POnYabBNv8UtTHvxgAhjbyzhjVjDZfNw/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" /> Brochure
              </a>
              <a
                href="https://drive.google.com/file/d/1SomwoHtHstNuJeeBMXCG4mcw-fO7N2pd/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <BookOpen className="h-3.5 w-3.5" /> Booklet
              </a>
            </div>
          </div>
          <div>
            <div className="mb-3 font-semibold">Pages</div>
            <div className="grid gap-2 text-sm text-white/60">
              {[["about", "About"], ["why", "Why Lavelle"], ["residences", "Residences"], ["interiors", "Interiors"], ["amenities", "Amenities"], ["gallery", "Gallery"], ["construction", "Construction Progress"], ["location", "Location"], ["payments", "Payment Plans"], ["contact", "Contact"]].map(
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
              <a href={`tel:${siteSettings.contactPhone.replace(/\s/g, "")}`} className="hover:text-white">{siteSettings.contactPhone}</a>
              <a href={`mailto:${siteSettings.contactEmail}?cc=${siteSettings.contactEmail2}&subject=Lavelle%20Inquiry`} className="hover:text-white">{siteSettings.contactEmail}</a>
              <div>Bugolobi, Kampala — Uganda</div>
              <div>Private viewings by appointment</div>
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
