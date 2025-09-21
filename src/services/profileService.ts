import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserLiveProfile {
  age: number; // Yaş
  salary: number; // Ana gelir
  additionalIncome?: number; // Ek gelir (opsiyonel)
  employment_type?: string; // "Özel Sektör" / "Kamu"
  sector?: string; // "özel" / "kamu"
  home_ownership?: string; // "owner" / "ev sahibi"
  customer_segment?: string; // "mass" vb.
  defaulted_loans?: boolean; // Geçmiş temerrüt
  legal_issues?: boolean; // Hukuki sorunlar
  has_insurance?: boolean; // Sigorta var mı
  job_stability?: string; // "stable" / "istikrarlı"
  experience?: number; // Deneyim yılı
  loan_amount: number; // Kredi tutarı
  loan_term_months: number; // Kredi vadesi (ay)
}

export async function fetchUserLiveProfile(
  uid: string
): Promise<UserLiveProfile | null> {
  const userDocRef = doc(db, "users", uid);
  const userSnap = await getDoc(userDocRef);
  if (userSnap.exists()) {
    return userSnap.data() as any as UserLiveProfile;
  }

  const profRef = collection(db, "user_profiles");
  const q = query(profRef, orderBy("timestamp", "desc"), limit(1));
  const profSnap = await getDocs(q);
  if (!profSnap.empty) {
    return profSnap.docs[0].data() as any as UserLiveProfile;
  }

  return null;
}
