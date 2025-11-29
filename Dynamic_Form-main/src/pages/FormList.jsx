import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadFromLocal } from "../utils/loadFromLocal";
import { saveToLocal } from "../utils/saveToLocal";
import { v4 as uuid } from "uuid";

function FormList() {
  const [forms, setForms] = useState([]);
  const [entries, setEntries] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedForms = loadFromLocal("forms") || [];
    setForms(storedForms);

    const allEntries = loadFromLocal("entries") || {};
    setEntries(allEntries);
  }, []);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all entries.`)) {
      const updatedForms = forms.filter((f) => f.id !== id);
      saveToLocal("forms", updatedForms);
      setForms(updatedForms);

      // Remove associated entries
      const updatedEntries = { ...entries };
      delete updatedEntries[id];
      saveToLocal("entries", updatedEntries);
      setEntries(updatedEntries);
    }
  };

  const handleClone = (form) => {
    const clonedForm = {
      ...form,
      id: uuid(),
      title: form.title + " (Copy)",
      createdAt: new Date().toISOString(),
    };
    const updatedForms = [...forms, clonedForm];
    saveToLocal("forms", updatedForms);
    setForms(updatedForms);
  };

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Form Library</h1>
        <p className="subtitle">Manage all your forms in one place</p>
      </div>

      <div className="toolbar">
        <button onClick={() => navigate("/create")} className="btnPrimary">
          Create New Form
        </button>
        <input
          type="text"
          placeholder="Search forms..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {forms.length === 0 ? (
        <div className="empty-state">
          <h2>No Forms Yet</h2>
          <p>Get started by creating your first form!</p>
          <button className="btnPrimary" onClick={() => navigate("/create")}>
            Create Your First Form
          </button>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="empty-state">
          <h2>No Results Found</h2>
          <p>No forms match your search term "{searchTerm}"</p>
        </div>
      ) : (
        <div className="forms-list">
          {filteredForms.map((form) => (
            <div key={form.id} className="form-list-card">
              <div className="form-list-header">
                <h3>{form.title}</h3>
                {form.description && <p className="form-description">{form.description}</p>}
              </div>

              <div className="form-list-meta">
                <span className="meta-item">
                  {form.fields?.length || 0} fields
                </span>
                <span className="meta-item">
                  {entries[form.id]?.length || 0} entries
                </span>
                <span className="meta-item">
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="form-list-actions">
                <button className="btn-action btn-edit" onClick={() => navigate(`/edit/${form.id}`)}>
                  Edit
                </button>
                <button className="btn-action btn-fill" onClick={() => navigate(`/preview/${form.id}`)}>
                  Fill Form
                </button>
                <button className="btn-action btn-entries" onClick={() => navigate(`/entries/${form.id}`)}>
                  Entries ({entries[form.id]?.length || 0})
                </button>
                <button className="btn-action btn-clone" onClick={() => handleClone(form)}>
                  Clone
                </button>
                <button className="btn-action btn-delete" onClick={() => handleDelete(form.id, form.title)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormList;
