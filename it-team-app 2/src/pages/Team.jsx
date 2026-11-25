
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks.js";
import { fetchDashboard } from "../redux/dashboard/dashboardThunks.js";

import {
  fetchTeam,
  addTeamMember,
  editTeamMember,
  removeTeamMember,
} from "../redux/team/teamThunks.js";

import Card from "../components/Card";
import Loader from "../components/Loader";
import ItemForm from "../components/ItemForm.jsx";

export default function Team() {
  const dispatch = useAppDispatch();

  const {
    items,
    totalPages,
    status: requestStatus,
    error,
    isCached,
    mutationStatus,
  } = useAppSelector((state) => state.team);

  const isLoading = requestStatus === "loading";
  const isError = requestStatus === "failed";

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  
  const [searchParams, setSearchParams] = useSearchParams();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState("");

  const queryString = searchParams.toString();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const role = searchParams.get("role") || "all";
  const sort = searchParams.get("sort") || "name";
  const page = Number(searchParams.get("page")) || 1;

 
  const [searchInput, setSearchInput] = useState(search);

  // Загружаем участников при изменении параметров URL
  useEffect(() => {
    dispatch(fetchTeam(queryString));
  }, [dispatch, queryString, isOnline]);

  // Синхронизация поля поиска с URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce: ждём 300 мс после последнего ввода
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchInput.trim()) {
        params.set("search", searchInput.trim());
      } else {
        params.delete("search");
      }

      params.delete("page");

      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  // Обновление фильтров в URL
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

  // Создание и редактирование участника
  async function handleSubmit(values) {
    setFormError("");

    try {
      if (editingItem) {
        await dispatch(
          editTeamMember({
            id: editingItem.id,
            changes: values,
          })
        ).unwrap();
      } else {
        await dispatch(addTeamMember(values)).unwrap();
      }

      setShowForm(false);
      setEditingItem(null);

      dispatch(fetchTeam(queryString));
      dispatch(fetchDashboard());
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err.message || "Failed to save member"
      );
    }
  }

  // Удаление участника
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) return;

    setFormError("");

    try {
      await dispatch(removeTeamMember(id)).unwrap();

      dispatch(fetchTeam(queryString));
      dispatch(fetchDashboard());
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err.message || "Failed to delete member"
      );
    }
  }

  return (
    <div className="team-page">
      <h1>Our Team</h1>

      <p className="muted">
        Manage your startup team members.
      </p>

      

      {/* Поиск, фильтры и сортировка */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search members..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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

      {/* Добавление участника */}
      <button
        onClick={() => {
          setEditingItem(null);
          setFormError("");
          setShowForm(true);
        }}
      >
        + Add Member
      </button>

      {/* Форма */}
      {showForm && (
        <ItemForm
          initial={editingItem}
          submitting={mutationStatus === "loading"}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Loading */}
      {isLoading && <Loader />}

      {/* Error и Retry */}
      {isError && (
        <div className="error-message">
          <p>{error}</p>

          <button
            className="retry-button"
            onClick={() => dispatch(fetchTeam(queryString))}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && items.length === 0 && (
        <p className="state">
          No team members found.
        </p>
      )}

      {/* Список участников */}
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

          {/* Pagination */}
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
              disabled={page >= totalPages || totalPages === 0}
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
