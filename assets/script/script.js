let chart;

const handleClick = async () => {
    const moneyInput = document.querySelector("#money");
    const money = parseFloat(moneyInput.value);
    const currencySelect = document.querySelector("#currency");
    const currency = currencySelect.value;

    if (isNaN(money) || money <= 0) {
        alert("Por favor, ingrese un monto válido en CLP");
        return;
    }

    if (!currency) {
        alert("Por favor, seleccione una moneda para la conversión");
        return;
    }

    const url = `https://mindicador.cl/api/${currency}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error al obtener datos de ${currency}: ${res.statusText}`);
        }

        const data = await res.json();
        const latestValue = data.serie[0].valor;

        // Realizar la conversión
        const conversion = money / latestValue;

        // Actualizar el resultado en la interfaz
        const currencySymbol = currency === "dolar" ? "USD" : currency.toUpperCase();
        const resultText = currency === "dolar" 
            ? `$${conversion.toFixed(2)} ${currencySymbol}`
            : `${conversion.toFixed(4)} ${currencySymbol}`;
        document.querySelector("#result").innerText = `Resultado: ${resultText}`;

        // Generar gráfica de variaciones
        const info = data.serie.slice(0, 10).reverse();
        const etiquetas = info.map((day) => {
            const fecha = new Date(day.fecha);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            return `${dia}/${mes}/${anio}`;
        });

        const valores = info.map((day) => day.valor);

        const ctx = document.getElementById('myChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        const dataChart = {
            labels: etiquetas,
            datasets: [{
                label: `Variaciones de ${currency.toUpperCase()}`,
                data: valores,
                borderColor: 'rgb(75, 192, 192)',
            }]
        };

        chart = new Chart(ctx, {
            type: 'line',
            data: dataChart,
        });

    } catch (error) {
        document.querySelector("#result").innerText = `Error: ${error.message}`;
    }
};

const searchButton = document.querySelector("#search");
searchButton.addEventListener("click", handleClick);
