import axios from "@/config/http.js";

export const getGroupList = () =>
    axios.get('/group')

export const getGroupInfo = (groupName) =>
    axios.get(`/group/${groupName}`)
