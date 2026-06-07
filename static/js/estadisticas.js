// Gráfico 1: líneas — miembros registrados por día
async function fetchAndRenderChart() {
  try {
    // Realiza la petición fetch al endpoint
    const response = await fetch('/api/estadisticas/miembros-por-dia');

    // Verifica si la respuesta es correcta
    if (!response.ok) {
      throw new Error('Error al cargar los datos');
    }

    // Convierte la respuesta a formato JSON
    const data = await response.json();

    // Procesa los datos para el gráfico
    const dates = data.map(item => item.date); // Extrae las fechas
    const counts = data.map(item => item.count); // Extrae los conteos

    // Crea el gráfico usando Highcharts
    Highcharts.chart('container-miembros', {
      chart: {
        type: 'line' // Tipo de gráfico: líneas
      },
      title: {
        text: 'Miembros registrados por día' // Título del gráfico
      },
      xAxis: {
        categories: dates // Eje X: fechas
      },
      yAxis: {
        title: {
          text: 'Cantidad de miembros' // Título del eje Y
        },
        allowDecimals: false // Los conteos son enteros
      },
      series: [{
        name: 'Miembros', // Nombre de la serie
        data: counts // Datos de la serie: conteos de miembros
      }]
    });

  } catch (error) {
    // Manejo de errores: muestra un mensaje en la consola
    console.error('Error:', error.message);
    alert('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
  }
}

// Gráfico 2: torta — total de actividades por tipo
async function fetchAndRenderPieChart() {
  try {
    // Realiza la petición fetch al endpoint
    const response = await fetch('/api/estadisticas/actividades-por-tipo');

    // Verifica si la respuesta es correcta
    if (!response.ok) {
      throw new Error('Error al cargar los datos');
    }

    // Convierte la respuesta a formato JSON
    const data = await response.json();

    // Procesa los datos para el gráfico
    const chartData = data.map(item => ({
      name: item.tipo, // Nombre de la porción: tipo de actividad
      y: item.total // Valor de la porción: total de actividades
    }));

    // Crea el gráfico usando Highcharts
    Highcharts.chart('container-tipos', {
      chart: {
        type: 'pie' // Tipo de gráfico: torta
      },
      title: {
        text: 'Total de actividades por tipo' // Título del gráfico
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>' // Formato del tooltip
      },
      series: [{
        name: 'Actividades', // Nombre de la serie
        colorByPoint: true, // Colores por porción
        data: chartData // Datos de la serie
      }]
    });

  } catch (error) {
    // Manejo de errores: muestra un mensaje en la consola
    console.error('Error:', error.message);
    alert('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
  }
}

// Gráfico 3: columnas — total de actividades por comuna
async function fetchAndRenderColumnChart() {
  try {
    // Realiza la petición fetch al endpoint
    const response = await fetch('/api/estadisticas/actividades-por-comuna');

    // Verifica si la respuesta es correcta
    if (!response.ok) {
      throw new Error('Error al cargar los datos');
    }

    // Convierte la respuesta a formato JSON
    const data = await response.json();

    // Procesa los datos para el gráfico
    const comunas = data.map(item => item.comuna); // Extrae las comunas
    const totals = data.map(item => item.total); // Extrae los totales de actividades

    // Crea el gráfico usando Highcharts
    Highcharts.chart('container-comunas', {
      chart: {
        type: 'column' // Tipo de gráfico: columnas
      },
      title: {
        text: 'Total de actividades por comuna' // Título del gráfico
      },
      xAxis: {
        categories: comunas // Eje X: comunas
      },
      yAxis: {
        title: {
          text: 'Total de actividades' // Título del eje Y
        },
        allowDecimals: false // Los conteos son enteros
      },
      series: [{
        name: 'Actividades', // Nombre de la serie
        data: totals // Datos de la serie: totales de actividades
      }]
    });

  } catch (error) {
    // Manejo de errores: muestra un mensaje en la consola
    console.error('Error:', error.message);
    alert('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
  }
}

// Llama a las tres funciones para renderizar los gráficos
fetchAndRenderChart();
fetchAndRenderPieChart();
fetchAndRenderColumnChart();
