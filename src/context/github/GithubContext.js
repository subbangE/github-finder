import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  //const [users, setUsers] = useState([]);
  //const [loading, setLoading] = useState(true);
  //스테이트의 초기값
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(githubReducer, initialState);
  //테스트용 유저검색
  const fetchUsers = async () => {
    setLoading(); //데이터를 가져오기 전에 로딩을 true로 업데이트
    const response = await fetch("https://api.github.com/users", {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    const data = await response.json(); //제이슨 변환
    dispatch({
      type: "GET_USERS",
      payload: data,
    });
  };
  //특정 단어로 유저찾기
  const searchUsers = async (text) => {
    setLoading(); //데이터를 가져오기 전에 로딩을 true로 업데이트
    const params = new URLSearchParams({ q: text });
    const response = await fetch(
      `https://api.github.com/search/users?${params}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const { items } = await response.json(); //제이슨 변환
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  // 한명의 유저 검색
  const getUser = async (login) => {
    setLoading(); //데이터를 가져오기 전에 로딩을 true로 업데이트

    const response = await fetch(`https://api.github.com/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    // 유저를 못찾은 경우 못찾음 페이지 표시
    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json(); //제이슨 변환
      dispatch({
        type: "GET_USER",
        payload: data,
        loading: false,
      });
    }
  };

  //특정 단어로 유저찾기
  const getUserRepo = async (login) => {
    setLoading();

    const pararms = new URLSearchParams({
      sort: "created",
      per_page: 10,
    });

    const response = await fetch(
      `https://api.github.com/users/${login}/repos?${pararms}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const data = await response.json();

    dispatch({
      type: "GET_REPOS",
      payload: data,
      loading: false,
    });
  };

  //로딩상태를 true로 업데이트하기 위한 dispatch
  const setLoading = () =>
    dispatch({
      type: "SET_LOADING",
    });
  //유저 클리어
  const clearUsers = () =>
    dispatch({
      type: "CLEAR_USERS",
    });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepo,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
