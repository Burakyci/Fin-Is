import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./Accont.module.css";

type AccountType = {
  accountNumber: string;
  currency: string;
  balance: number;
  accountType: string;
  status: string;
  openDate: any;
};

export default function Account() {
  const [account, setAccount] = useState<AccountType>({
    accountNumber: "",
    currency: "TL",
    balance: 0,
    accountType: "",
    status: "",
    openDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const { theme } = useTheme();
  const { currentUser, getUserData } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const userData = await getUserData();
          if (userData && userData.account) {
            setAccount(userData.account);
            setUserName(userData.name || currentUser.displayName || "");
          } else {
            setUserName(currentUser.displayName || "");
          }
        } catch (error) {
          console.error("Kullanıcı verileri alınırken hata:", error);
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, [currentUser, getUserData]);

  const formatOpenDate = (val: any) => {
    if (!val) return "";
    const ms =
      typeof val?.seconds === "number"
        ? val.seconds * 1000
        : Number(val) || val;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("tr-TR");
  };

  if (loading) {
    return (
      <div className={`app-${theme} ${styles.center}`}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`app-${theme} ${styles.center}`}>
        <div>Giriş yapmanız gerekiyor</div>
      </div>
    );
  }

  return (
    <div className={`app-${theme} ${styles.page}`}>
      <div className={styles.wrapper}>
        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>Hoş Geldiniz, {userName}!</h2>
          <p className={styles.welcomeText}>
            Banka hesap bilgilerinizi buradan görüntüleyebilirsiniz.
          </p>
        </div>

        <div className={`card-${theme} ${styles.card}`}>
          <h3 className={styles.cardTitle}>🏦 Banka Hesap Bilgileri</h3>

          <div className={styles.grid2}>
            <div className={`${styles.statBox} ${styles.bgBlue}`}>
              <div className={styles.statLabel}>Hesap Numarası</div>
              <div className={styles.statValueBlue}>
                {account.accountNumber || "Henüz atanmamış"}
              </div>
            </div>

            <div className={`${styles.statBox} ${styles.bgGreen}`}>
              <div className={styles.statLabel}>Mevcut Bakiye</div>
              <div className={styles.statValueGreen}>
                {(account.balance ?? 0).toLocaleString("tr-TR")}{" "}
                {account.currency || "TL"}
              </div>
            </div>
          </div>

          <div className={`${styles.grid2}`} style={{ marginTop: 20 }}>
            <div className={`${styles.statBox} ${styles.bgGray}`}>
              <div className={styles.statLabel}>Hesap Türü</div>
              <div className={styles.statValue}>
                {account.accountType || "Vadesiz Hesap"}
              </div>
            </div>

            <div className={`${styles.statBox} ${styles.bgCyan}`}>
              <div className={styles.statLabel}>Hesap Durumu</div>
              <div className={`${styles.statValue} ${styles.statusActive}`}>
                {account.status || "Aktif"}
              </div>
            </div>
          </div>

          {account.openDate && (
            <div className={styles.openDate}>
              Hesap Açılış Tarihi: {formatOpenDate(account.openDate)}
            </div>
          )}
        </div>

        <div className={`card-${theme} ${styles.simpleCard}`}>
          <h4 className={styles.simpleTitle}>Bankacılık İşlemleri</h4>
          <p className={styles.welcomeText}>
            Yakında: Para transferi, fatura ödeme ve diğer bankacılık hizmetleri
            burada olacak.
          </p>
          <div className={styles.badge}> Geliştirme aşamasında...</div>
        </div>
      </div>
    </div>
  );
}
