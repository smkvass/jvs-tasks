import { configureStore } from "@reduxjs/toolkit";

import teamReducer from "./team/teamSlice.js";
import memberReducer from "./member/memberSlice.js";
import dashboardReducer from "./dashboard/dashboardSlice.js";

export const store = configureStore({
  reducer: {
    team: teamReducer,
    member: memberReducer,
    dashboard: dashboardReducer,
  },
});