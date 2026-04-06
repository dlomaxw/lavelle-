import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Search,
  Filter,
  Eye,
  LogOut,
  CheckCircle2,
  Loader2,
  Calendar,
  X,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  unit?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  siteVisitRequested?: boolean;
  preferredVisitDate?: string;
  source: string;
  createdAt?: { seconds: number } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");
  
  // UI States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Settings State
  const [siteSettings, setSiteSettings] = useState({
    heroVideoUrl: "https://www.youtube.com/embed/bQaBlh1N7IA?autoplay=1&mute=1&controls=0&loop=1&playlist=bQaBlh1N7IA&rel=0&playsinline=1&vq=hd1080",
    waNumber: "256791224477",
    contactPhone: "+256 791 224 477",
    residence1Price: "$168,000",
    residence2Price: "$245,000",
    residence3Price: "$390,000"
  });
  const [saveStatus, setSaveStatus] = useState("idle");

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin", { replace: true });
      } else {
        setUserEmail(user.email ?? "");
        setAuthChecked(true);
      }
    });
    return unsub;
  }, [navigate]);

  // Real-time leads
  useEffect(() => {
    if (!authChecked) return;
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeads(
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Lead, "id">) }))
      );
      setLeadsLoading(false);
    });
    return unsub;
  }, [authChecked]);

  // Site stats
  useEffect(() => {
    if (!authChecked) return;
    const unsub = onSnapshot(doc(db, "siteStats", "visitors"), (snapshot) => {
      if (snapshot.exists()) setVisitorCount(snapshot.data().count ?? 0);
    });
    return unsub;
  }, [authChecked]);

  // Settings
  useEffect(() => {
    if (!authChecked) return;
    const unsub = onSnapshot(doc(db, "siteSettings", "general"), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings((prev) => ({ ...prev, ...docSnap.data() }));
      }
    });
    return unsub;
  }, [authChecked]);

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      await setDoc(doc(db, "siteSettings", "general"), siteSettings, { merge: true });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  };

  const filtered = useMemo(
    () =>
      leads.filter((l) =>
        `${l.name} ${l.unit ?? ""} ${l.source}`.toLowerCase().includes(search.toLowerCase())
      ),
    [leads, search]
  );

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/admin", { replace: true });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#060607] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c88e71]" />
      </div>
    );
  }

  const navItems = [
    [LayoutDashboard, "Overview"],
    [FileText, "Leads"],
    [BarChart3, "Analytics"],
    [Settings, "Settings"],
  ];

  const renderLeadsTable = (limit?: number) => {
    const data = limit ? filtered.slice(0, limit) : filtered;
    return (
      <Card className="rounded-[1.8rem] border-white/10 bg-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl">{limit ? "Recent Leads" : "Lead Management"}</CardTitle>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-full border-white/10 bg-black/30 pl-10 text-white placeholder:text-white/40"
                placeholder="Search leads"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {leadsLoading ? (
            <div className="flex items-center justify-center py-12 text-white/40">
              <Loader2 className="h-6 w-6 animate-spin mr-3" /> Loading leads...
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40 gap-3">
              <FileText className="h-8 w-8" />
              <p className="text-sm">No leads match your search.</p>
            </div>
          ) : (
            data.map((lead) => (
              <div
                key={lead.id}
                className="grid gap-4 rounded-[1.2rem] border border-white/10 bg-black/25 p-4 md:grid-cols-[1.3fr_1.1fr_0.8fr_0.8fr_1fr] md:items-center cursor-pointer hover:bg-white/5 transition"
                onClick={() => setSelectedLead(lead)}
              >
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-white/50">{lead.phone}</div>
                  {lead.siteVisitRequested && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#c88e71]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#efc2aa] border border-[#c88e71]/30">
                      <Calendar className="h-2.5 w-2.5" /> Visit Request
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-white/45 mb-0.5">Interested in</div>
                  <div className="text-sm">{lead.unit || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-white/45 mb-0.5">Source</div>
                  <div className="text-sm">{lead.source}</div>
                </div>
                <div>
                  <div className="text-xs text-white/45 mb-0.5">Visit Date</div>
                  <div className="text-sm border flex items-center h-full border-none">
                    {lead.siteVisitRequested ? (
                      <span className="text-[#efc2aa]">{lead.preferredVisitDate || "To be set"}</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 md:justify-end flex-wrap">
                  {lead.createdAt ? (
                    <span className="text-xs text-white/35 mr-2">
                      {timeAgo(lead.createdAt.seconds)}
                    </span>
                  ) : null}
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#060607] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,142,113,0.1),transparent_40%)]" />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 relative z-10">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between rounded-full border border-white/10 bg-black/50 px-5 py-3 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <img 
              src="/logo.svg" 
              alt="Lavelle" 
              className="h-14 w-auto object-contain" 
            />
            <div className="border-l border-white/20 pl-4">
              <div className="text-xs uppercase tracking-[0.4em] text-[#efc2aa] font-semibold leading-tight">Admin</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Control Panel</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-white/50 md:flex">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Signed in as <span className="text-white/75">{userEmail}</span>
          </div>

          <Button
            variant="outline"
            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </motion.div>

        {/* Layout */}
        <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="sticky top-6 rounded-[1.8rem] border-white/10 bg-[#111114] text-white">
              <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-sm text-white/50">Sales Console</div>
                  <Badge className="bg-[#c88e71] text-black hover:bg-[#c88e71] text-xs">Live</Badge>
                </div>
                <div className="space-y-1">
                  {navItems.map(([Icon, label]: any) => (
                    <button
                      key={label}
                      onClick={() => setActiveNav(label)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                        activeNav === label
                          ? "bg-white text-black font-medium"
                          : "text-white/65 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-white/45 mb-2">Quick link</div>
                  <button
                    onClick={() => navigate("/")}
                    className="text-sm text-[#efc2aa] hover:text-[#ddb09a] transition"
                  >
                    ← Back to public site
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {activeNav === "Overview" && (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    [String(leads.length), "Total leads captured", "Overall inquiries"],
                    [String(visitorCount), "Total site visits", "Page loads tracked"],
                    [String(leads.filter(l => l.siteVisitRequested).length), "Visit requests", "Site tours requested"],
                    [String(leads.filter((l) => l.source === "Website Form").length), "Form inquiries", "Direct submissions"],
                  ].map(([num, label, sub]) => (
                    <Card key={label} className="rounded-[1.4rem] border-white/10 bg-white/5 text-white">
                      <CardContent className="p-5">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">{sub}</div>
                        <div className="text-3xl font-semibold">{num}</div>
                        <div className="mt-1 text-sm text-white/65">{label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {renderLeadsTable(5)}
              </>
            )}

            {activeNav === "Leads" && renderLeadsTable()}

            {activeNav === "Analytics" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-[1.8rem] border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <CardTitle>Response Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {[
                      ["Inquiry response speed", 84],
                      ["Lead qualification completion", 71],
                      ["Viewing booking rate", 58],
                    ].map(([label, value]: any) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/65">{label}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} className="h-2 bg-white/10" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-[1.8rem] border-white/10 bg-[#111114] text-white">
                  <CardHeader>
                    <CardTitle>Automation Flow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Visitor lands on listing page",
                      "Client form captures intent and budget",
                      "Lead saved to Firebase Firestore",
                      "Sales team reviews in this dashboard",
                      "Team follows up and books a viewing",
                    ].map((step) => (
                      <div key={step} className="flex gap-3 rounded-2xl bg-white/5 p-3.5 text-sm text-white/70">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#efc2aa]" />
                        {step}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeNav === "Settings" && (
              <Card className="rounded-[1.8rem] border-white/10 bg-white/5 text-white">
                <CardHeader>
                  <CardTitle>Website Configuration</CardTitle>
                  <CardDescription className="text-white/50">Edit public site content. Changes save instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-[#c88e71]">Hero Section Settings</h3>
                    <div className="grid gap-2">
                      <label className="text-sm text-white/70">Hero Video URL (YouTube Embed format recommended)</label>
                      <Input
                        value={siteSettings.heroVideoUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroVideoUrl: e.target.value })}
                        className="bg-black/30 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-[#c88e71]">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-sm text-white/70">WhatsApp Number (e.g., 256791224477)</label>
                        <Input
                          value={siteSettings.waNumber}
                          onChange={(e) => setSiteSettings({ ...siteSettings, waNumber: e.target.value })}
                          className="bg-black/30 border-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm text-white/70">Display Phone Number</label>
                        <Input
                          value={siteSettings.contactPhone}
                          onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                          className="bg-black/30 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-[#c88e71]">Property Pricing</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="grid gap-2">
                        <label className="text-sm text-white/70">Skyline Suite Price</label>
                        <Input
                          value={siteSettings.residence1Price}
                          onChange={(e) => setSiteSettings({ ...siteSettings, residence1Price: e.target.value })}
                          className="bg-black/30 border-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm text-white/70">Lavelle Signature Price</label>
                        <Input
                          value={siteSettings.residence2Price}
                          onChange={(e) => setSiteSettings({ ...siteSettings, residence2Price: e.target.value })}
                          className="bg-black/30 border-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm text-white/70">Penthouse Horizon Price</label>
                        <Input
                          value={siteSettings.residence3Price}
                          onChange={(e) => setSiteSettings({ ...siteSettings, residence3Price: e.target.value })}
                          className="bg-black/30 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === "saving"}
                    className="bg-[#c88e71] text-black hover:bg-[#ddb09a]"
                  >
                    {saveStatus === "saving" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {saveStatus === "saved" ? "Saved!" : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

          </motion.div>
        </div>
      </div>

      {/* Lead Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111114] border border-white/10 rounded-[1.8rem] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedLead.name}</h2>
                  <p className="text-sm text-white/50">Captured {selectedLead.createdAt ? timeAgo(selectedLead.createdAt.seconds) : ""}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-white/40 mb-1">Phone</div>
                    <div className="text-sm">{selectedLead.phone}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-white/40 mb-1">Email</div>
                    <div className="text-sm truncate">{selectedLead.email || "—"}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-white/40 mb-1">Unit Required</div>
                    <div className="text-sm">{selectedLead.unit || "—"}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-white/40 mb-1">Budget</div>
                    <div className="text-sm">{selectedLead.budget || "—"}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-white/40 mb-1">Timeline</div>
                    <div className="text-sm">{selectedLead.timeline || "—"}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5 border-[#c88e71]/30">
                    <div className="text-xs text-[#efc2aa] mb-1">Site Visit</div>
                    <div className="text-sm">
                      {selectedLead.siteVisitRequested ? selectedLead.preferredVisitDate || "Requested" : "No"}
                    </div>
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-white/40 mb-2">Message</div>
                    <div className="text-sm text-white/80 whitespace-pre-wrap">{selectedLead.message}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  className="flex-1 bg-[#c88e71] text-black hover:bg-[#ddb09a]"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${selectedLead.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(selectedLead.name)}%2C%20this%20is%20Lavelle%20residences.`,
                      "_blank"
                    )
                  }
                >
                  Message on WhatsApp
                </Button>
                {selectedLead.email && (
                  <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => window.open(`mailto:${selectedLead.email}`)}>
                    Email
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
