import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REFRESH_TOKEN_SUCCESS,
  CHECK_TOKEN_SUCCESS,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
} from "./auth.types";
import axios from "axios";
import setAuthToken from "./auth.utils";

const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/auth/load-user/`);

    dispatch({ type: LOAD_USER_SUCCESS, payload: res.data.user });
  } catch (e) {
    dispatch({ type: LOAD_USER_FAIL });
  }
};

export const checkAndRefreshToken = () => async (dispatch, getState) => {
  try {
    const previousToken = getState().auth.token;
    const resCheckToken = await axios.get("/api/auth/checkToken/" + previousToken);
    if (resCheckToken.data.isValid) {
      dispatch({ type: CHECK_TOKEN_SUCCESS });
      return;
    }

    const res = await axios.get("/api/auth/refreshToken");
    const token = res.data.token;
    setAuthToken(token);

    if (!getState().auth.user) dispatch(loadUser());

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: { token },
    });
  } catch (e) {
    dispatch({
      type: LOAD_USER_FAIL,
    });
  }
};

export const register = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/register", data);
    const token = res.data.token;
    setAuthToken(token);

    dispatch(loadUser());
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/login", data);
    const token = res.data.token;
    setAuthToken(token);

    dispatch(loadUser());
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
