const SERVER_URL = 'http://localhost:3001';

function getURL(endpoint){
    return `${SERVER_URL}${endpoint}`;
}

export { getURL };