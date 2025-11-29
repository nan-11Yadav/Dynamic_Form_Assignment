import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadFromLocal } from "../utils/loadFromLocal";

function EntryDetail() {
  const { formId, entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const forms = loadFromLocal("forms") || [];
    const foundForm = forms.find((f) => f.id === formId);
    setForm(foundForm);

    const allEntries = loadFromLocal("entries") || {};
    const currentEntry = (allEntries[formId] || []).find((e) => e.id === entryId);
    setEntry(currentEntry);
  }, [formId, entryId]);

  const formatValue = (value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "object" && value.name) {
      // File object
      return (
        <div className="file-detail">
          <p><strong>{value.name}</strong></p>
          <p className="file-meta">
            Size: {(value.size / 1024).toFixed(2)} KB | Type: {value.type}
          </p>
        </div>
      );
    }
    return value || "N/A";
  };

  const getFieldLabel = (fieldName) => {
    if (!form || !form.fields) return fieldName;
    const field = form.fields.find((f) => f.name === fieldName);
    return field ? field.label : fieldName;
  };

  if (!entry || !form) {
    return (
      <div className="container">
        <p className="loading-message">Loading entry details...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="entry-detail-card">
        <div className="page-header">
          <h1>Entry Details</h1>
          <p className="subtitle">Form: {form.title}</p>
          <p className="timestamp">
            Submitted: {new Date(entry.timestamp).toLocaleString()}
          </p>
        </div>

        <button className="btn" onClick={() => navigate(`/entries/${formId}`)}>
          Back to All Entries
        </button>

        <div className="entry-details">
          {Object.entries(entry.values).map(([fieldName, value]) => (
            <div key={fieldName} className="detail-row">
              <div className="detail-label">{getFieldLabel(fieldName)}</div>
              <div className="detail-value">{formatValue(value)}</div>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button className="btn" onClick={() => navigate(`/entries/${formId}`)}>
            Back to Entries
          </button>
          <button className="btnPrimary" onClick={() => navigate(`/preview/${formId}`)}>
            Submit Another Entry
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntryDetail;
