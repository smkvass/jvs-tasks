import { useState, useEffect } from "react";
import { getItemsList, getItem, createItem, updateItem, deleteItem } from "./api/fakeApi";
import ItemList from "./components/ItemList";
import ItemDetails from "./components/ItemDetails";
import ItemForm from "./components/ItemForm";

export default function App() {
  
  const [items, setItems] = useState([]);
  const [listStatus, setListStatus] = useState("loading"); 
  const [listError, setListError] = useState("");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("idle"); 
  const [detailsError, setDetailsError] = useState("");
  const [detailsReloadKey, setDetailsReloadKey] = useState(0);

  
  const [busyIds, setBusyIds] = useState([]); 
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(null); 
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");

  
  useEffect(() => {
    let ignore = false; 
    setListStatus("loading");
    setListError("");

    getItemsList(`?search=${encodeURIComponent(search)}&limit=100`)
      .then((res) => {
        if (ignore) return;
        setItems(res.data);
        setListStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setListError(err.message);
        setListStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [search, reloadKey]);

  
  useEffect(() => {
    if (selectedId === null) {
      setDetails(null);
      setDetailsStatus("idle");
      return;
    }
    let ignore = false;
    setDetails(null); 
    setDetailsStatus("loading");
    setDetailsError("");

    getItem(selectedId)
      .then((item) => {
        if (ignore) return;
        setDetails(item);
        setDetailsStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setDetailsError(err.message);
        setDetailsStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [selectedId, detailsReloadKey]);

  function lock(id) {
    setBusyIds((prev) => [...prev, id]);
  }
  function unlock(id) {
    setBusyIds((prev) => prev.filter((x) => x !== id));
  }

  
  function applyUpdated(updated) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setDetails((prev) => (prev && prev.id === updated.id ? updated : prev));
  }

  
  async function handleComplete(item) {
    const id = item.id;
    if (busyIds.includes(id)) return; 
    let changes;
    if (item.status === "available") {
      changes = { status: "working" };
    } else if (item.status === "working") {
      changes = { status: "available", tasksCompleted: (item.tasksCompleted || 0) + 1 };
    } else {
      return; 
    }

    lock(id);
    setNotice("");
    try {
      const updated = await updateItem(id, changes);
      applyUpdated(updated);
    } catch (err) {
      setNotice(`Could not update "${item.name}": ${err.message}`);
    } finally {
      unlock(id);
    }
  }

  async function handleDelete(item) {
    const id = item.id;
    if (busyIds.includes(id)) return;
    if (!window.confirm(`Remove ${item.name}?`)) return;

    lock(id);
    setNotice("");
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      
      setSelectedId((current) => (current === id ? null : current));
    } catch (err) {
      setNotice(`Could not remove "${item.name}": ${err.message}`);
    } finally {
      unlock(id);
    }
  }

  async function handleSave(values) {
    const editing = form.item; 
    setFormBusy(true);
    setFormError("");
    try {
      if (editing) {
        const updated = await updateItem(editing.id, values);
        applyUpdated(updated);
        setForm(null);
      } else {
        
        const { name, description, ...rest } = values;
        const created = await createItem({ name, description });
        let saved = created;
        try {
          saved = await updateItem(created.id, { ...rest, tasksCompleted: 0 });
          setNotice("");
        } catch (err) {
          setNotice(`"${name}" was created, but extra fields failed to save (${err.message}). Edit it to retry.`);
        }
        setItems((prev) => [...prev, saved]);
        setForm(null);
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormBusy(false);
    }
  }

  function openForm(item) {
    setFormError("");
    setForm({ item });
  }

  const listLoading = listStatus === "loading";

  return (
    <div className="app">
      <header>
        <h1>IT Team Manager</h1>
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button disabled={listLoading} onClick={() => setReloadKey((k) => k + 1)}>Reload</button>
          <button className="primary" disabled={listLoading} onClick={() => openForm(null)}>+ New</button>
        </div>
      </header>

      {notice && (
        <p className="error banner">
          {notice} <button onClick={() => setNotice("")}>✕</button>
        </p>
      )}

      <main>
        <section className="panel">
          <h2>Team</h2>
          {listLoading && <p className="state">Loading list…</p>}
          {listStatus === "error" && (
            <div className="state">
              <p className="error">Failed to load: {listError}</p>
              <button onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
            </div>
          )}
          {listStatus === "success" && items.length === 0 && (
            <p className="state">{search ? "Nothing found for this search." : "No team members yet. Add one!"}</p>
          )}
          {listStatus === "success" && items.length > 0 && (
            <ItemList items={items} selectedId={selectedId} busyIds={busyIds} onSelect={setSelectedId} />
          )}
        </section>

        <section className="panel">
          <h2>Details</h2>
          {detailsStatus === "idle" && <p className="state">Select a team member from the list.</p>}
          {detailsStatus === "loading" && <p className="state">Loading details…</p>}
          {detailsStatus === "error" && (
            <div className="state">
              <p className="error">Failed to load details: {detailsError}</p>
              <button onClick={() => setDetailsReloadKey((k) => k + 1)}>Try again</button>
            </div>
          )}
          {detailsStatus === "success" && details && details.id === selectedId && (
            <ItemDetails
              item={details}
              busy={busyIds.includes(details.id)}
              onEdit={openForm}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      {form && (
        <ItemForm
          initial={form.item}
          submitting={formBusy}
          error={formError}
          onSubmit={handleSave}
          onCancel={() => setForm(null)}
        />
      )}
    </div>
  );
}
