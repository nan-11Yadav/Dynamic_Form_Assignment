import { Link } from "react-router-dom";

function FormCard({ form, onDelete, onEdit }) {
  return (
    <div className="form-card">
      <h3>{form.title}</h3>

      <div className="actions">
        <Link to={`/preview/${form.id}`}>
          <button>Fill Form</button>
        </Link>

        <button onClick={() => onEdit(form.id)}>Edit</button>

        <Link to={`/entries/${form.id}`}>
          <button>View Entries</button>
        </Link>

        <button onClick={() => onDelete(form.id)}>Delete</button>
      </div>
    </div>
  );
}

export default FormCard;
