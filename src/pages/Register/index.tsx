import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FormService, PROFESSIONS } from "../../services/formService";
import { UserService } from "../../services/userService";
import styles from "./Register.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");

  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [sector, setSector] = useState("");

  const [salary, setSalary] = useState("");
  const [additionalIncome, setAdditionalIncome] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const fillWithMockData = () => {
    if (!import.meta.env.DEV) return;
    const randomUser = FormService.getRandomMockUser();
    const randomPassword = FormService.getMockPassword();

    setName(randomUser.name);
    setEmail(randomUser.email);
    setAge(randomUser.age);
    setProfession(randomUser.profession);
    setExperience(randomUser.experience);
    setSector(randomUser.sector);
    setSalary(randomUser.salary);
    setAdditionalIncome(randomUser.additionalIncome);
    setPassword(randomPassword);
    setConfirmPassword(randomPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = FormService.validateRegistrationForm({
      password,
      confirmPassword,
      age,
      profession,
      sector,
    });

    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const userData = UserService.prepareRegistrationData({
        age,
        profession,
        experience,
        sector,
        salary,
        additionalIncome,
      });

      await register(name, email, password, userData);
      navigate("/");
    } catch (error: any) {
      setError("Kayıt başarısız: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-${theme} ${styles.page}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.brand}> Fin-Iş Bankası</h1>
          <h2 className={styles.subtitle}>Yeni Hesap Açın</h2>

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={fillWithMockData}
              className={styles.devBtn}>
              🎲 Test Verilerini Doldur
            </button>
          )}

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Kişisel Bilgiler */}
          <div className={`card-${theme} ${styles.cardPad}`}>
            <h3 className={styles.sectionTitle}>Kişisel Bilgiler</h3>

            <div className={styles.grid2}>
              <div>
                <label htmlFor="name" className={styles.label}>
                  Ad Soyad: *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`${styles.input} input-${theme}`}
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="age" className={styles.label}>
                  Yaş: *
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min={18}
                  max={100}
                  className={`${styles.input} input-${theme}`}
                />
              </div>
            </div>

            <div style={{ marginTop: 15 }}>
              <label htmlFor="email" className={styles.label}>
                E-posta: *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${styles.input} input-${theme}`}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Meslek Bilgileri */}
          <div className={`card-${theme} ${styles.cardPad}`}>
            <h3 className={styles.sectionTitle}>💼 Meslek Bilgileri</h3>

            <div className={styles.grid2}>
              <div>
                <label htmlFor="profession" className={styles.label}>
                  Meslek: *
                </label>
                <select
                  id="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  className={`${styles.select} input-${theme}`}>
                  <option value="">Meslek Seçiniz</option>
                  {PROFESSIONS.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="experience" className={styles.label}>
                  Tecrübe (Yıl):
                </label>
                <input
                  type="number"
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  min={0}
                  max={50}
                  className={`${styles.input} input-${theme}`}
                  placeholder="0"
                />
              </div>
            </div>

            <div style={{ marginTop: 15 }}>
              <label htmlFor="sector" className={styles.label}>
                Çalıştığınız Sektör: *
              </label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
                className={`${styles.select} input-${theme}`}>
                <option value="">Sektör Seçiniz</option>
                <option value="ozel">Özel Sektör</option>
                <option value="kamu">Kamu/Devlet</option>
                <option value="serbest">Serbest Meslek</option>
                <option value="emekli">Emekli</option>
                <option value="ogrenci">Öğrenci</option>
                <option value="calismiyorum">Çalışmıyorum</option>
              </select>
            </div>
          </div>

          {/* Gelir Bilgileri */}
          <div className={`card-${theme} ${styles.cardPad}`}>
            <h3 className={styles.sectionTitle}>Gelir Bilgileri</h3>

            <div className={styles.grid2}>
              <div>
                <label htmlFor="salary" className={styles.label}>
                  Aylık Ortalama Maaş (TL):
                </label>
                <input
                  type="number"
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  min={0}
                  className={`${styles.input} input-${theme}`}
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="additionalIncome" className={styles.label}>
                  Ek Gelir (TL):
                </label>
                <input
                  type="number"
                  id="additionalIncome"
                  value={additionalIncome}
                  onChange={(e) => setAdditionalIncome(e.target.value)}
                  min={0}
                  className={`${styles.input} input-${theme}`}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Güvenlik Bilgileri */}
          <div className={`card-${theme} ${styles.cardPad}`}>
            <h3 className={styles.sectionTitle}>Güvenlik Bilgileri</h3>

            <div className={styles.grid2}>
              <div>
                <label htmlFor="password" className={styles.label}>
                  Şifre: *
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${styles.input} input-${theme}`}
                  placeholder="En az 6 karakter"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Şifre Tekrar: *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`${styles.input} input-${theme}`}
                  placeholder="Şifreyi tekrar girin"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submit} ${
              loading ? styles.submitDisabled : ""
            }`}>
            {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
}
