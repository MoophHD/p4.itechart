import {
  GET_QUESTIONS_REQUEST,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAIL,
  GET_QUESTION_REQUEST,
  GET_QUESTION_FAIL,
  GET_QUESTION_SUCCESS,
  VOTE_QUESTION_SUCCESS,
  VOTE_ANSWER_SUCCESS,
  VOTE_FAILED,
  ADD_ANSWER_SUCCESS,
  ADD_ANSWER_FAILURE,
  MARK_ANSWER_BEST,
  SEARCH_QUESTION_SUCCESS,
  SEARCH_QUESTION_FAILURE,
  CREATE_QUESTION_SUCCESS,
  CREATE_QUESTION_FAILURE,
  FILTER_TAGS_SUCCESS,
  FILTER_TAGS_FAILURE,
} from "./questions.types";
import axios from "axios";
import { push } from "connected-react-router";
import { setAlert } from "../alert/alert.actions";
import { checkAndRefreshToken } from "../auth/auth.actions";

export const createQuestion = (title, text, tags) => async (
  dispatch,
  getState
) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);
    const res = await axios.post("/api/questions", { title, text, tags });

    dispatch({
      type: CREATE_QUESTION_SUCCESS,
      payload: res.data.questions,
    });

    dispatch(push("/"));
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: CREATE_QUESTION_FAILURE,
    });
  }
};

export const filterByTag = (tag) => async (dispatch) => {
  try {
    dispatch({ type: GET_QUESTIONS_REQUEST });

    const res = await axios.get(`/api/questions/tag/${tag}`);

    dispatch({
      type: FILTER_TAGS_SUCCESS,
      payload: res.data.questions,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: FILTER_TAGS_FAILURE,
    });
  }
};

export const searchQuestion = (title) => async (dispatch) => {
  try {
    dispatch({ type: GET_QUESTIONS_REQUEST });

    let res;
    if (title && title !== "") {
      res = await axios.get(`/api/questions/search/${title}`);
    } else {
      res = await axios.get("/api/questions/");
    }

    dispatch({
      type: SEARCH_QUESTION_SUCCESS,
      payload: res.data.questions,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: SEARCH_QUESTION_FAILURE,
    });
  }
};

export const markAnswerBest = (questionId, answerId) => async (
  dispatch,
  getState
) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);

    const res = await axios.get(
      `/api/questions/pick-answer/${questionId}/${answerId}`
    );

    dispatch({
      type: MARK_ANSWER_BEST,
      payload: res.data.answer,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: VOTE_FAILED,
    });
  }
};

export const addAnswer = (questionId, text) => async (dispatch, getState) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);

    const res = await axios.post(`/api/answers/`, { questionId, text });
    dispatch({
      type: ADD_ANSWER_SUCCESS,
      payload: res.data.answer,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: ADD_ANSWER_FAILURE,
    });
  }
};

export const upvoteQuestion = (questionId) => async (dispatch, getState) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);

    const res = await axios.get(`/api/votes/upvote/${questionId}`);

    const question = res.data.result;
    dispatch({
      type: VOTE_QUESTION_SUCCESS,
      payload: question,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: VOTE_FAILED,
    });
  }
};

export const downvoteQuestion = (questionId) => async (dispatch, getState) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);

    const res = await axios.get(`/api/votes/downvote/${questionId}`);

    const question = res.data.result;
    dispatch({
      type: VOTE_QUESTION_SUCCESS,
      payload: question,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: VOTE_FAILED,
    });
  }
};

export const upvoteAnswer = (questionId, answerId) => async (
  dispatch,
  getState
) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);

    const res = await axios.get(`/api/votes/upvote/${questionId}/${answerId}`);

    const answer = res.data.result;
    dispatch({
      type: VOTE_ANSWER_SUCCESS,
      payload: answer,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: VOTE_FAILED,
    });
  }
};

export const downvoteAnswer = (questionId, answerId) => async (
  dispatch,
  getState
) => {
  try {
    await checkAndRefreshToken()(dispatch, getState);

    const res = await axios.get(
      `/api/votes/downvote/${questionId}/${answerId}`
    );

    const answer = res.data.result;
    dispatch({
      type: VOTE_ANSWER_SUCCESS,
      payload: answer,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: VOTE_FAILED,
    });
  }
};

export const getQuestion = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_QUESTION_REQUEST });
    const res = await axios.get(`/api/questions/${id}`);

    dispatch({
      type: GET_QUESTION_SUCCESS,
      payload: res.data.question,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: GET_QUESTION_FAIL,
    });
  }
};

export const getQuestions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_QUESTIONS_REQUEST });
    const res = await axios.get("/api/questions/");

    dispatch({
      type: GET_QUESTIONS_SUCCESS,
      payload: res.data.questions,
    });
  } catch (e) {
    dispatch(setAlert(e.message, "danger"));

    dispatch({
      type: GET_QUESTIONS_FAIL,
    });
  }
};
