import axios from 'axios';
// ---------------------------- Student API ------------------------------------------------- //
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getStudents(
  offset: number,
  pageLimit: number,
  queryInput: string
) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${apiBaseUrl}/student/list?offset=${offset}&limit=${pageLimit}` +
        (queryInput ? `&search=${queryInput}` : ''),
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}

export async function getTasks(
  offset: number,
  pageLimit: number,
  queryInput: string
) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${apiBaseUrl}/task/list?offset=${offset}&limit=${pageLimit}` +
        (queryInput ? `&search=${queryInput}` : ''),
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}

export async function checkAttendace(queryInput: string) {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/student/check-attendance/${queryInput}`
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}

export async function logStudent(queryInput: number) {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/student/log-attendance/${queryInput}`
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}
