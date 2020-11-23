import {
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAIL,
  GET_QUESTION_SUCCESS,
  GET_QUESTION_FAIL,
  VOTE_QUESTION_SUCCESS,
  VOTE_ANSWER_SUCCESS,
  VOTE_FAILED,
} from "./questions.types";

const initialState = {
  questions: [],
  question: null,
  loading: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case VOTE_QUESTION_SUCCESS:
      return {
        ...state,
        question: {
          ...state.question,
          score: action.payload.score,
          votes: action.payload.votes,
        },
      };
    case VOTE_ANSWER_SUCCESS:
      const question = state.question;
      const answers = question.answers;

      const updatedAnswer = action.payload;
      const nextVotes = updatedAnswer.votes;
      const nextScore = updatedAnswer.score;
      const id = updatedAnswer._id;

      const previousAnswer = answers.find((answer) => answer._id === id);
      return {
        ...state,
        question: {
          ...question,
          answers: [
            ...answers.filter((answer) => answer._id !== id),
            { ...previousAnswer, votes: nextVotes, score: nextScore },
          ],
        },
      };
    case VOTE_FAILED:
      return state;
    case GET_QUESTION_SUCCESS:
      return { ...state, question: action.payload, loading: false };
    case GET_QUESTIONS_SUCCESS:
      return { ...state, questions: action.payload, loading: false };
    case GET_QUESTIONS_FAIL:
    case GET_QUESTION_FAIL:
      return { ...state, questions: [], loading: false, question: null };
    default:
      return state;
  }
};

export default reducer;
