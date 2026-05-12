"use client";

import { useEffect } from "react";

function getUid(): string {
  const key = "evo_uid";
  let uid = localStorage.getItem(key);
  if (!uid) {
    uid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, uid);
  }
  return uid;
}

export function VisitTracker() {
  useEffect(() => {
    // Save ref code from URL to sessionStorage
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("evo_ref", ref);
    }

    // Save UTM params
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    if (utmSource) sessionStorage.setItem("evo_utm_source", utmSource);
    if (utmMedium) sessionStorage.setItem("evo_utm_medium", utmMedium);
    if (utmCampaign) sessionStorage.setItem("evo_utm_campaign", utmCampaign);

    // Track visit
    const uid = getUid();
    fetch("/api/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, page: location.pathname }),
    }).catch(() => {});
  }, []);

  return null;
}

/** Get stored ref/utm params to attach to lead forms */
export function getRefParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  if (typeof window === "undefined") return {};
  const ref = sessionStorage.getItem("evo_ref");
  return {
    utmSource: ref ? `referral_${ref}` : sessionStorage.getItem("evo_utm_source") || undefined,
    utmMedium: sessionStorage.getItem("evo_utm_medium") || undefined,
    utmCampaign: sessionStorage.getItem("evo_utm_campaign") || undefined,
  };
}
