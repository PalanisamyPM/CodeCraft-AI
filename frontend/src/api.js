import axios from "axios";

const api = axios.create({
    baseURL: "https://code-craft-ai-jet.vercel.app/",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
