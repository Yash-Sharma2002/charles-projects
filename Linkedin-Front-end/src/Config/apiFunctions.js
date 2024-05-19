import axios from 'axios';


export function getRecord(url, user) {
    return axios.get(url,  {
      
        headers: {
            Authorization: user.token ? `Bearer ${user.token}` : '',
        },
    }).then((res) => res.data);
}

export function createRecord({ url, values, user }) {
    return axios.post(url, values, {
        headers: {
            Authorization: user.token ? `Bearer ${user.token}` : '',
        },
    });
}

export function updateRecord({ url, values, user }) {
    return axios.patch(url, values, {
        headers: {
            Authorization: user.token ? `Bearer ${user.token}` : '',
        },
    });
}

export function deleteRecord({ url, user }) {
    return axios.delete(url, {
        headers: {
            Authorization: user.token ? `Bearer ${user.token}` : '',
        },
    });
}