async function fetchAndRenderChart() {
    try {
        const response = await fetch('/api/estadisticas/miembros-por-dia');
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data = await response.json();

        Highcharts.chart('container-miembros', {
            chart: { type: 'line' },
            title: { text: 'Miembros registrados por día' },
            xAxis: { categories: data.map(item => item.date) },
            yAxis: { title: { text: 'Cantidad de miembros' }, allowDecimals: false },
            series: [{ name: 'Miembros', data: data.map(item => item.count) }]
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function fetchAndRenderPieChart() {
    try {
        const response = await fetch('/api/estadisticas/actividades-por-tipo');
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data = await response.json();

        Highcharts.chart('container-tipos', {
            chart: { type: 'pie' },
            title: { text: 'Total de actividades por tipo' },
            tooltip: { pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>' },
            series: [{
                name: 'Actividades',
                colorByPoint: true,
                data: data.map(item => ({ name: item.tipo, y: item.total }))
            }]
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function fetchAndRenderColumnChart() {
    try {
        const response = await fetch('/api/estadisticas/actividades-por-comuna');
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data = await response.json();

        Highcharts.chart('container-comunas', {
            chart: { type: 'column' },
            title: { text: 'Total de actividades por comuna' },
            xAxis: { categories: data.map(item => item.comuna) },
            yAxis: { title: { text: 'Total de actividades' }, allowDecimals: false },
            series: [{ name: 'Actividades', data: data.map(item => item.total) }]
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchAndRenderChart();
fetchAndRenderPieChart();
fetchAndRenderColumnChart();
