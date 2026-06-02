import { checkAuth, mostrarInfoUsuario } from './auth.js';

const API_URL = 'http://localhost:3000/api';

checkAuth();
mostrarInfoUsuario();

function getToken() {
    return localStorage.getItem('token');
}

window.cargarOrdenesPendientes = async function() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/mecanicos/ordenes/pendientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const ordenes = await response.json();
        const container = document.getElementById('ordenesPendientesLista');
        
        if (!ordenes || ordenes.length === 0) {
            container.innerHTML = '<div class="card"><p>No hay órdenes pendientes</p></div>';
            return;
        }
        
        container.innerHTML = ordenes.map(o => `
            <div class="card">
                <h3>Orden #${o.id_OrdenServicio || 'Nueva'}</h3>
                <p><strong>Vehículo ID:</strong> ${o.id_VehiculoFK}</p>
                <p><strong>Observaciones:</strong> ${o.Observaciones || 'Sin observaciones'}</p>
                <p><strong>Fecha:</strong> ${new Date(o.F_entrada).toLocaleDateString()}</p>
                <button onclick="tomarOrden('${o._id}')" class="btn btn-success" style="margin-top: 10px;">Tomar Orden</button>
            </div>
        `).join('');
        
        window.tomarOrden = tomarOrden;
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ordenesPendientesLista').innerHTML = '<p>Error al cargar</p>';
    }
};

async function tomarOrden(id) {
    try {
        const token = getToken();
        
        const response = await fetch(`${API_URL}/mecanicos/orden/${id}/tomar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Orden tomada exitosamente');
            cargarOrdenesPendientes();
            cargarMisOrdenes();
        } else {
            const error = await response.json();
            alert('Error: ' + (error.mensaje || 'No se pudo tomar la orden'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al tomar la orden');
    }
}

window.cargarMisOrdenes = async function() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/mecanicos/ordenes/activas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const ordenes = await response.json();
        const tbody = document.getElementById('misOrdenesLista');
        
        if (!ordenes || ordenes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No tienes órdenes activas</td></tr>';
            return;
        }
        
        tbody.innerHTML = ordenes.map(o => `
            <tr>
                <td>${o.id_OrdenServicio || '---'}</td>
                <td>${new Date(o.F_entrada).toLocaleDateString()}</td>
                <td><span class="estado estado-${(o.Estado || 'pendiente').toLowerCase()}">${o.Estado || 'Pendiente'}</span></td>
                <td>$${o.Costo || 0}</td>
                <td><button onclick="abrirEditar('${o._id}')" class="btn-secondary" style="padding: 5px 10px;">Editar</button></td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('misOrdenesLista').innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
    }
};

window.abrirEditar = async function(ordenId) {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/mecanicos/orden/${ordenId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const orden = await response.json();
        
        document.getElementById('editOrdenId').value = orden._id;
        document.getElementById('editEstado').value = orden.Estado || 'Pendiente';
        document.getElementById('editCosto').value = orden.Costo || 0;
        document.getElementById('editObservaciones').value = orden.Observaciones || '';
        document.getElementById('editDescripcion').value = '';
        
        document.getElementById('modalEditar').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar la orden');
    }
};

document.getElementById('formEditar')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ordenId = document.getElementById('editOrdenId').value;
    const estado = document.getElementById('editEstado').value;
    const costo = parseFloat(document.getElementById('editCosto').value);
    const observaciones = document.getElementById('editObservaciones').value;
    const descripcionTrabajo = document.getElementById('editDescripcion').value;
    
    const token = getToken();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
    
    try {
        if (estado === 'Terminado' && descripcionTrabajo) {
            const ordenResponse = await fetch(`${API_URL}/mecanicos/orden/${ordenId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const orden = await ordenResponse.json();
            
            await fetch(`${API_URL}/mecanicos/trabajo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    idVehiculo: orden.id_VehiculoFK,
                    costo: costo,
                    descripcion: descripcionTrabajo,
                    idOrden: ordenId
                })
            });
        }
        
        const response = await fetch(`${API_URL}/mecanicos/orden/${ordenId}/completa`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                Estado: estado,
                Costo: costo,
                Observaciones: observaciones
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al actualizar');
        }
        
        alert('Cambios guardados exitosamente');
        cerrarModal('editar');
        
        await cargarMisOrdenes();
        await cargarOrdenesPendientes();
        await cargarMiHistorial();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar cambios: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Cambios';
    }
});

window.cargarMiHistorial = async function() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/mecanicos/historial`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const historial = await response.json();
        const container = document.getElementById('historialTrabajosLista');
        
        if (!historial || historial.length === 0) {
            container.innerHTML = '<p>No hay trabajos registrados</p>';
            return;
        }
        
        container.innerHTML = historial.map(r => `
            <div class="card">
                <h4>${new Date(r.Fecha).toLocaleDateString()}</h4>
                <p><strong>Vehículo ID:</strong> ${r.id_VehiculoFK}</p>
                <p><strong>Trabajo:</strong> ${r.Descripcion}</p>
                <p><strong>Costo:</strong> $${r.CostoFinal}</p>
                <p><strong>Progreso:</strong> ${r.progreso || 100}%</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('historialTrabajosLista').innerHTML = '<p>Error al cargar historial</p>';
    }
};

document.getElementById('formRegistrarMecanico')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('regNombre').value;
    const apellido = document.getElementById('regApellido').value;
    const telefono = document.getElementById('regTelefono').value;
    const email = document.getElementById('regEmail').value;
    const usuario = document.getElementById('regUsuario').value;
    const contrasena = document.getElementById('regContrasena').value;
    
    const token = getToken();
    
    try {
        const response = await fetch(`${API_URL}/mecanicos/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, apellido, telefono, email, usuario, contrasena })
        });
        
        if (response.ok) {
            alert('Mecánico registrado exitosamente');
            document.getElementById('formRegistrarMecanico').reset();
            cerrarModal('registrarMecanico');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.mensaje || 'No se pudo registrar'));
        }
    } catch (error) {
        alert('Error al registrar mecánico');
    }
});

async function cargarEstadisticas() {
    try {
        const token = getToken();
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const mecanicoId = decoded.id;
        
        const response = await fetch(`${API_URL}/ordenes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const todasOrdenes = await response.json();
        
        const misOrdenes = todasOrdenes.filter(o => o.id_MecanicoFK === mecanicoId);
        const pendientes = misOrdenes.filter(o => o.Estado === 'Pendiente').length;
        const enProceso = misOrdenes.filter(o => o.Estado === 'En Proceso').length;
        
        document.getElementById('ordenesPendientesCount').textContent = pendientes;
        document.getElementById('ordenesProcesoCount').textContent = enProceso;
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ordenesPendientesCount').textContent = '0';
        document.getElementById('ordenesProcesoCount').textContent = '0';
    }
}

async function cargarUltimosTrabajos() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/mecanicos/historial`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const historial = await response.json();
        const ultimos = historial.slice(0, 5);
        const container = document.getElementById('recentWorksList');
        
        if (!ultimos || ultimos.length === 0) {
            container.innerHTML = '<p>No hay trabajos registrados aún</p>';
            return;
        }
        
        container.innerHTML = ultimos.map(r => `
            <div class="recent-item">
                <div class="recent-icon"><i class="fas fa-wrench"></i></div>
                <div class="recent-details"><strong>${new Date(r.Fecha).toLocaleDateString()}</strong> - ${r.Descripcion.substring(0, 60)}...</div>
                <div class="recent-costo">$${r.CostoFinal}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

const tips = [
    "Revisa siempre el nivel de aceite antes de entregar el vehículo.",
    "Una alineación correcta puede aumentar la vida de las llantas hasta un 30%.",
    "El mantenimiento preventivo cuesta menos que una reparación mayor.",
    "Siempre prueba el vehículo después de cada reparación importante.",
    "Documenta cada trabajo con fotos para respaldar tu diagnóstico.",
    "Revisa los filtros de aire en cada servicio, a menudo se olvidan."
];

function mostrarTipDelDia() {
    const today = new Date();
    const dayIndex = today.getDate() % tips.length;
    document.getElementById('tipOfDay').textContent = tips[dayIndex];
}

setTimeout(() => {
    cargarEstadisticas();
    cargarUltimosTrabajos();
    mostrarTipDelDia();
}, 500);