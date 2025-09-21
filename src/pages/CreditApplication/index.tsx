import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { CreditService } from "../../services/creditService";
import styles from "./CreditApplication.module.css";
import { analyzeCredit } from "../../services/decisionEngineService";

export default function CreditApplication() {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [decisionResult, setDecisionResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { theme } = useTheme();
  const { currentUser, updateUserBalance } = useAuth();
  const navigate = useNavigate();

  const { monthlyPayment, totalPayment, totalInterest } =
    CreditService.calculatePayments(amount, term);

  const analyzeWithDecisionEngine = async () => {
    setError("");
    if (!currentUser) {
      setError("Kullanıcı girişi gerekli");
      return;
    }

    setIsAnalyzing(true);
    try {
      const processedResult = await analyzeCredit({
        amount,
        term,
        user: { uid: currentUser.uid, email: currentUser.email },
      });

      setDecisionResult(processedResult);
      console.log(decisionResult.approved);
    } catch (err: any) {
      const msg =
        err?.message ||
        "Kredi analizi sırasında hata oluştu. Lütfen tekrar deneyiniz.";
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const withdrawCreditToAccount = async () => {
    if (!decisionResult || !decisionResult.approved || !currentUser) return;

    setIsWithdrawing(true);
    try {
      const creditAmount =
        decisionResult.recommended_amount || parseFloat(amount);

      await updateUserBalance(creditAmount);

      const creditRecord = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        amount: creditAmount,
        term: parseInt(term),
        monthlyPayment,
        totalPayment,
        withdrawnAt: new Date(),
        status: "Aktif",
        creditType: "AI Onaylı Kredi",
      };

      await addDoc(collection(db, "activeCredits"), creditRecord);

      alert(
        `Kredi tutarı (${creditAmount.toLocaleString(
          "tr-TR"
        )} TL) hesabınıza başarıyla eklendi!`
      );
      navigate("/account");
    } catch (err: any) {
      alert(
        "Kredi hesabınıza eklenirken hata oluştu: " +
          (err?.message || "Bilinmeyen hata")
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Kredi başvurusu için giriş yapmalısınız.");
      return;
    }
    if (!amount || !term) {
      setError("Lütfen tutar ve vade alanlarını doldurun.");
      return;
    }
    if (parseFloat(amount) < 1000) {
      setError("Minimum kredi tutarı 1.000 TL olmalıdır.");
      return;
    }
    if (parseInt(term) < 3 || parseInt(term) > 240) {
      setError("Kredi vadesi 3-240 ay arasında olmalıdır.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const applicationData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        amount: parseFloat(amount),
        term: parseInt(term),
        monthlyPayment,
        totalPayment,
        totalInterest,
        baseInterestRate: 4.09,
        kkdfRate: 15,
        bsmvRate: 15,
        status: "Değerlendiriliyor",
        applicationDate: new Date(),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "creditApplications"), applicationData);

      alert(
        "Kredi başvurunuz başarıyla gönderildi! 48 saat içinde size dönüş yapılacaktır."
      );
      navigate("/account");
    } catch (err: any) {
      setError(
        "Başvuru gönderilirken hata oluştu: " +
          (err?.message || err?.code || "Bilinmeyen hata")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className={`app-${theme} ${styles.page}`}>
        <div className={styles.centerBox}>
          <h2 className={styles.centerTitle}>Giriş Gerekli</h2>
          <p>Kredi başvurusu yapmak için giriş yapmalısınız.</p>
          <button
            onClick={() => navigate("/login")}
            className={`${styles.btn} ${styles.btnPrimary}`}>
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const inputBorder = theme === "dark" ? "2px solid #666" : "2px solid #ddd";
  const inputBg = theme === "dark" ? "#2d3748" : "#fff";
  const inputColor = theme === "dark" ? "#fff" : "#000";

  return (
    <div className={`app-${theme} ${styles.page}`}>
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kredi Hesaplama ve Başvuru</h2>
          <p className={styles.subtitle}>
            Kredi tutarı ve vadenizi girin, aylık taksitinizi görün ve başvuru
            yapın.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`card-${theme} ${styles.card}`}>
            {error && (
              <div className={`${styles.alert} ${styles.alertError}`}>
                {error}
              </div>
            )}

            <h4 className={styles.title} style={{ color: "#007bff" }}>
              Kredi Bilgileri
            </h4>

            <div className={styles.formGrid2}>
              <div>
                <label className={styles.label}>Kredi Tutarı (TL) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1000}
                  max={5000000}
                  step={1000}
                  placeholder="örnek: 100000"
                  className={styles.input}
                  style={{
                    border: inputBorder,
                    backgroundColor: inputBg,
                    color: inputColor,
                  }}
                  required
                />
              </div>

              <div>
                <label className={styles.label}>Vade (Ay) *</label>
                <input
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  min={3}
                  max={240}
                  placeholder="örnek: 36"
                  className={styles.input}
                  style={{
                    border: inputBorder,
                    backgroundColor: inputBg,
                    color: inputColor,
                  }}
                  required
                />
              </div>
            </div>

            {amount && term && (
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <h4 className={styles.resultTitle}>Kredi Hesaplama Sonucu</h4>
                  <button
                    type="button"
                    onClick={analyzeWithDecisionEngine}
                    disabled={isAnalyzing}
                    className={`${styles.btn} ${
                      isAnalyzing ? styles.btnMuted : styles.btnPrimary
                    }`}>
                    {isAnalyzing ? "🔄 Analiz ediliyor..." : "🤖 AI Analiz Et"}
                  </button>
                </div>

                <div className={styles.statsGrid3}>
                  <div className={`${styles.statBox} ${styles.bgBlue}`}>
                    <div className={styles.statLabel}>Aylık Taksit</div>
                    <div className={styles.statValueBlue}>
                      {monthlyPayment.toLocaleString("tr-TR")} TL
                    </div>
                  </div>

                  <div className={`${styles.statBox} ${styles.bgAmber}`}>
                    <div className={styles.statLabel}>Toplam Geri Ödeme</div>
                    <div className={styles.statValueAmber}>
                      {totalPayment.toLocaleString("tr-TR")} TL
                    </div>
                  </div>

                  <div className={`${styles.statBox} ${styles.bgRed}`}>
                    <div className={styles.statLabel}>Toplam Faiz</div>
                    <div className={styles.statValueRed}>
                      {totalInterest.toLocaleString("tr-TR")} TL
                    </div>
                  </div>
                </div>

                <div className={styles.smallNote}>
                  Temel Faiz: %4.09 Toplam Vergi Dahil
                </div>
              </div>
            )}

            {decisionResult && (
              <div
                className={[
                  styles.decisionCard,
                  decisionResult.approved
                    ? styles.decisionApproved
                    : styles.decisionRejected,
                ].join(" ")}>
                <h4
                  className={styles.decisionTitle}
                  style={{
                    color: decisionResult.approved ? "#28a745" : "#dc3545",
                  }}>
                  🤖 AI Karar Motoru Analizi
                </h4>

                <div className={styles.decisionGrid2}>
                  <div
                    className={`${styles.statBox} ${styles.bgBlue}`}
                    style={{ textAlign: "center" }}>
                    <div className={styles.statLabel}>Karar Durumu</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: decisionResult.approved ? "#28a745" : "#dc3545",
                      }}>
                      {decisionResult.approved ? "ONAYLANDI" : "REDDEDİLDİ"}
                    </div>
                  </div>

                  <div
                    className={`${styles.statBox} ${styles.bgAmber}`}
                    style={{ textAlign: "center" }}>
                    <div className={styles.statLabel}>Risk Skoru</div>
                    <div className={styles.statValueAmber}>
                      {decisionResult?.credit_score
                        ? decisionResult.credit_score.toFixed(1)
                        : "0.0"}
                      /100
                    </div>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <strong>📝 Karar Gerekçesi:</strong>
                  <p style={{ margin: "10px 0 0 0" }}>
                    {decisionResult?.decision_reason ||
                      "Değerlendirme yapılıyor..."}
                  </p>
                </div>

                {decisionResult?.recommended_amount &&
                  decisionResult.recommended_amount !==
                    parseFloat(amount || "0") && (
                    <div className={`${styles.infoBox} ${styles.infoBoxAmber}`}>
                      <strong>Önerilen Tutar:</strong>
                      <p style={{ margin: "10px 0 0 0" }}>
                        {(
                          decisionResult?.recommended_amount || 0
                        ).toLocaleString("tr-TR")}{" "}
                        TL
                      </p>
                    </div>
                  )}

                {decisionResult.conditions &&
                  decisionResult.conditions.length > 0 && (
                    <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
                      <strong>Koşullar ve Öneriler:</strong>
                      <ul style={{ margin: "10px 0 0 0" }}>
                        {decisionResult.conditions.map(
                          (c: string, i: number) => (
                            <li key={i}>{c}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {decisionResult.approved && (
                  <div className={styles.withdrawBox}>
                    <h4 className={styles.withdrawTitle}>Kredi Onaylandı!</h4>
                    <p className={styles.withdrawText}>
                      Onaylanan kredi tutarını hesabınıza çekmek için aşağıdaki
                      butona tıklayın.
                    </p>
                    <button
                      onClick={withdrawCreditToAccount}
                      disabled={isWithdrawing}
                      className={[
                        styles.btn,
                        styles.btnSuccess,
                        isWithdrawing ? styles.btnDisabled : "",
                      ].join(" ")}
                      style={{
                        padding: "15px 30px",
                        fontSize: 16,
                        fontWeight: "bold",
                        borderRadius: 8,
                      }}>
                      {isWithdrawing
                        ? "Hesabınıza Ekleniyor..."
                        : `Krediyi Hesabıma Çek (${(
                            decisionResult?.recommended_amount ||
                            parseFloat(amount || "0") ||
                            0
                          ).toLocaleString("tr-TR")} TL)`}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={loading}
                className={[
                  styles.btn,
                  styles.btnBlock,
                  loading ? styles.btnMuted : styles.btnSuccess,
                  loading ? styles.btnDisabled : "",
                ].join(" ")}>
                {loading ? "Gönderiliyor..." : "Kredi Başvurusu Gönder"}
              </button>
            </div>

            <div
              className={`${styles.infoBox} ${styles.infoBoxBlue}`}
              style={{ marginTop: 20 }}>
              <strong>Başvuru Süreci:</strong>
              <ul style={{ marginTop: 10, marginBottom: 0 }}>
                <li>Başvurunuz 48 saat içinde değerlendirilecektir</li>
                <li>Onay durumunda size telefon ile ulaşılacaktır</li>
                <li>Gerekli belgelerinizi hazır tutunuz</li>
                <li>
                  Kredi faiz oranları güncel piyasa koşullarına göre
                  belirlenecektir
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
