import { getURL } from "../utils/utils.mjs"

const login = async (credentials) => {
    if(credentials.username.length<4 || credentials.password<6 || !credentials.password || !credentials.username){
        throw new Error('Username e/o password non validi.');
    }
    const response = await fetch(getURL('/api/sessions'), { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include',
        body: JSON.stringify(credentials)
    });
    
    if(response.ok) return await response.json();
    else throw await response.text();
}

const getUserInfo = async () => {
    const response = await fetch(getURL('/api/sessions/current'), { credentials: 'include' });
    const user = await response.json();
    if(response.ok) return user;
    else throw user;
}

const logout = async () => {
    const response = await fetch(getURL('/api/sessions/current'), { method: 'DELETE', credentials: 'include' });
    if(response.ok) return null;
}

const init = async () => {
    const response = await fetch(getURL('/api/matches/init'), { method: 'POST', credentials: 'include' });
    if(response.ok) return await response.json();
    else throw await response.text();
}

const draw = async () => {
    const response = await fetch(getURL('/api/cards/draw'), { method: 'POST', credentials: 'include' });
    if(response.ok) return await response.json();
    else throw await response.text();
}

const verify = async (index) => {
    if(!Number.isInteger(index)) throw new Error('The index must be an integer');
    const response = await fetch(getURL('/api/matches/current/verify'), { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({index: index}),
        credentials: 'include' 
    });
    if(response.ok) return await response.json();
    else throw await response.text();
}

const save = async () => {
    const response = await fetch(getURL('/api/matches'), { method: 'POST', credentials: 'include' });
    if(response.ok) return true;
    else throw await response.text();
}

const getMatches = async () => {
    const response = await fetch(getURL('/api/matches'), { credentials: 'include' });
    if(response.ok) return await response.json();
    else throw await response.text();
}

const getCardById = async (id) => {
    const response = await fetch(getURL(`/api/cards/${id}`), { credentials: 'include' });
    if(response.ok) return await response.json();
    else throw await response.text();
}

const API = { login, getUserInfo, logout, init, draw, verify, save, getMatches, getCardById };
export default API;