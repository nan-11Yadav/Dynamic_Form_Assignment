import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadFromLocal } from "../utils/loadFromLocal";
import { saveToLocal } from "../utils/saveToLocal";
import { v4 as uuid } from "uuid";

function PreviewForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedForms = loadFromLocal("forms") || [];
    const found = savedForms.find((f) => f.id === id);
    setForm(found);

    // Initialize form data
    if (found) {
      const initialData = {};
      found.fields.forEach((field) => {
        initialData[field.name] = field.type === "checkbox" ? false : "";
      });
      setFormData(initialData);
    }
  }, [id]);

  const handleChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const handleFileChange = (fieldName, file) => {
    if (file) {
      // Store file metadata (since we can't store actual file in localStorage)
      setFormData({
        ...formData,
        [fieldName]: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    form.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];

        if (field.type === "checkbox") {
          if (!value) {
            newErrors[field.name] = "This field is required";
          }
        } else if (field.type === "file") {
          if (!value || !value.name) {
            newErrors[field.name] = "Please select a file";
          }
        } else {
          if (!value || value.toString().trim() === "") {
            newErrors[field.name] = "This field is required";
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields!");
      return;
    }

    // Save entry to localStorage
    const entry = {
      id: uuid(),
      formId: id,
      values: formData,
      timestamp: new Date().toISOString(),
    };

    const allEntries = loadFromLocal("entries") || {};
    if (!allEntries[id]) {
      allEntries[id] = [];
    }
    allEntries[id].push(entry);
    saveToLocal("entries", allEntries);

    setSubmitted(true);
  };

  const handleSubmitAnother = () => {
    // Reset form
    const initialData = {};
    form.fields.forEach((field) => {
      initialData[field.name] = field.type === "checkbox" ? false : "";
    });
    setFormData(initialData);
    setErrors({});
    setSubmitted(false);
  };

  if (!form) {
    return (
      <div className="container">
        <p className="loading-message">Loading form...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="success-card">
          <h1>Form Submitted Successfully!</h1>
          <p>Your response has been recorded.</p>
          <div className="button-group">
            <button className="btnPrimary" onClick={handleSubmitAnother}>
              Submit Another Response
            </button>
            <button className="btn" onClick={() => navigate("/forms")}>
              Back to Form Library
            </button>
            <button className="btn" onClick={() => navigate(`/entries/${id}`)}>
              View All Entries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-preview-card">
        <h1 className="form-title">{form.title}</h1>
        {form.description && <p className="form-description">{form.description}</p>}

        <form onSubmit={handleSubmit} className="preview-form">
          {form.fields.map((field) => (
            <div key={field.id} className="form-field">
              <label className="field-label">
                {field.label}
                {field.required && <span className="required-star"> *</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  className={`input ${errors[field.name] ? "input-error" : ""}`}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  className={`input ${errors[field.name] ? "input-error" : ""}`}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows="4"
                />
              )}

              {field.type === "radio" && (
                <div className="radio-group">
                  {field.options.map((option, idx) => (
                    <label key={idx} className="radio-label">
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        checked={formData[field.name] === option}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === "checkbox" && (
                <label className="checkbox-label-inline">
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                  />
                  <span>Yes, I agree</span>
                </label>
              )}

              {field.type === "select" && (
                <select
                  className={`input ${errors[field.name] ? "input-error" : ""}`}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">-- Select an option --</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "file" && (
                <div>
                  <input
                    type="file"
                    className={`input ${errors[field.name] ? "input-error" : ""}`}
                    onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                  />
                  {formData[field.name] && formData[field.name].name && (
                    <p className="file-info">
                      Selected: {formData[field.name].name} (
                      {(formData[field.name].size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              )}

              {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
            </div>
          ))}

          <div className="button-group">
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="submit" className="btnPrimary">
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PreviewForm;
