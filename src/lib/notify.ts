const NOTIFY_PRIMARY = "lavellebugolobi@outlook.com";
const NOTIFY_CC = "despotic62@gmail.com";

// Best-effort email notification for a new lead. The lead is already saved
// to the Firestore dashboard before this is called — if the email fails,
// nothing is lost.
export async function emailLeadNotification(lead: Record<string, unknown>) {
  try {
    await fetch(`https://formsubmit.co/ajax/${NOTIFY_PRIMARY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `New Lavelle lead — ${lead.name || "Website"}`,
        _cc: NOTIFY_CC,
        _template: "table",
        ...lead,
      }),
    });
  } catch {
    // silent — dashboard already has the lead
  }
}
