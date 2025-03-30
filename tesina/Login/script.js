// Variables globales
let firewallActive = true;
let securityData = {
    attacksBlocked: 576,
    connections: 42,
    uptime: 99.9,
    threatLevel: "Medio"
};

let threatLocations = [
    { x: 25, y: 60 },
    { x: 70, y: 30 },
    { x: 45, y: 80 },
    { x: 65, y: 50 }
];

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initCharts();
    initThreatMap();
    initEventListeners();
    startSimulation();
});

// Inicializar gráficos
function initCharts() {
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    
    // Datos para el gráfico de tráfico
    const trafficData = {
        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
        datasets: [
            {
                label: 'Tráfico Legítimo',
                data: [65, 59, 80, 81, 56, 85, 90, 75, 70],
                fill: true,
                backgroundColor: 'rgba(26, 115, 232, 0.2)',
                borderColor: 'rgba(26, 115, 232, 1)',
                tension: 0.4
            },
            {
                label: 'Intentos Bloqueados',
                data: [28, 48, 40, 19, 26, 27, 45, 30, 35],
                fill: true,
                backgroundColor: 'rgba(219, 68, 55, 0.2)',
                borderColor: 'rgba(219, 68, 55, 1)',
                tension: 0.4
            }
        ]
    };

    // Configuración del gráfico
    const trafficConfig = {
        type: 'line',
        data: trafficData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    };

    // Crear el gráfico
    window.trafficChart = new Chart(trafficCtx, trafficConfig);
}

// Inicializar mapa de amenazas
function initThreatMap() {
    const threatMap = document.querySelector('.threat-map');
    
    // Limpiar puntos existentes
    const existingPoints = threatMap.querySelectorAll('.threat-point');
    existingPoints.forEach(point => point.remove());
    
    // Añadir nuevos puntos de amenaza
    threatLocations.forEach(location => {
        const point = document.createElement('div');
        point.className = 'threat-point';
        point.style.left = `${location.x}%`;
        point.style.top = `${location.y}%`;
        threatMap.appendChild(point);
    });
}

// Inicializar event listeners
function initEventListeners() {
    // Botón de escaneo
    document.getElementById('scan-btn').addEventListener('click', function() {
        showNotification('Escaneando sistema...', 'Búsqueda de vulnerabilidades en progreso');
        setTimeout(() => {
            showNotification('Escaneo completo', 'No se encontraron vulnerabilidades', 'success');
        }, 3000);
    });
    
    // Botón de activar/desactivar firewall
    document.getElementById('toggle-firewall').addEventListener('click', toggleFirewall);
    
    // Botón de emergencia
    document.getElementById('emergency-btn').addEventListener('click', function() {
        showNotification('ALERTA', '¡Modo de emergencia activado! Bloqueando todas las conexiones no críticas', 'danger');
        
        // Simular activación de modo emergencia
        document.body.style.backgroundColor = '#420d0d';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
            showNotification('Modo emergencia desactivado', 'Las operaciones normales se han restablecido');
        }, 5000);
    });
    
    // Cambio en nivel de seguridad
    document.getElementById('security-level').addEventListener('change', function(e) {
        showNotification('Configuración actualizada', `Nivel de seguridad cambiado a: ${e.target.value}`);
    });
    
    // Acciones en registros
    const logActions = document.querySelectorAll('.log-action');
    logActions.forEach(action => {
        action.addEventListener('click', function(e) {
            const logItem = e.target.closest('li');
            const logContent = logItem.querySelector('.log-content').textContent;
            
            if (e.target.textContent === '🔍') {
                showNotification('Investigando', `Analizando: ${logContent}`);
            } else if (e.target.textContent === '🚫') {
                showNotification('Bloqueado', `IP bloqueada: ${logContent.match(/\d+\.\d+\.\d+\.\d+/)[0]}`);
                logItem.style.opacity = '0.5';
            }
        });
    });
}

// Función para mostrar notificaciones
function showNotification(title, message, type = '') {
    const notificationsContainer = document.getElementById('notifications');
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-title">
            ${title}
            <button class="notification-close">✕</button>
        </div>
        <p>${message}</p>
    `;
    
    // Añadir notificación al contenedor
    notificationsContainer.appendChild(notification);
    
    // Configurar cierre automático
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Configurar cierre manual
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Activar/desactivar firewall
function toggleFirewall() {
    firewallActive = !firewallActive;
    const statusElement = document.getElementById('firewall-status');
    
    if (firewallActive) {
        statusElement.textContent = 'Firewall activo y protegiendo';
        statusElement.classList.remove('inactive');
        showNotification('Firewall activado', 'El sistema está protegido', 'success');
    } else {
        statusElement.textContent = 'Firewall desactivado - sistema vulnerable';
        statusElement.classList.add('inactive');
        showNotification('Firewall desactivado', '¡ADVERTENCIA! El sistema no está protegido', 'danger');
    }
}

// Añadir nuevo evento de log
function addLogEntry(message, type = '') {
    const logList = document.getElementById('log-list');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Crear elemento de log
    const logItem = document.createElement('li');
    if (type) logItem.className = type;
    
    logItem.innerHTML = `
        <span class="timestamp">${timeString}</span>
        <span class="log-content">${message}</span>
        <div class="log-actions">
            <button class="log-action">🔍</button>
            ${type === 'danger' || type === 'warning' ? '<button class="log-action">🚫</button>' : ''}
        </div>
    `;
    
    // Añadir al inicio de la lista
    logList.insertBefore(logItem, logList.firstChild);
    
    // Limitar a 20 entradas
    if (logList.children.length > 20) {
        logList.removeChild(logList.lastChild);
    }
    
    // Añadir listeners para los botones
    const actions = logItem.querySelectorAll('.log-action');
    actions.forEach(action => {
        action.addEventListener('click', function(e) {
            const logItem = e.target.closest('li');
            const logContent = logItem.querySelector('.log-content').textContent;
            
            if (e.target.textContent === '🔍') {
                showNotification('Investigando', `Analizando: ${logContent}`);
            } else if (e.target.textContent === '🚫') {
                const ipMatch = logContent.match(/\d+\.\d+\.\d+\.\d+/);
                if (ipMatch) {
                    showNotification('Bloqueado', `IP bloqueada: ${ipMatch[0]}`);
                    logItem.style.opacity = '0.5';
                }
            }
        });
    });
    
    // Mostrar notificación para eventos críticos
    if (type === 'danger') {
        showNotification('¡Alerta de Seguridad!', message, 'danger');
    } else if (type === 'warning') {
        showNotification('Advertencia', message, 'warning');
    }
}

// Actualizar estadísticas
function updateStats(data) {
    document.getElementById('attacks-blocked').textContent = data.attacksBlocked;
    document.getElementById('connections').textContent = data.connections;
    document.getElementById('uptime').textContent = data.uptime + '%';
    document.getElementById('threat-level').textContent = data.threatLevel;
}

// Simular actividad del firewall
function startSimulation() {
    // Tipos de eventos
    const events = [
        { message: 'Conexión autorizada desde 192.168.1.{x}', type: '' },
        { message: 'Intento de autenticación fallido desde 203.45.67.{x}', type: 'warning' },
        { message: 'Ataque de fuerza bruta detectado desde 78.34.21.{x}', type: 'danger' },
        { message: 'Actualización de reglas completada', type: '' },
        { message: 'Paquete malformado bloqueado desde 91.56.43.{x}', type: 'warning' },
        { message: 'Inyección SQL detectada desde 112.89.63.{x}', type: 'danger' },
        { message: 'Solicitud DNS resuelta para domain{x}.com', type: '' },
        { message: 'Puerto escaneado desde 45.67.89.{x}', type: 'warning' }
    ];
    
    // Generar evento aleatorio cada 8-15 segundos
    setInterval(() => {
        if (!firewallActive) return; // No generar eventos si el firewall está apagado
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomIP = Math.floor(Math.random() * 254) + 1;
        const randomDomain = Math.floor(Math.random() * 999) + 1;
        
        let message = randomEvent.message
            .replace('{x}', randomIP)
            .replace('{x}', randomDomain);
            
        addLogEntry(message, randomEvent.type);
        
        // Actualizar contador de ataques bloqueados
        if (randomEvent.type === 'danger' || randomEvent.type === 'warning') {
            securityData.attacksBlocked++;
            updateStats(securityData);
        }
    }, Math.random() * 7000 + 8000);
    
    // Actualizar conexiones activas cada 10 segundos
    setInterval(() => {
        if (!firewallActive) return;
        
        // Fluctuar entre 30 y 50 conexiones
        securityData.connections = Math.floor(Math.random() * 20) + 30;
        updateStats(securityData);
    }, 10000);
    
    // Actualizar gráfico cada 30 segundos
    setInterval(() => {
        if (!firewallActive) return;
        
        // Actualizar datos de tráfico
        const trafficChart = window.trafficChart;
        
        // Añadir nuevo dato al final y quitar el primero
        trafficChart.data.labels.push(new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
        trafficChart.data.labels.shift();
        
        // Generar nuevos valores de tráfico
        const newLegitTraffic = Math.floor(Math.random() * 40) + 50;
        const newBlockedTraffic = Math.floor(Math.random() * 30) + 20;
        
        trafficChart.data.datasets[0].data.push(newLegitTraffic);
        trafficChart.data.datasets[0].data.shift();
        trafficChart.data.datasets[1].data.push(newBlockedTraffic);
        trafficChart.data.datasets[1].data.shift();
        
        trafficChart.update();
    }, 30000);
    
    // Actualizar mapa de amenazas cada 45 segundos
    setInterval(() => {
        if (!firewallActive) return;
        
        // Generar nuevas ubicaciones aleatorias
        threatLocations = Array.from({length: 4}, () => ({
            x: Math.floor(Math.random() * 80) + 10,
            y: Math.floor(Math.random() * 80) + 10
        }));
        
        initThreatMap();
    }, 45000);
}

// Mostrar notificación inicial
setTimeout(() => {
    showNotification('Bienvenido', 'Sistema Firewall UAV iniciado correctamente');
}, 1000);