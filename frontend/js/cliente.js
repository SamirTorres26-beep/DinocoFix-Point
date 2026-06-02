import { checkAuth, mostrarInfoUsuario } from './auth.js';

const API_URL = 'https://dinocofix-point.onrender.com/api';

checkAuth();
mostrarInfoUsuario();

function getToken() {
    return localStorage.getItem('token');
}

window.cargarVehiculos = async function() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/clientes/mis-vehiculos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const vehiculos = await response.json();
        const container = document.getElementById('vehiculosLista');
        
        if (!vehiculos || vehiculos.length === 0) {
            container.innerHTML = '<p>No tienes vehículos registrados</p>';
            return;
        }
        
        container.innerHTML = vehiculos.map(v => `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                <strong>${v.marca} ${v.modelo}</strong><br>
                Placa: ${v.placa}<br>
                Año: ${v.anio} | Color: ${v.color}
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('vehiculosLista').innerHTML = '<p>Error al cargar vehículos</p>';
    }
};

window.cargarOrdenes = async function() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/ordenes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const todasOrdenes = await response.json();
        const ordenes = todasOrdenes.filter(o => o.Estado !== 'Terminado');
        const tbody = document.getElementById('ordenesLista');
        
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
                <td>${o.Observaciones?.substring(0, 50) || ''}...</td>
            </tr>
        `).join('');
        
    } catch (error) {
        document.getElementById('ordenesLista').innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
    }
};

window.cargarHistorial = async function() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/registros/cliente/historial`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error');
        
        const historial = await response.json();
        const container = document.getElementById('historialLista');
        
        if (!historial || historial.length === 0) {
            container.innerHTML = '<p>No hay historial de servicios</p>';
            return;
        }
        
        container.innerHTML = historial.map(v => `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <h4>${v.marca} ${v.modelo} (${v.placa})</h4>
                ${v.registros?.map(r => `
                    <div style="margin-left: 20px; padding: 10px; border-left: 2px solid #00b894;">
                        <strong>${new Date(r.Fecha).toLocaleDateString()}</strong><br>
                        <strong>Mecánico:</strong> ${r.MecanicoEncargado || 'No especificado'}<br>
                        <strong>Trabajo:</strong> ${r.Descripcion}<br>
                        <strong>Costo:</strong> $${r.CostoFinal}<br>
                        <strong>Progreso:</strong> ${r.progreso || 100}%
                    </div>
                `).join('') || '<p>Sin registros</p>'}
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('historialLista').innerHTML = '<p>Error al cargar historial</p>';
    }
};

document.getElementById('formAgregarVehiculo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = getToken();
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const cliente_id = decoded.id;
    
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const anio = parseInt(document.getElementById('anio').value) || null;
    const placa = document.getElementById('placa').value;
    const color = document.getElementById('color').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Agregando...';
    
    try {
        const response = await fetch(`${API_URL}/vehiculos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cliente_id, marca, modelo, anio, placa, color })
        });
        
        if (response.ok) {
            alert('Vehículo agregado exitosamente');
            document.getElementById('formAgregarVehiculo').reset();
            cerrarModal('agregarVehiculo');
            if (typeof cargarVehiculos === 'function') {
                cargarVehiculos();
            }
        } else {
            const error = await response.json();
            alert('Error: ' + (error.mensaje || 'No se pudo agregar el vehículo'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar vehículo');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Agregar Vehículo';
    }
});

document.getElementById('formCita')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const placa = document.getElementById('placaVehiculo').value;
    const fechaCita = document.getElementById('fechaCita').value;
    const horaCita = document.getElementById('horaCita').value;
    const motivo = document.getElementById('motivoCita').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Agendando...';
    
    try {
        const token = getToken();
        
        const vehiculosRes = await fetch(`${API_URL}/clientes/mis-vehiculos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const vehiculos = await vehiculosRes.json();
        const vehiculo = vehiculos.find(v => v.placa === placa);
        
        if (!vehiculo) {
            alert('No se encontró un vehículo con esa placa');
            return;
        }
        
        const response = await fetch(`${API_URL}/ordenes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id_VehiculoFK: vehiculo.id_vehiculo,
                Observaciones: motivo,
                Cita: {
                    id_Cita: Math.floor(Math.random() * 10000),
                    FechaCita: new Date(`${fechaCita}T${horaCita}`),
                    HoraCita: horaCita,
                    Motivo: motivo,
                    Estado: 'Programada'
                }
            })
        });
        
        if (response.ok) {
            alert('Cita agendada exitosamente');
            document.getElementById('formCita').reset();
            cerrarModal('cita');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.mensaje || 'No se pudo agendar'));
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agendar la cita');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Agendar Cita';
    }
});

window.agendarPromocion = function(servicio) {
    document.getElementById('motivoCita').value = `Promoción: ${servicio}`;
    abrirModal('cita');
};