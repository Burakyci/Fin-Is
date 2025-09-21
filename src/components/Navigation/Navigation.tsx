import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const navStyle: CSSProperties = { padding: "15px 0" };
  const navContainerStyle: CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    position: "relative",
  };
  const linkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    padding: "10px 15px",
    borderRadius: "4px",
    transition: "background-color 0.2s, opacity 0.2s",
    opacity: 0.8,
  };
  const activeLinkStyle: CSSProperties = {
    ...linkStyle,
    backgroundColor: "#007bff",
    color: "white",
    opacity: 1,
  };

  return (
    <nav className={`nav-${theme}`} style={navStyle}>
      <div style={navContainerStyle}>
        {/* Desktop */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h2 style={{ margin: 0, color: "#007bff", fontWeight: "bold" }}>
              🏦 Fin-Is Bankası
            </h2>

            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
              end>
              Ana Sayfa
            </NavLink>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {currentUser ? (
              <>
                <span
                  style={{ color: "inherit", opacity: 0.8, display: "none" }}
                  className="user-welcome">
                  Hoş geldiniz, {currentUser.displayName || currentUser.email}
                </span>

                <NavLink
                  to="/account"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }>
                  Hesabım
                </NavLink>

                <NavLink
                  to="/credit-application"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }>
                  Kredi Başvurusu
                </NavLink>

                <button
                  onClick={handleLogout}
                  style={{
                    ...linkStyle,
                    backgroundColor: "transparent",
                    border: "1px solid currentColor",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}>
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }>
                  Giriş Yap
                </NavLink>

                <NavLink
                  to="/register"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }>
                  Kayıt Ol
                </NavLink>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="theme-switch"
              title={
                theme === "light" ? "Karanlık moda geç" : "Aydınlık moda geç"
              }
              aria-label="Tema değiştir"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "20px",
                border: "2px solid #007bff",
                backgroundColor: theme === "light" ? "transparent" : "#007bff",
                transition: "all 0.3s ease",
              }}>
              <span style={{ fontSize: "16px" }}>
                {theme === "light" ? "☀️" : "🌙"}
              </span>
              <div
                style={{
                  width: "40px",
                  height: "20px",
                  backgroundColor: theme === "light" ? "#ddd" : "#007bff",
                  borderRadius: "10px",
                  position: "relative",
                  transition: "background-color 0.3s ease",
                }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: theme === "light" ? "2px" : "22px",
                    transition: "left 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="mobile-nav">
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            style={{ color: "inherit" }}>
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`mobile-menu ${mobileMenuOpen ? "open" : ""} ${theme}`}>
          <Link
            to="/"
            style={{
              ...linkStyle,
              padding: "15px 0",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={() => setMobileMenuOpen(false)}>
            Ana Sayfa
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/account"
                style={{
                  ...linkStyle,
                  padding: "15px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
                onClick={() => setMobileMenuOpen(false)}>
                Hesabım
              </Link>

              <Link
                to="/credit-application"
                style={{
                  ...linkStyle,
                  padding: "15px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
                onClick={() => setMobileMenuOpen(false)}>
                Kredi Başvurusu
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  ...linkStyle,
                  backgroundColor: "transparent",
                  border: "1px solid currentColor",
                  borderRadius: "4px",
                  cursor: "pointer",
                  padding: "15px 0",
                  textAlign: "left",
                  width: "100%",
                }}>
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  ...linkStyle,
                  padding: "15px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
                onClick={() => setMobileMenuOpen(false)}>
                Giriş Yap
              </Link>

              <Link
                to="/register"
                style={{ ...linkStyle, padding: "15px 0" }}
                onClick={() => setMobileMenuOpen(false)}>
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
