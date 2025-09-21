import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Home.module.css";
import { CONSTANTS } from "../../utils/constants";

export default function Home() {
  const { theme } = useTheme();

  const [depositAmount, setDepositAmount] = useState("");
  const [depositTerm, setDepositTerm] = useState("90");
  const [interestRate, setInterestRate] = useState("45");
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("36");
  const [loanCalculationResult, setLoanCalculationResult] = useState<any>(null);

  const calculateDeposit = () => {
    const principal = parseFloat(depositAmount);
    const days = parseInt(depositTerm);
    const annualRate = parseFloat(interestRate);
    if (!principal || !days || !annualRate || principal <= 0) {
      alert("Lütfen geçerli değerler girin.");
      return;
    }
    const grossInterest = (principal * annualRate * days) / (365 * 100);
    const withholdingTax = grossInterest * 0.175; // %17.5 stopaj
    const netInterest = grossInterest - withholdingTax;
    const totalAmount = principal + netInterest;
    const effectiveAnnualRate =
      ((totalAmount / principal) ** (365 / days) - 1) * 100;

    setCalculationResult({
      principal,
      days,
      annualRate,
      grossInterest,
      withholdingTax,
      netInterest,
      totalAmount,
      effectiveAnnualRate,
    });
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const months = parseInt(loanTerm);
    if (!principal || !months || principal <= 0 || months <= 0) {
      alert("Lütfen geçerli değerler girin.");
      return;
    }
    const loanRate = CONSTANTS.INTEREST.BASE_RATE; // %4.09 base monthly rate
    const kkdfRate = CONSTANTS.INTEREST.KKDF_RATE; // %15 Resource Utilization Support Fund
    const bsmvRate = CONSTANTS.INTEREST.BSMV_RATE; // %15 Banking and Insurance Transactions Tax

    const totalRate = Number(
      ((loanRate * (1 + kkdfRate + bsmvRate)) / 100 + 1).toFixed(11)
    );
    const rawPayment =
      ((Math.pow(totalRate, months) * (totalRate - 1)) /
        (Math.pow(totalRate, months) - 1)) *
      principal;

    const monthlyPayment = Number((rawPayment || 0).toFixed(2));
    const totalAmount = monthlyPayment * months;
    const totalInterest = totalAmount - principal;
    const effectiveAnnualRate = loanRate * (1 + kkdfRate + bsmvRate);
    const kkdfAmount = totalInterest * (kkdfRate / (kkdfRate + bsmvRate));
    const bsmvAmount = totalInterest * (bsmvRate / (kkdfRate + bsmvRate));
    const totalTaxAmount = kkdfAmount + bsmvAmount;

    setLoanCalculationResult({
      principal,
      months,
      annualRate: loanRate,
      effectiveAnnualRate,
      monthlyPayment,
      totalAmount,
      totalInterest,
      kkdfAmount,
      bsmvAmount,
      totalTaxAmount,
    });
  };

  return (
    <div className={`app-${theme} ${styles.page}`}>
      <div className={`${styles.container}`}>
        <div className={styles.inner}>
          <h2 className={styles.heroTitle}>Dijital Bankacılığa Hoşgeldiniz!</h2>
          <p className={styles.heroText}>
            Güvenli ve hızlı bankacılık hizmetlerinden yararlanın. Hesabınızı
            yönetin, para transferi yapın ve tüm bankacılık işlemlerinizi
            kolayca gerçekleştirin.
          </p>

          <div className={`${styles.responsiveGrid}`} style={{ marginTop: 40 }}>
            <div className={`card-${theme} ${styles.cardPad}`}>
              <h3>Hesap İşlemleri</h3>
              <p>
                Bakiye sorgulama, para transferi ve hesap hareketlerinizi
                görüntüleyin.
              </p>
            </div>
            <div className={`card-${theme} ${styles.cardPad}`}>
              <h3>Mobil Bankacılık</h3>
              <p>7/24 güvenli bankacılık hizmetlerine erişin.</p>
            </div>
            <div className={`card-${theme} ${styles.cardPad}`}>
              <h3>Güvenli Giriş</h3>
              <p>En son güvenlik teknolojileriyle korumalı giriş sistemi.</p>
            </div>
          </div>

          {/* Vadeli Mevduat */}
          <div
            className={`${styles.section} ${styles.sectionDeposit}`}
            style={{ marginTop: 40 }}>
            <div className={styles.twoCol}>
              <div>
                <h2 className={styles.sectionTitle}>
                  Vadeli Mevduat Hesaplama
                </h2>
                <p className={styles.sectionDesc}>
                  Yıllık %50'ye varan faiz oranları ile vadeli mevduatınızın
                  getirisini hesaplayın. Stopaj vergisi (%17.5) otomatik olarak
                  hesaplanır.
                </p>

                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.label}>Mevduat Tutarı (TL)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="örnek: 100000"
                      min={1000}
                      step={1000}
                      className={styles.input}
                    />
                  </div>

                  <div>
                    <label className={styles.label}>
                      Vade (Gün Sayısı) - Manuel Giriş
                    </label>
                    <input
                      type="number"
                      value={depositTerm}
                      onChange={(e) => setDepositTerm(e.target.value)}
                      placeholder="örnek: 90"
                      min={1}
                      max={3650}
                      step={1}
                      className={styles.input}
                    />
                  </div>

                  <div>
                    <label className={styles.label}>
                      Yıllık Faiz Oranı (%) - Manuel Giriş
                    </label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      min={1}
                      max={80}
                      step={0.1}
                      className={styles.input}
                    />
                  </div>

                  <button
                    onClick={calculateDeposit}
                    className={styles.btnGlass}>
                    Hesapla
                  </button>
                </div>
              </div>

              <div className={styles.glassPanel}>
                <h3 className={styles.panelTitle}>Hesaplama Sonuçları</h3>

                {calculationResult ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Ana Para:
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        {calculationResult.principal.toLocaleString("tr-TR")} TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>Vade:</span>
                      <span style={{ fontWeight: 600 }}>
                        {calculationResult.days} gün
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Yıllık Faiz Oranı:
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        %{calculationResult.annualRate}
                      </span>
                    </div>

                    <hr className={styles.hr} />

                    <div className={`${styles.row} ${styles.rowAlt}`}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Brüt Faiz Geliri:
                      </span>
                      <span className={styles.textGreen}>
                        {calculationResult.grossInterest.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Stopaj Vergisi (%17.5):
                      </span>
                      <span className={styles.textPink}>
                        -
                        {calculationResult.withholdingTax.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Net Faiz Geliri:
                      </span>
                      <span className={styles.textMint}>
                        {calculationResult.netInterest.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        TL
                      </span>
                    </div>

                    <hr className={`${styles.hr} ${styles.hrStrong}`} />

                    <div className={styles.totalBox}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>
                        Toplam Tutar:
                      </span>
                      <span className={styles.totalValue}>
                        {calculationResult.totalAmount.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.noteBox}>
                      <div>
                        Efektif Yıllık Getiri: %
                        {calculationResult.effectiveAnnualRate.toFixed(2)}
                      </div>
                      <div style={{ marginTop: 5, fontSize: 11 }}>
                        * Hesaplamalar bilgilendirme amaçlıdır. Gerçek oranlar
                        değişebilir.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyBig}>Hesaplama</div>
                    <p>
                      Vadeli mevduat getirinizi hesaplamak için
                      <br />
                      bilgileri doldurun ve "Hesapla" butonuna basın.
                    </p>
                    <div
                      style={{ marginTop: 20, fontSize: 12, lineHeight: 1.5 }}>
                      <div>
                        <strong>Minimum Tutar:</strong> 1.000 TL
                      </div>
                      <div>
                        <strong>Vade:</strong> Manuel giriş (örnek: 90 gün)
                      </div>
                      <div>
                        <strong>Faiz Oranı:</strong> Manuel giriş (örnek: %45)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kredi */}
          <div className={`${styles.section} ${styles.sectionLoan}`}>
            <div className={styles.twoCol}>
              <div>
                <h2 className={styles.sectionTitle}>Kredi Hesaplama</h2>
                <p className={styles.sectionDesc}>
                  KKDF (%15) ve BSMV (%15) vergileri dahil kredi taksitinizi
                  hesaplayın. Kredi başvuru sayfasıyla aynı hesaplama
                  algoritması.
                </p>

                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.label}>Kredi Tutarı (TL)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="örnek: 200000"
                      min={1000}
                      step={1000}
                      className={styles.input}
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Vade (Ay)</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className={styles.select}>
                      <option value="12">12 Ay (1 Yıl)</option>
                      <option value="24">24 Ay (2 Yıl)</option>
                      <option value="36">36 Ay (3 Yıl)</option>
                      <option value="48">48 Ay (4 Yıl)</option>
                      <option value="60">60 Ay (5 Yıl)</option>
                      <option value="72">72 Ay (6 Yıl)</option>
                      <option value="84">84 Ay (7 Yıl)</option>
                      <option value="96">96 Ay (8 Yıl)</option>
                      <option value="120">120 Ay (10 Yıl)</option>
                      <option value="180">180 Ay (15 Yıl)</option>
                      <option value="240">240 Ay (20 Yıl)</option>
                    </select>
                  </div>

                  <div className={styles.fixedRates}>
                    <div className={styles.fixedRatesTitle}>
                      Sabit Faiz Oranları (Kredi Başvuru Sayfasıyla Aynı)
                    </div>
                    <div className={styles.fixedRatesText}>
                      • Aylık Faiz Oranı: %4.09
                      <br />
                      • KKDF: %15
                      <br />
                      • BSMV: %15
                      <br />• Efektif Oran: %5.28
                    </div>
                  </div>

                  <button onClick={calculateLoan} className={styles.btnGlass}>
                    Kredi Hesapla
                  </button>
                </div>
              </div>

              <div className={styles.glassPanel}>
                <h3 className={styles.panelTitle}>Kredi Hesaplama Sonuçları</h3>

                {loanCalculationResult ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Kredi Tutarı:
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        {loanCalculationResult.principal.toLocaleString(
                          "tr-TR"
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>Vade:</span>
                      <span style={{ fontWeight: 600 }}>
                        {loanCalculationResult.months} ay
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Aylık Faiz Oranı:
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        %{loanCalculationResult.annualRate}
                      </span>
                    </div>

                    <div className={`${styles.row} ${styles.rowAlt}`}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Efektif Faiz (KKDF+BSMV):
                      </span>
                      <span className={styles.textPink}>
                        %{loanCalculationResult.effectiveAnnualRate.toFixed(2)}
                      </span>
                    </div>

                    <hr className={styles.hr} />

                    <div className={styles.totalBox}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>
                        Aylık Taksit:
                      </span>
                      <span className={styles.textGold}>
                        {loanCalculationResult.monthlyPayment.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Toplam Geri Ödeme:
                      </span>
                      <span className={styles.textMint}>
                        {loanCalculationResult.totalAmount.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>
                        Toplam Faiz:
                      </span>
                      <span className={styles.textPink}>
                        {loanCalculationResult.totalInterest.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 12, opacity: 0.8 }}>
                        KKDF (%15):
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {loanCalculationResult.kkdfAmount.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.row}>
                      <span style={{ fontSize: 12, opacity: 0.8 }}>
                        BSMV (%15):
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {loanCalculationResult.bsmvAmount.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </span>
                    </div>

                    <div className={styles.noteBox}>
                      <div>
                        Toplam Vergi:{" "}
                        {loanCalculationResult.totalTaxAmount.toLocaleString(
                          "tr-TR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        TL
                      </div>
                      <div style={{ marginTop: 5, fontSize: 11 }}>
                        * Hesaplamalar bilgilendirme amaçlıdır. Gerçek oranlar
                        değişebilir.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyBig}>Hesaplama</div>
                    <p>
                      Kredi taksitinizi hesaplamak için
                      <br />
                      bilgileri doldurun ve "Kredi Hesapla" butonuna basın.
                    </p>
                    <div
                      style={{ marginTop: 20, fontSize: 12, lineHeight: 1.5 }}>
                      <div>
                        <strong>Minimum Tutar:</strong> 1.000 TL
                      </div>
                      <div>
                        <strong>Vade Seçenekleri:</strong> 12 ay - 240 ay
                      </div>
                      <div>
                        <strong>🏦 Vergiler:</strong> KKDF %15 + BSMV %15
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
