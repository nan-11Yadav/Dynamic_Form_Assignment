function FieldCard({ field, index, onEdit, onDelete, onMoveUp, onMoveDown }) {
  return (
    <div className="field-card">
      <div className="field-header">
        <h4>
          {index + 1}. {field.label}
          {field.required && <span className="required-badge">Required</span>}
        </h4>
      </div>

      <div className="field-info">
        <p>
          <strong>Type:</strong> {field.type}
        </p>
        <p>
          <strong>Field Name:</strong> <code>{field.name}</code>
        </p>

        {field.placeholder && (
          <p>
            <strong>Placeholder:</strong> {field.placeholder}
          </p>
        )}

        {field.options && field.options.length > 0 && (
          <p>
            <strong>Options:</strong> {field.options.join(", ")}
          </p>
        )}
      </div>

      <div className="actions">
        <button className="btn-icon" onClick={() => onMoveUp(index)} title="Move Up">
          Move Up
        </button>
        <button className="btn-icon" onClick={() => onMoveDown(index)} title="Move Down">
          Move Down
        </button>
        <button className="btn-edit" onClick={() => onEdit(index)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(index)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default FieldCard;
