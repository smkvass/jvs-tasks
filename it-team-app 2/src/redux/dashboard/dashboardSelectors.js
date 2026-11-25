import { createSelector } from "@reduxjs/toolkit";

// Обычные селекторы для получения данных из Redux
export const selectDashboardItems = (state) =>
  state.dashboard.items;

export const selectStatusFilter = (state) =>
  state.dashboard.statusFilter;

// 1. Мемоизированный селектор отфильтрованных участников
export const selectFilteredItems = createSelector(
  [selectDashboardItems, selectStatusFilter],
  (items, statusFilter) => {
    if (statusFilter === "all") {
      return items;
    }

    return items.filter(
      (item) => item.status === statusFilter
    );
  }
);

// 2. Мемоизированный селектор статистики
export const selectDashboardStats = createSelector(
  [selectFilteredItems],
  (items) => {
    const total = items.length;

    const available = items.filter(
      (item) => item.status === "available"
    ).length;

    const working = items.filter(
      (item) => item.status === "working"
    ).length;

    const onLeave = items.filter(
      (item) => item.status === "on_leave"
    ).length;

    const averageExperience = total
      ? (
          items.reduce(
            (sum, item) =>
              sum + (Number(item.experience) || 0),
            0
          ) / total
        ).toFixed(1)
      : "0";

    return {
      total,
      available,
      working,
      onLeave,
      averageExperience,
    };
  }
);

// 3. Селектор количества участников по ролям
export const selectMembersByRole = createSelector(
  [selectFilteredItems],
  (items) => {
    const roleCounts = {};

    items.forEach((item) => {
      const role = item.role || "Not specified";

      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    return roleCounts;
  }
);