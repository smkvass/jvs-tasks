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
        reject(new Error("Something went wrong. Please try again."));
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


function readData() {
  const storedData = localStorage.getItem(DATA_KEY);

  if (!storedData) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
    return initialDataSample;
  }

  try {
    return JSON.parse(storedData);
  } catch {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
    return initialDataSample;
  }
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}


function saveTeamCache(items) {
  localStorage.setItem(TEAM_CACHE_KEY, JSON.stringify(items));
}


function getQueryOptions(query = "") {
  const params = new URLSearchParams(query);

  return {
    search: (params.get("search") || "").toLowerCase(),
    status: params.get("status") || "all",
    role: params.get("role") || "all",
    sort: params.get("sort") || "name",
    page: Math.max(1, Number(params.get("page")) || 1),
    limit: Math.max(1, Number(params.get("limit")) || 3),
  };
}


function processTeamList(items, query = "") {
  const {
    search,
    status,
    role,
    sort,
    page,
    limit,
  } = getQueryOptions(query);

  let filteredItems = [...items];

 
  if (search) {
    filteredItems = filteredItems.filter((item) => {
      return (
        (item.name || "").toLowerCase().includes(search) ||
        (item.lastName || "").toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search)
      );
    });
  }

  
  if (status !== "all") {
    filteredItems = filteredItems.filter(
      (item) => item.status === status
    );
  }

  
  if (role !== "all") {
    filteredItems = filteredItems.filter(
      (item) => item.role === role
    );
  }


  filteredItems.sort((a, b) => {
    switch (sort) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");

      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");

      case "experience":
        return (
          (Number(a.experience) || 0) -
          (Number(b.experience) || 0)
        );

      case "experience-desc":
        return (
          (Number(b.experience) || 0) -
          (Number(a.experience) || 0)
        );

      default:
        return 0;
    }
  });

  
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + limit
  );

  return {
    data: paginatedItems,
    total,
    page,
    limit,
    totalPages,
  };
}


export function getCachedTeamList(query = "") {
  const cachedData = localStorage.getItem(TEAM_CACHE_KEY);

  if (!cachedData) {
    return null;
  }

  try {
    const items = JSON.parse(cachedData);

    if (!Array.isArray(items)) {
      return null;
    }

    return {
      ...processTeamList(items, query),
      isCached: true,
    };
  } catch {
    return null;
  }
}


export function getCachedDashboardList() {
  const cachedData = localStorage.getItem(TEAM_CACHE_KEY);

  if (!cachedData) {
    return null;
  }

  try {
    const items = JSON.parse(cachedData);
    return Array.isArray(items) ? items : null;
  } catch {
    return null;
  }
}


export async function getItemsList(query = "") {
  return fakeRequest(() => {
    const items = readData();

    saveTeamCache(items);

    return processTeamList(items, query);
  }, {
    errorChance: 0,
  });
}

export async function getItem(id) {
  return fakeRequest(() => {
    const items = readData();

    const item = items.find(
      (member) => String(member.id) === String(id)
    );

    if (!item) {
      throw new Error("Member not found");
    }

    return item;
  });
}


export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();

    const newItem = {
      ...data,
      id: Date.now().toString(),
    };

    const updatedItems = [...items, newItem];

    writeData(updatedItems);
    saveTeamCache(updatedItems);

    return newItem;
  });
}


export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const items = readData();

    const index = items.findIndex(
      (item) => String(item.id) === String(id)
    );

    if (index === -1) {
      throw new Error("Member not found");
    }

    const updatedItem = {
      ...items[index],
      ...changes,
      id: items[index].id,
    };

    const updatedItems = [...items];

    updatedItems[index] = updatedItem;

    writeData(updatedItems);
    saveTeamCache(updatedItems);

    return updatedItem;
  });
}


export async function deleteItem(id) {
  return fakeRequest(() => {
    const items = readData();

    const updatedItems = items.filter(
      (item) => String(item.id) !== String(id)
    );

    if (updatedItems.length === items.length) {
      throw new Error("Member not found");
    }

    writeData(updatedItems);
    saveTeamCache(updatedItems);

    return { id };
  });
}
