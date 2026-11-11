
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Card from "../components/Card";
import Loader from "../components/Loader";
import ItemForm from "../components/ItemForm.jsx";

import {
  createItem,
  updateItem,
  deleteItem,
  getItemsList,
} from "../services/Service.js";

export default function Team() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState("");

  const queryString = searchParams.toString();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const role = searchParams.get("role") || "all";
  const sort = searchParams.get("sort") || "name";
  const page = Number(searchParams.get("page")) || 1;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["team", queryString],
    queryFn: () => getItemsList(queryString),
  });

  const items = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const saveMutation = useMutation({
    mutationFn: ({ id, values }) => {
      if (id) {
        return updateItem(id, values);
      }
      return createItem(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  
  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

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
    setFormError("");

    try {
      await saveMutation.mutateAsync({
        id: editingItem?.id,
        values,
      });

      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      setFormError(err.message || "Failed to save member");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) return;

    setFormError("");

    try {
      await deleteMutation.mutateAsync(id);
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

      <button
        onClick={() => {
          setEditingItem(null);
          setFormError("");
          setShowForm(true);
        }}
      >
        + Add Member
      </button>

      {showForm && (
        <ItemForm
          initial={editingItem}
          submitting={saveMutation.isPending}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {isLoading && <Loader />}

      {isError && (
        <div className="error-message">
          <p>{error.message}</p>
          <button className="retry-button" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <p className="state">No team members found.</p>
      )}

      {!isLoading && !isError && (
        <>
          <div className="team-grid">
            {items.map((item) => (
              <Card
                key={item.id}
                item={item}
                onEdit={(member) => {
                  setEditingItem(member);
                  setFormError("");
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
