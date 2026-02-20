const API_KEY = "70a41b2bb9-e22954ea59-ta8zmf";
const API_URL_TODAY = `https://api.fastforex.io/fetch-multi?from=USD&to=EUR,PEN&api_key=${API_KEY}`;

function obtenerFechaAyer() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
}

async function obtenerTiposCambio() {
    try {
        const hoy = await fetch(API_URL_TODAY).then(r => r.json());
        if (!hoy.results) return;

        const usdPenHoy = hoy.results.PEN;
        const eurPenHoy = hoy.results.PEN / hoy.results.EUR;

        const ayer = await fetch(
            `https://api.fastforex.io/historical?from=USD&to=EUR,PEN&api_key=${API_KEY}&date=${obtenerFechaAyer()}`
        ).then(r => r.json());

        if (!ayer.results) return;

        actualizar("usd-pen", "usd-change", usdPenHoy, ayer.results.PEN);
        actualizar("eur-pen", "eur-change", eurPenHoy, ayer.results.PEN / ayer.results.EUR);

    } catch (e) {
        console.error(e);
    }
}

function actualizar(idValor, idCambio, nuevo, viejo) {
    const v = document.getElementById(idValor);
    const c = document.getElementById(idCambio);

    v.textContent = nuevo.toFixed(3).replace(".", ",");

    const diff = ((nuevo - viejo) / viejo) * 100;
    c.textContent = `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff).toFixed(3)} %`;
    c.className = `change ${diff >= 0 ? "up" : "down"}`;
}

obtenerTiposCambio();