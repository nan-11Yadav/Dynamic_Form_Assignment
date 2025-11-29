import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Dynamic Form Builder</h2>

      <div style={styles.links}>
        <NavLink
          to="/"
          style={styles.link}
          className={({ isActive }) => (isActive ? "activeNav" : "")}
        >
          Home
        </NavLink>

        <NavLink
          to="/create"
          style={styles.link}
          className={({ isActive }) => (isActive ? "activeNav" : "")}
        >
          Create Form
        </NavLink>

        <NavLink
          to="/forms"
          style={styles.link}
          className={({ isActive }) => (isActive ? "activeNav" : "")}
        >
          Saved Forms
        </NavLink>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#212529",
    color: "white",
    padding: "16px 32px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flexWrap: "wrap",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  links: {
    display: "flex",
    gap: "32px",
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    fontSize: "15px",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 0",
    transition: "opacity 0.2s",
  },
};

// Inject Global CSS for active & hover
const css = `
.activeNav {
  font-weight: 600 !important;
  border-bottom: 3px solid #0d6efd;
  padding-bottom: 5px;
}

nav a:hover {
  opacity: 0.85;
}

/* ---------- MOBILE RESPONSIVE ---------- */
@media (max-width: 600px) {
  nav {
    padding: 14px 20px !important;
  }

  nav h2 {
    font-size: 18px !important;
    margin-bottom: 12px;
    width: 100%;
    text-align: center;
  }

  nav div {
    width: 100%;
    justify-content: center !important;
    gap: 20px !important;
  }

  nav a {
    font-size: 14px !important;
    padding: 6px;
  }
}
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = css;
  document.head.appendChild(styleTag);
}

export default Navbar;
