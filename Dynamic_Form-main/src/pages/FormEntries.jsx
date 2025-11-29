import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadFromLocal } from "../utils/loadFromLocal";
import { saveToLocal } from "../utils/saveToLocal";

function FormEntries() {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const forms = loadFromLocal("forms") || [];
    const foundForm = forms.find((f) => f.id === id);
    setForm(foundForm);

    const allEntries = loadFromLocal("entries") || {};
    setEntries(allEntries[id] || []);
  }, [id]);

  const handleDelete = (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry? This cannot be undone.")) {
      const allEntries = loadFromLocal("entries") || {};
      const updatedEntries = (allEntries[id] || []).filter((e) => e.id !== entryId);
      allEntries[id] = updatedEntries;
      saveToLocal("entries", allEntries);
      setEntries(updatedEntries);
    }
  };

  const getFirstFieldValue = (entry) => {
    if (!form || !form.fields || form.fields.length === 0) return "N/A";
    const firstField = form.fields[0];
    const value = entry.values[firstField.name];
    
    if (typeof value === "object" && value.name) {
      return value.name; // File name
    }
    return value || "N/A";
  };

  if (!form) {
    return (
      <div className="container">
        <p className="loading-message">Loading entries...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Entries for: {form.title}</h1>
        <p className="subtitle">Total Submissions: {entries.length}</p>
      </div>

      <div className="button-group">
        <button className="btn" onClick={() => navigate("/forms")}>
          Back to Forms
        </button>
        <button className="btnPrimary" onClick={() => navigate(`/preview/${id}`)}>
          Add New Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <h2>No Entries Yet</h2>
          <p>No one has submitted this form yet. Be the first!</p>
          <button className="btnPrimary" onClick={() => navigate(`/preview/${id}`)}>
            Fill This Form
          </button>
        </div>
      ) : (
        <div className="entries-table-wrapper">
          <table className="formTable">
            <thead>
              <tr>
                <th>#</th>
                <th>First Field</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{getFirstFieldValue(entry)}</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/entry/${id}/${entry.id}`)}
                    >
                      View
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(entry.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FormEntries;
