async function cargarEstadistica() {
    const estado = document.getElementById('mensaje-estado');
    try {
        const resp = await fetch('/api/estadistica-fotos/datos');
        if (!resp.ok) throw new Error('No se pudieron cargar los datos');
        const data = await resp.json();
        estado.textContent = '';

        Highcharts.chart('contenedor-grafico', {
            chart: { type: 'pie' },
            title: { text: 'Fotos vigentes vs. eliminadas' },
            tooltip: { pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>' },
            series: [{
                name: 'Fotos',
                colorByPoint: true,
                data: [
                    { name: 'Vigentes', y: data.vigentes },
                    { name: 'Eliminadas', y: data.eliminadas }
                ]
            }]
        });
    } catch (error) {
        estado.textContent = 'Error: ' + error.message;
    }
}

cargarEstadistica();
