import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "http://localhost:80",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true, // default: false , false 인 경우, sessionid 를 매번 신규로 발급
});
