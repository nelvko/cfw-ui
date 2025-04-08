import axios from "axios";

const secret = '666'
export default axios.create({
  baseURL: 'http://120.46.87.172:9090',
  timeout: 10000,
  headers: {'Authorization': `Bearer ${secret}`}
});
