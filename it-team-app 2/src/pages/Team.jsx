import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/Loader";

import {
  createItem,
  updateItem,
  deleteItem,
  getItemsList
} from "../services/Service.js";
import ItemForm from "../components/ItemForm.jsx";

export default function Team() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const queryString = searchParams.toString();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const role = searchParams.get("role") || "all";
  const sort = searchParams.get("sort") || "name";
  const page = Number(searchParams.get("page")) || 1;

  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
  let ignore = false;

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      const result = await getItemsList(queryString);

      if (!ignore) {
        setItems(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (err) {
      if (!ignore) setError(err.message);
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  loadItems();

  return () => {
    ignore = true;
  };
}, [queryString, reloadKey]);

  function updateFilter(key, value) {
  const params = new URLSearchParams(searchParams);

  if (value === "all" || value === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  if (key !== "page") {
    params.delete("page");
  }

  setSearchParams(params);
}

async function handleSubmit(values) {
  setSubmitting(true);
  setFormError("");

  try {
    if (editingItem) {
      await updateItem(editingItem.id, values);
    } else {
      await createItem(values);
    }

    setShowForm(false);
    setEditingItem(null);
    setReloadKey((prev) => prev + 1);
  } catch (err) {
    setFormError(err.message || "Failed to save member");
  } finally {
    setSubmitting(false);
  }
}

async function handleDelete(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this member?"
  );

  if (!confirmed) return;

  try {
    await deleteItem(id);
    setReloadKey((prev) => prev + 1);
  } catch (err) {
    setFormError(err.message || "Failed to delete member");
  }
}

  return (
    
    <div className="team-page">
      <h1>Our Team</h1>
      <p className="muted">Manage your startup team members.</p>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="working">Working</option>
          <option value="on_leave">On leave</option>
        </select>

        <select
          value={role}
          onChange={(e) => updateFilter("role", e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="Tech Lead">Tech Lead</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="QA Engineer">QA Engineer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
        </select>

        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
        >
          <option value="name">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="experience">Experience: Low to High</option>
          <option value="experience-desc">Experience: High to Low</option>
        </select>
      </div>

      
      <button onClick={() => {
  setEditingItem(null);
  setFormError("");
  setShowForm(true);
}}>
  + Add Member
</button>

      {/* ФОРМА */}
      {showForm && (
        <ItemForm
          initial={editingItem}
          submitting={submitting}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => {
    setShowForm(false);
    setEditingItem(null);
  }}
        />
      )}


      {loading && <Loader />}

      {error && (
  <div className="error-message">
    <p>{error}</p>
    <button
      className="retry-button"
      onClick={() => setReloadKey((prev) => prev + 1)}
    >
      Retry
    </button>
  </div>
)}

      {!loading && !error && items.length === 0 && (
        <p className="state">No team members found.</p>
      )}

      {!loading && !error && (
        <>
          <div className="team-grid">
            {items.map((item) => (
  <Card
    key={item.id}
    item={item}
    onEdit={(member) => {
      setEditingItem(member);
      setShowForm(true);
    }}
    onDelete={handleDelete}
  />
))}
          </div>

          <div className="pagination">
              <button
                  disabled={page <= 1}
                    onClick={() => updateFilter("page", page - 1)}
              >
              Previous
              </button>

              <span>
              Page {page} of {totalPages}
              </span>

              <button
              disabled={page >= totalPages}
              onClick={() => updateFilter("page", page + 1)}
              >
              Next
              </button>
          </div>
        </>
      )}
    </div>
  );
}
