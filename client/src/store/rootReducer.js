import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./auth";
import organizationReducer from "./organization"

const rootReducer = combineReducers({
  auth: authReducer,
  organization: organizationReducer,
});

export default rootReducer;