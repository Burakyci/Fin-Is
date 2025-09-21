import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const fillTestData = () => {
    if (import.meta.env.DEV) {
      setEmail("test@test.com");
      setPassword("asdasd");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/account");
    } catch (err: any) {
      setError("Giriş başarısız: " + (err?.message || "Bilinmeyen hata"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-${theme} ${styles.page}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1 className={styles.brand}>🏦 Fin-Is Bankası</h1>
          <h2 className={styles.subtitle}>Güvenli Giriş</h2>

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={fillTestData}
              className={styles.devBtn}>
              Test Hesabı
            </button>
          )}

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="email" className={styles.label}>
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${styles.input} input-${theme}`}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.label}>
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${styles.input} input-${theme}`}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submit} ${
              loading ? styles.submitDisabled : ""
            }`}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
