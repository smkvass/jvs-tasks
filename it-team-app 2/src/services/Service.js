
import { API_CONFIG, DATA_KEY } from "../api/settings.js";
import { initialDataSample } from "../api/initial-data-sample.js";

const TEAM_CACHE_KEY = "team-cached-data";

function fakeRequest(operation, options = {}) {
  const {
    minDelay = API_CONFIG.minDelay,
    maxDelay = API_CONFIG.maxDelay,
    errorChance = API_CONFIG.errorChance,
  } = options;

  return new Promise((resolve, reject) => {
    const delayMS =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setTimeout(() => {
      if (Math.random() < errorChance) {
        reject(new Error("Simulated server Error"));
        return;
      }

      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delayMS);
  });
}

function initializeDatabase() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
  }
}

function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}


function saveTeamCache(items) {
  localStorage.setItem(TEAM_CACHE_KEY, JSON.stringify(items));
}

export function getCachedTeamList(query = "") {
  const cached = localStorage.getItem(TEAM_CACHE_KEY);

  if (!cached) return null;

  let items;

  try {
    items = JSON.parse(cached);
  } catch {
    return null;
  }

  const params = new URLSearchParams(query);

  const search = (params.get("search") || "").toLowerCase();
  const status = params.get("status") || "all";
  const role = params.get("role") || "all";
  const sort = params.get("sort") || "name";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Number(params.get("limit")) || 3;


  if (search) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search)
    );
  }

  
  if (status !== "all") {
    items = items.filter((item) => item.status === status);
  }

  
  if (role !== "all") {
    items = items.filter((item) => item.role === role);
  }

  
  items = [...items].sort((a, b) => {
    switch (sort) {
      case "name-desc":
        return b.name.localeCompare(a.name);

      case "experience":
        return a.experience - b.experience;

      case "experience-desc":
        return b.experience - a.experience;

      default:
        return a.name.localeCompare(b.name);
    }
  });

  
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

initializeDatabase();


export async function getItemsList(query = "") {
  return fakeRequest(() => {
    const params = new URLSearchParams(query);

    const search = params.get("search") || "";
    const status = params.get("status") || "all";
    const role = params.get("role") || "all";
    const sort = params.get("sort") || "name";
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Number(params.get("limit")) || 3;

    
    const allItems = readData();

    
    saveTeamCache(allItems);

    let items = [...allItems];

    
    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    
    if (status !== "all") {
      items = items.filter((item) => item.status === status);
    }

    
    if (role !== "all") {
      items = items.filter((item) => item.role === role);
    }

    
    items = [...items].sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);

        case "experience":
          return a.experience - b.experience;

        case "experience-desc":
          return b.experience - a.experience;

        default:
          return a.name.localeCompare(b.name);
      }
    });

    
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      data: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }, { errorChance: 0 });
}


export async function getItem(id) {
  return fakeRequest(() => {
    const items = readData();

    const item = items.find((item) => item.id === Number(id));

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  });
}


export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();

    const nextId =
      items.length > 0
        ? Math.max(...items.map((item) => Number(item.id))) + 1
        : 1;

    const newItem = {
      ...data,
      id: nextId,
    };

    const updatedItems = [...items, newItem];

    writeData(updatedItems);
    saveTeamCache(updatedItems);

    return newItem;
  });
}

// UPDATE TEAM MEMBER
export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    const exists = items.some((item) => item.id === numericId);

    if (!exists) {
      throw new Error("Item not found");
    }

    const updatedItems = items.map((item) =>
      item.id === numericId
        ? {
            ...item,
            ...changes,
            id: numericId,
          }
        : item
    );

    writeData(updatedItems);
    saveTeamCache(updatedItems);

    return updatedItems.find((item) => item.id === numericId);
  });
}


export async function deleteItem(id) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    const exists = items.some((item) => item.id === numericId);

    if (!exists) {
      throw new Error("Item not found");
    }

    const updatedItems = items.filter((item) => item.id !== numericId);

    writeData(updatedItems);
    saveTeamCache(updatedItems);

    return {
      success: true,
      id: numericId,
    };
  });
}
