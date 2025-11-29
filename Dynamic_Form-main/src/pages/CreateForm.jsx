import { useState, useEffect } from "react";
import { saveToLocal } from "../utils/saveToLocal";
import { loadFromLocal } from "../utils/loadFromLocal";
import { v4 as uuid } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import FieldCard from "../components/FieldCard";

function CreateForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);

  const [newField, setNewField] = useState({
    label: "",
    type: "text",
    required: false,
    options: "",
    placeholder: "",
  });

  // Load form data if editing
  useEffect(() => {
    if (id) {
      const forms = loadFromLocal("forms") || [];
      const formToEdit = forms.find((f) => f.id === id);
      if (formToEdit) {
        setFormTitle(formToEdit.title);
        setFormDescription(formToEdit.description || "");
        setFields(formToEdit.fields || []);
      }
    }
  }, [id]);

  // Auto-generate field name from label
  const generateFieldName = (label) => {
    let fieldName = label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .trim();

    // Ensure uniqueness
    let counter = 1;
    let uniqueName = fieldName;
    while (fields.some((f) => f.name === uniqueName)) {
      uniqueName = `${fieldName}_${counter}`;
      counter++;
    }

    return uniqueName;
  };

  const addField = () => {
    if (!newField.label.trim()) {
      alert("Field label is required!");
      return;
    }

    // Validate options for radio/select
    if ((newField.type === "radio" || newField.type === "select") && !newField.options.trim()) {
      alert("Please provide options for this field type!");
      return;
    }

    const fieldName = generateFieldName(newField.label);
    const fieldId = uuid();

    const fieldData = {
      id: fieldId,
      name: fieldName,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      placeholder: newField.placeholder || "",
      options:
        newField.type === "radio" || newField.type === "select"
          ? newField.options.split(",").map((o) => o.trim()).filter(o => o)
          : [],
    };

    if (editingFieldIndex !== null) {
      // Update existing field
      const updated = [...fields];
      updated[editingFieldIndex] = fieldData;
      setFields(updated);
      setEditingFieldIndex(null);
    } else {
      // Add new field
      setFields((prev) => [...prev, fieldData]);
    }

    // Reset form
    setNewField({
      label: "",
      type: "text",
      required: false,
      options: "",
      placeholder: "",
    });
  };

  const editField = (index) => {
    const field = fields[index];
    setNewField({
      label: field.label,
      type: field.type,
      required: field.required,
      options: field.options ? field.options.join(", ") : "",
      placeholder: field.placeholder || "",
    });
    setEditingFieldIndex(index);
  };

  const deleteField = (index) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...fields];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFields(updated);
  };

  const moveDown = (index) => {
    if (index === fields.length - 1) return;
    const updated = [...fields];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setFields(updated);
  };

  const saveForm = () => {
    if (!formTitle.trim()) {
      alert("Form title is required!");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field to the form!");
      return;
    }

    const existingForms = loadFromLocal("forms") || [];
    let updatedForms;

    if (id) {
      // Update existing form
      updatedForms = existingForms.map((f) =>
        f.id === id
          ? { ...f, title: formTitle, description: formDescription, fields }
          : f
      );
      alert("Form updated successfully!");
    } else {
      // Create new form
      const formData = {
        id: uuid(),
        title: formTitle,
        description: formDescription,
        fields,
        createdAt: new Date().toISOString(),
      };
      updatedForms = [...existingForms, formData];
      alert("Form created successfully!");
    }

    saveToLocal("forms", updatedForms);
    navigate("/forms");
  };

  const cancelEdit = () => {
    if (window.confirm("Are you sure? Any unsaved changes will be lost.")) {
      navigate("/forms");
    }
  };

  return (
    <div className="container">
      {/*
        Added a small style block to keep the two headings on the same row at
        desktop/tablet widths while stacking on small screens. Each column takes 50%.
      */}
      <style>{`
        .header-row { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 18px; }
        .header-col { flex: 0 0 50%; max-width: 50%; box-sizing: border-box; }
        .header-col h1, .header-col h2 { margin: 0; }

        /* smaller screens - stack the headings to avoid overflow */
        @media (max-width: 640px) {
          .header-col { flex: 0 0 100%; max-width: 100%; }
        }
      `}</style>

      <div className="header-row">
        <div className="header-col">
          <h1>{id ? "Edit Form" : "Create New Form"}</h1>
        </div>

        <div className="header-col" style={{ textAlign: 'right' }}>
          <h2 style={{ display: 'inline-block' }}>{editingFieldIndex !== null ? "Edit Field" : "Add Field"}</h2>
        </div>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-col-50">
            <label className="form-label">Form Title *</label>
            <input
              type="text"
              placeholder="e.g., Job Application Form"
              className="input"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div className="form-col-50">
            <label className="form-label">Form Description (Optional)</label>
            <textarea
              placeholder="Brief description of this form..."
              className="input"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="fieldBuilder">
        <label className="form-label">Field Label *</label>
        <input
          type="text"
          placeholder="e.g., Full Name, Email Address"
          className="input"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />

        <label className="form-label">Field Type *</label>
        <select
          className="input"
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          <option value="text">Text Input (Single Line)</option>
          <option value="textarea">Textarea (Multi-line)</option>
          <option value="radio">Radio Button Group</option>
          <option value="checkbox">Checkbox (Boolean)</option>
          <option value="select">Select Dropdown</option>
          <option value="file">File Upload</option>
        </select>

        {(newField.type === "text" || newField.type === "textarea") && (
          <>
            <label className="form-label">Placeholder Text (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Enter your name here..."
              className="input"
              value={newField.placeholder}
              onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
            />
          </>
        )}

        {(newField.type === "radio" || newField.type === "select") && (
          <>
            <label className="form-label">Options * (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., Male, Female, Other"
              className="input"
              value={newField.options}
              onChange={(e) => setNewField({ ...newField, options: e.target.value })}
            />
          </>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={newField.required}
            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
          />
          <span>Mark as Required Field</span>
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btnPrimary" 
            onClick={addField}
            style={{ flex: 1 }}
          >
            {editingFieldIndex !== null ? "Update Field" : "Add Field"}
          </button>
          {editingFieldIndex !== null && (
            <button
              className="btn"
              onClick={() => {
                setEditingFieldIndex(null);
                setNewField({
                  label: "",
                  type: "text",
                  required: false,
                  options: "",
                  placeholder: "",
                });
              }}
              style={{ flex: 1 }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <h2>Form Fields ({fields.length})</h2>

      {fields.length === 0 && (
        <p className="empty-message">No fields added yet. Add your first field above!</p>
      )}

      {fields.map((field, index) => (
        <FieldCard
          key={field.id}
          field={field}
          index={index}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onEdit={editField}
          onDelete={deleteField}
        />
      ))}

      <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="btnPrimary" 
          onClick={saveForm}
          style={{ flex: 1 }}
        >
          {id ? "Update Form" : "Save Form"}
        </button>
        <button 
          className="btn-cancel" 
          onClick={cancelEdit}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateForm;
