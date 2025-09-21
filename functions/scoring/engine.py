import json
import math
from pathlib import Path
from typing import Dict, Any, Tuple
import random


DEFAULTS = {
    "approval_threshold": 60,
    "base_monthly_interest": 0.0409,
    "include_taxes": True,
    "kkdf_rate": 0.15,
    "bsmv_rate": 0.15,
    "min_income_vs_installment": 1.0,
    "max_dti": 0.40,
    "scores": {
        "income_strong_bonus": 12,
        "income_ok_bonus": 7,
        "income_border_penalty": -8,
        "income_bad_penalty": -18,
        "public_sector_bonus": 6,
        "private_sector_bonus": 2,
        "homeowner_bonus": 4,
        "insurance_bonus": 3,
        "job_stability_bonus": 4,
        "default_penalty": -25,
        "legal_penalty": -30,
        "age_good_bonus": 8,
        "age_young_bonus": 2,
        "age_bad_penalty": -10
    },
    "experience": {
        "years_for_full_points": 20,
        "max_points": 10
    },
    "income_norm": {
        "cap": 200000.0,
        "max_points": 20
    }
}

def _load_controls() -> Dict[str, Any]:
    cfg_path = Path(__file__).parent / "controls.json"
    if cfg_path.exists():
        with cfg_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        def merge(d, u):
            for k, v in u.items():
                if isinstance(v, dict) and k in d and isinstance(d[k], dict):
                    merge(d[k], v)
                else:
                    d.setdefault(k, v)
            return d
        return merge(data, DEFAULTS.copy())
    return DEFAULTS.copy()

CFG = _load_controls()

def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))

def safe_num(x, default=0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)

def annuity_monthly_payment(principal: float, monthly_rate: float, months: int) -> float:
    """Klasik anüite formülü: M = P * r * (1+r)^n / ((1+r)^n - 1)"""
    if months <= 0 or principal <= 0:
        return 0.0
    r = monthly_rate
    if r <= 0:
        return principal / months
    pow_ = (1 + r) ** months
    return principal * r * pow_ / (pow_ - 1)

def _effective_monthly_rate() -> float:
    r = CFG["base_monthly_interest"]
    if CFG.get("include_taxes", True):
        r *= (1 + CFG.get("kkdf_rate", 0.0) + CFG.get("bsmv_rate", 0.0))
    return r



def monthly_payment_score(monthly_installment: float, total_income: float) -> Tuple[int, str, bool]:
    if total_income <= 0:
        return 0, "Gelir yok, kredi reddedildi", True
    ratio = monthly_installment / total_income
    if ratio > 1.0:
        return 0, f"Aylık taksit gelirden yüksek ({ratio*100:.1f}%), RED", True
    if ratio > 0.9: return 4, f"Aylık taksit %90–100 arası", False
    elif ratio > 0.8: return 8, f"Aylık taksit %80–90 arası", False
    elif ratio > 0.7: return 12, f"Aylık taksit %70–80 arası", False
    elif ratio > 0.6: return 16, f"Aylık taksit %60–70 arası", False
    elif ratio > 0.5: return 20, f"Aylık taksit %50–60 arası", False
    elif ratio > 0.4: return 24, f"Aylık taksit %40–50 arası", False
    elif ratio > 0.3: return 28, f"Aylık taksit %30–40 arası", False
    elif ratio > 0.2: return 32, f"Aylık taksit %20–30 arası", False
    elif ratio > 0.1: return 36, f"Aylık taksit %10–20 arası", False
    else: return 40, f"Aylık taksit %0–10 arası", False

def compute_score(payload: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    reasons_pos, reasons_neg = [], []

    salary = safe_num(payload.get("salary"))
    add_inc = safe_num(payload.get("additionalIncome"))
    total_income = salary + add_inc

    loan_amount = safe_num(payload.get("loan_amount"))
    loan_term = int(safe_num(payload.get("loan_term_months")))
    monthly_rate = 0.0409 * 1.3 
    def annuity(P, r, n):
        if r <= 0:
            return P / n
        pow_ = (1 + r) ** n
        return P * r * pow_ / (pow_ - 1)

    monthly_installment = annuity(loan_amount, monthly_rate, loan_term)

    ratio = monthly_installment / salary if salary > 0 else 999
    income_points = 0
    for bracket in CFG["income_section"]["salary_ratio_brackets"]:
        if ratio <= bracket["max_ratio"]:
            income_points = bracket["points"]
            break
    if monthly_installment > salary:
        decision = "DECLINED"
        reasons_neg.append("Aylık ödeme maaşı aşıyor, direkt red")
    else:
        reasons_pos.append(f"Aylık ödeme / maaş oranı: {ratio:.2f}, puan: {income_points}")

    personal_points = 0
    sec_cfg = CFG["personal_section"]

    sector = (payload.get("sector") or "").lower()
    sector_p = sec_cfg["sector"].get(sector, 0)
    personal_points += sector_p
    reasons_pos.append(f"Sektör: {sector} → {sector_p} puan")

    prof = payload.get("profession", "")
    prof_p = sec_cfg["profession"].get(prof, 0)
    personal_points += prof_p
    reasons_pos.append(f"Meslek: {prof} → {prof_p} puan")

    if payload.get("home_ownership") in {"owner", "ev sahibi"}:
        personal_points += sec_cfg["home_ownership"]
        reasons_pos.append(f"Ev sahibi → {sec_cfg['home_ownership']} puan")
    if payload.get("has_insurance"):
        personal_points += sec_cfg["has_insurance"]
        reasons_pos.append(f"Sigorta → {sec_cfg['has_insurance']} puan")
    if (payload.get("job_stability") or "").lower() in {"stable", "istikrarlı", "istikrali"}:
        personal_points += sec_cfg["job_stability"]
        reasons_pos.append(f"İş istikrarı → {sec_cfg['job_stability']} puan")

    if payload.get("defaulted_loans"):
        personal_points += sec_cfg["defaulted_loans"]
        reasons_neg.append(f"Geçmiş temerrüt → {sec_cfg['defaulted_loans']} puan")
    if payload.get("legal_issues"):
        personal_points += sec_cfg["legal_issues"]
        reasons_neg.append(f"Hukuki sorunlar → {sec_cfg['legal_issues']} puan")

    cust_seg = (payload.get("customer_segment") or "").lower()
    personal_points += sec_cfg["customer_segment"].get(cust_seg, 0)
    reasons_pos.append(f"Müşteri segmenti: {cust_seg} → {sec_cfg['customer_segment'].get(cust_seg,0)} puan")

    total_points = income_points + personal_points
    total_points = max(0, min(100, total_points))
    decision = "APPROVED" if total_points >= CFG["approval_threshold"] else "DECLINED"

    details = {
        "decision": decision,
        "total_points": total_points,
        "income_points": income_points,
        "personal_points": personal_points,
        "reasons_positive": reasons_pos,
        "reasons_negative": reasons_neg,
        "features": {
            "salary": salary,
            "additionalIncome": add_inc,
            "total_income": total_income,
            "monthly_installment": monthly_installment,
            "monthly_ratio": ratio,
            "sector": sector,
            "profession": prof,
            "home_ownership": payload.get("home_ownership"),
            "has_insurance": payload.get("has_insurance"),
            "job_stability": payload.get("job_stability"),
            "defaulted_loans": payload.get("defaulted_loans"),
            "legal_issues": payload.get("legal_issues"),
            "customer_segment": cust_seg
        }
    }
    return total_points, details
    reasons_pos, reasons_neg = [], []

    age = safe_num(payload.get("age"))
    salary = safe_num(payload.get("salary"))
    add_inc = safe_num(payload.get("additionalIncome"))
    total_income = salary + add_inc

    employment_type = (payload.get("employment_type") or "").lower()
    sector = (payload.get("sector") or "").lower()
    home_ownership = (payload.get("home_ownership") or "").lower()
    defaulted = bool(payload.get("defaulted_loans", False))
    legal_issues = bool(payload.get("legal_issues", False))
    has_insurance = bool(payload.get("has_insurance", False))
    job_stability = (payload.get("job_stability") or "").lower()
    experience_years = safe_num(payload.get("experience"))

    loan_amount = safe_num(payload.get("loan_amount"))
    loan_term = int(safe_num(payload.get("loan_term_months")))
    r_eff = _effective_monthly_rate()
    monthly_installment = annuity_monthly_payment(loan_amount, r_eff, loan_term)

   
    score = int(clamp(score, 0, 100))
    decision = "DECLINED" if score < CFG["approval_threshold"] else "APPROVED"

    details = {
        "decision": decision,
        "approval_threshold": CFG["approval_threshold"],
        "reasons_positive": reasons_pos,
        "reasons_negative": reasons_neg,
        "features": {
            "age": age,
            "salary": salary,
            "additionalIncome": add_inc,
            "total_income": total_income,
            "employment_type": employment_type,
            "sector": sector,
            "home_ownership": home_ownership,
            "defaulted_loans": defaulted,
            "legal_issues": legal_issues,
            "has_insurance": has_insurance,
            "job_stability": job_stability,
            "experience_years": experience_years,
            "loan_amount": loan_amount,
            "loan_term_months": loan_term,
            "monthly_interest_effective": r_eff,
            "monthly_installment": monthly_installment,
            "dti": dti,
            "monthly_payment_ratio": monthly_installment / total_income if total_income>0 else 0
        }
    }
    return score, details
    reasons_pos, reasons_neg = [], []
    score = 50  

    age = safe_num(payload.get("age"))
    salary = safe_num(payload.get("salary"))
    add_inc = safe_num(payload.get("additionalIncome"))
    total_income = salary + add_inc

    employment_type = (payload.get("employment_type") or "").lower()
    sector = (payload.get("sector") or "").lower()
    home_ownership = (payload.get("home_ownership") or "").lower()
    defaulted = bool(payload.get("defaulted_loans", False))
    legal_issues = bool(payload.get("legal_issues", False))
    has_insurance = bool(payload.get("has_insurance", False))
    job_stability = (payload.get("job_stability") or "").lower()
    experience_years = safe_num(payload.get("experience"))

    loan_amount = safe_num(payload.get("loan_amount"))
    loan_term = int(safe_num(payload.get("loan_term_months")))
    r_eff = _effective_monthly_rate()
    monthly_installment = annuity_monthly_payment(loan_amount, r_eff, loan_term)

    pay_score, pay_reason, force_decline = monthly_payment_score(monthly_installment, total_income)
    if force_decline:
        score = 0
        reasons_neg.append(pay_reason)
    else:
        score += pay_score
        reasons_pos.append(pay_reason)

    dti = monthly_installment / total_income if total_income > 0 else float("inf")
    if dti <= 0.30:
        score += CFG["scores"]["income_strong_bonus"]
        reasons_pos.append(f"DTI iyi (≤0.30): {dti:.2f}")
    elif dti <= CFG["max_dti"]:
        score += CFG["scores"]["income_ok_bonus"]
        reasons_pos.append(f"DTI kabul edilebilir (≤{CFG['max_dti']:.2f}): {dti:.2f}")
    else:
        score += CFG["scores"]["income_bad_penalty"]
        reasons_neg.append(f"DTI yüksek: {dti:.2f}")

    if 25 <= age <= 60:
        score += CFG["scores"]["age_good_bonus"]; reasons_pos.append("Yaş aralığı 25–60")
    elif 21 <= age < 25:
        score += CFG["scores"]["age_young_bonus"]; reasons_pos.append("25 altı genç")
    else:
        score += CFG["scores"]["age_bad_penalty"]; reasons_neg.append("Riskli yaş aralığı")

    if sector == "kamu":
        score += CFG["scores"]["public_sector_bonus"]; reasons_pos.append("Kamu sektörü")
    elif employment_type in {"özel sektör", "ozel", "private"}:
        score += CFG["scores"]["private_sector_bonus"]; reasons_pos.append("Özel sektör")

    if home_ownership in {"owner", "ev sahibi"}:
        score += CFG["scores"]["homeowner_bonus"]; reasons_pos.append("Ev sahibi")

    if defaulted:
        score += CFG["scores"]["default_penalty"]; reasons_neg.append("Geçmiş temerrüt")
    if legal_issues:
        score += CFG["scores"]["legal_penalty"]; reasons_neg.append("Hukuki sorunlar")

    if has_insurance:
        score += CFG["scores"]["insurance_bonus"]; reasons_pos.append("Sigorta mevcut")
    if job_stability in {"stable", "istikrarlı", "istikrali"}:
        score += CFG["scores"]["job_stability_bonus"]; reasons_pos.append("İş istikrarı iyi")

    exp_cfg = CFG["experience"]
    years_full = exp_cfg["years_for_full_points"]
    exp_norm = clamp(experience_years / years_full, 0, 1)
    exp_points = round(exp_cfg["max_points"] * exp_norm)
    score += exp_points
    (reasons_pos if exp_points >= (exp_cfg["max_points"] // 2) else reasons_neg).append(
        f"Deneyim: +{exp_points} puan ({experience_years:.0f} yıl)"
    )

    inc_cfg = CFG["income_norm"]
    income_norm = clamp((salary + add_inc) / inc_cfg["cap"], 0, 1)
    income_points = round(inc_cfg["max_points"] * income_norm)
    score += income_points
    (reasons_pos if income_points >= (inc_cfg["max_points"] // 2) else reasons_neg).append(
        f"Gelir katkısı: +{income_points}"
    )

    score = int(clamp(score, 0, 100))
    decision = "DECLINED" if score < CFG["approval_threshold"] else "APPROVED"

    details = {
        "decision": decision,
        "approval_threshold": CFG["approval_threshold"],
        "reasons_positive": reasons_pos,
        "reasons_negative": reasons_neg,
        "features": {
            "age": age,
            "salary": salary,
            "additionalIncome": add_inc,
            "total_income": total_income,
            "employment_type": employment_type,
            "sector": sector,
            "home_ownership": home_ownership,
            "defaulted_loans": defaulted,
            "legal_issues": legal_issues,
            "has_insurance": has_insurance,
            "job_stability": job_stability,
            "experience_years": experience_years,
            "loan_amount": loan_amount,
            "loan_term_months": loan_term,
            "monthly_interest_effective": r_eff,
            "monthly_installment": monthly_installment,
            "dti": dti,
            "monthly_payment_ratio": monthly_installment / total_income if total_income>0 else 0
        }
    }
    return score, details