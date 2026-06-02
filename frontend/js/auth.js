const API_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;
        const rol = document.getElementById('rol').value;
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasena, rol })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Credenciales inválidas');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('usuario', data.usuario);
            
            if (data.rol === 'cliente') {
                window.location.href = '/cliente.html';
            } else if (data.rol === 'mecanico') {
                window.location.href = '/mecanico.html';
            }
            
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;
        
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registrando...';
        
        try {
            const response = await fetch(`${API_URL}/clientes/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre, apellido, telefono, email, usuario, contrasena 
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al registrar');
            }
            
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/login.html';
            
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse';
        }
    });
}

export function checkAuth() {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const currentPage = window.location.pathname;
    
    if (!token) {
        if (currentPage !== '/login.html' && currentPage !== '/') {
            window.location.href = '/login.html';
        }
        return false;
    }
    
    if (currentPage === '/cliente.html' && rol !== 'cliente') {
        window.location.href = '/login.html';
        return false;
    }
    
    if (currentPage === '/mecanico.html' && rol !== 'mecanico') {
        window.location.href = '/login.html';
        return false;
    }
    
    return true;
}

export function mostrarInfoUsuario() {
    const usuarioNombre = document.getElementById('usuarioNombre');
    const usuarioRol = document.getElementById('usuarioRol');
    
    if (usuarioNombre) {
        usuarioNombre.textContent = localStorage.getItem('usuario') || '';
    }
    if (usuarioRol) {
        const rol = localStorage.getItem('rol') || '';
        usuarioRol.textContent = rol === 'cliente' ? 'Cliente' : 'Mecánico';
    }
}