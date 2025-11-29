import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadFromLocal } from "../utils/loadFromLocal";

function Home() {
  const [forms, setForms] = useState([]);
  const [entries, setEntries] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let savedForms = loadFromLocal("forms") || [];
    if (!Array.isArray(savedForms)) {
      savedForms = [savedForms];
    }
    setForms(savedForms);

    const allEntries = loadFromLocal("entries") || {};
    setEntries(allEntries);
  }, []);

  const getTotalEntries = () => {
    return Object.values(entries).reduce((sum, arr) => sum + arr.length, 0);
  };

  return (
    <div className="container">
      <div className="hero-section">
        <h1 className="hero-title">Dynamic Form Builder</h1>
        <p className="hero-subtitle">
          Create custom forms, collect responses, and manage data - all in your browser!
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{forms.length}</div>
            <div className="stat-label">Total Forms</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getTotalEntries()}</div>
            <div className="stat-label">Total Entries</div>
          </div>
        </div>

        <div className="cta-buttons">
          <button className="btnPrimary btn-large" onClick={() => navigate("/create")}>
            Create New Form
          </button>
          <button className="btn btn-large" onClick={() => navigate("/forms")}>
            View All Forms
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Form Builder</h3>
            <p>Drag, drop, and configure fields with an intuitive interface</p>
          </div>
          <div className="feature-card">
            <h3>Multiple Field Types</h3>
            <p>Text, textarea, radio, checkbox, select, and file upload</p>
          </div>
          <div className="feature-card">
            <h3>Local Storage</h3>
            <p>All data saved securely in your browser</p>
          </div>
          <div className="feature-card">
            <h3>Entry Management</h3>
            <p>View, manage, and export form submissions</p>
          </div>
        </div>
      </div>

      {forms.length > 0 && (
        <div className="recent-forms-section">
          <h2>Recent Forms</h2>
          <div className="forms-grid">
            {forms.slice(0, 3).map((form) => (
              <div key={form.id} className="form-card-home">
                <h3>{form.title}</h3>
                <p className="form-meta">
                  {form.fields?.length || 0} fields • {entries[form.id]?.length || 0} entries
                </p>
                <div className="card-actions">
                  <button className="btn-small btn-fill" onClick={() => navigate(`/preview/${form.id}`)}>
                    Fill Form
                  </button>
                  <button className="btn-small btn-edit" onClick={() => navigate(`/edit/${form.id}`)}>
                    Edit
                  </button>
                  <button className="btn-small btn-view" onClick={() => navigate(`/entries/${form.id}`)}>
                    View Entries
                  </button>
                </div>
              </div>
            ))}
          </div>
          {forms.length > 3 && (
            <button className="btn" onClick={() => navigate("/forms")}>
              View All {forms.length} Forms
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
