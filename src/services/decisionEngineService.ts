// src/services/decisionEngine.ts
import { CreditService } from "./creditService";
import { fetchUserLiveProfile, UserLiveProfile } from "./profileService";
import { CONSTANTS } from "../utils/constants";

export interface DecisionResult {
  decision: "ONAYLANDI" | "REDDEDİLDİ" | string;
  credit_score?: number;
  decision_reason?: string;
  recommended_amount?: number;
  conditions?: string[];
  approved?: boolean;
}

export interface AnalyzeCreditArgs {
  amount: string;
  term: string;
  user: { uid: string; email: string | null };
}

// Default profil verileri
const defaults: Required<UserLiveProfile> = {
  age: 29,
  salary: 10000,
  additionalIncome: 2000,
  employment_type: "Özel Sektör",
  sector: "özel",
  home_ownership: "owner",
  customer_segment: "mass",
  defaulted_loans: false,
  legal_issues: false,
  has_insurance: true,
  job_stability: "stable",
  experience: 5,
  loan_amount: 50000,
  loan_term_months: 12,
};

// Eksik verileri default ile dolduran sanitize fonksiyonu
export function sanitizeProfile(
  input: Partial<UserLiveProfile>
): UserLiveProfile {
  return { ...defaults, ...input };
}

// Kredi analiz fonksiyonu
export async function analyzeCredit({
  amount,
  term,
  user,
}: AnalyzeCreditArgs): Promise<DecisionResult> {
  if (!user?.uid) throw new Error("Kullanıcı girişi gerekli");

  // Firestore’dan live data alınabilir veya defaults merge edilebilir
  const live = await fetchUserLiveProfile(user.uid);
  if (!live) throw new Error("Kullanıcı profili bulunamadı");
  const enriched: UserLiveProfile = sanitizeProfile(live);

  const applicationData = {
    ...enriched,
    loan_amount: parseFloat(amount),
    loan_term_months: parseInt(term),
  };
  console.log(amount, term, user, applicationData);

  const response = await fetch(`${CONSTANTS.API.LOCALURL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(applicationData),
  });
  console.log("Decision engine response status:", response.status);
  console.log(await response.clone().json());
  if (!response.ok) {
    const errTxt = await response.text().catch(() => "");
    throw new Error(
      "Kredi değerlendirme servisi geçici olarak kullanılamıyor. " + errTxt
    );
  }

  const raw = await response.json();

  const details = raw.details || {};
  const reasonsPos = details.reasons_positive || [];
  const reasonsNeg = details.reasons_negative || [];

  return {
    decision: details.decision === "APPROVED" ? "ONAYLANDI" : "REDDEDİLDİ",
    approved: details.decision === "APPROVED",
    credit_score: raw.score ?? 0,
    decision_reason: [...reasonsPos, ...reasonsNeg].join("; ") || undefined,
    recommended_amount: applicationData.loan_amount, // opsiyonel: backend önerisi yoksa gonderilen tutar
    conditions: reasonsNeg.length > 0 ? reasonsNeg : undefined,
  };
}
