import axios from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const PERSONAL_ACCESS_TOKEN = process.env.REACT_APP_TOKEN;

if (!PERSONAL_ACCESS_TOKEN) {
  throw new Error('GitHub Personal Access Token is not provided. Please set REACT_APP_GITHUB_TOKEN in your .env file.');
}

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`,
  },
});


export const fetchGitHubUsers = async (searchTerm: string, page: number = 1, perPage: number = 10) => {
  try {
    const response = await axiosInstance.get(`${GITHUB_API_BASE_URL}/search/users`, {
      params: {
        q: searchTerm,
        sort: 'followers',
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGitHubUserDetails = async (username: string) => {
  try {
    const response = await axiosInstance.get(`${GITHUB_API_BASE_URL}/users/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
