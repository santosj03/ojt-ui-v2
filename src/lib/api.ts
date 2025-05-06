import axios from 'axios';
// ---------------------------- Student API ------------------------------------------------- //
// export async function getStudents(
//   offset: number,
//   pageLimit: number,
//   country: string
// ) {
//   try {
//     // const res = await axios.get('http://127.0.0.1:8000/api/student/list')
//     const res = await axios.get(
//       `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
//         (country ? `&search=${country}` : '')
//     );
//     return res.data;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

export async function getStudents(
  offset: number,
  pageLimit: number,
  queryInput: string
) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `http://127.0.0.1:8000/api/student/list?offset=${offset}&limit=${pageLimit}` +
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
      `http://127.0.0.1:8000/api/task/list?offset=${offset}&limit=${pageLimit}` +
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
      `http://127.0.0.1:8000/api/student/check-attendance/${queryInput}`
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}

export async function logStudent(queryInput: number) {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/student/log-attendance/${queryInput}`
    );

    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}
