// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Guardar token en localStorage
export function setToken(token) {
    localStorage.setItem('token', token);
}

// Obtener token
export function getToken() {
    return localStorage.getItem('token');
}

// Guardar rol del usuario
export function setRol(rol) {
    localStorage.setItem('rol', rol);
}

// Obtener rol
export function getRol() {
    return localStorage.getItem('rol');
}

// Guardar usuario
export function setUsuario(usuario) {
    localStorage.setItem('usuario', usuario);
}

// Obtener usuario
export function getUsuario() {
    return localStorage.getItem('usuario');
}

// Cerrar sesión
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    window.location.href = '/login.html';
}

// Función para hacer peticiones autenticadas
export async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        logout();
        throw new Error('Sesión expirada');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.mensaje || 'Error en la petición');
    }
    
    return data;
}