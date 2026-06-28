/* ============================================================
   OLYMPIAN HEALTH SOLUTIONS — Client Portal core
   Shared Supabase client + auth helpers used by
   login.html, dashboard.html and admin.html.
   Loaded as an ES module:  import { ... } from './js/portal.js'
   ============================================================ */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.OHS_PORTAL || {};

if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.includes("YOUR-PROJECT")) {
  console.warn(
    "[OHS portal] Supabase is not configured yet — edit js/portal-config.js."
  );
}

export const supabase = createClient(
  cfg.SUPABASE_URL || "https://placeholder.supabase.co",
  cfg.SUPABASE_ANON_KEY || "placeholder"
);

export const isConfigured = () =>
  !!cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("YOUR-PROJECT");

/* ---------- Auth helpers ---------- */

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}

export async function getProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", session.user.id)
    .single();
  if (error) {
    console.error("[OHS portal] profile load failed:", error.message);
    return null;
  }
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

/* Redirect to login if there is no session. Returns the session. */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    window.location.replace("login.html?next=" + encodeURIComponent(location.pathname.replace(/^\//, "")));
    return null;
  }
  return session;
}

/* Redirect away if the current user is not an admin. Returns the profile. */
export async function requireAdmin() {
  const session = await requireSession();
  if (!session) return null;
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    window.location.replace("dashboard.html");
    return null;
  }
  return profile;
}

/* ---------- Small DOM utility ---------- */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}
