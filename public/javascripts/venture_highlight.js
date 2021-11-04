const VentureCountDiv = document.querySelector("#venture_counts");
const LaunchedVentureDiv = document.querySelector("#launched_venture_counts");
const GapFundDiv = document.querySelector("#gapfund_counts");

async function get_count(route, div) {
    console.log("Start loading Highlights.");
    let venture_count;
    let res;
    try {
        res = await fetch(route);
        if (!res.ok) {
            throw new Error("Response not ok " + res.status);
        }
        venture_count = await res.json();
        const ventureHighlight = document.createElement("P");
        ventureHighlight.className = "performace-highlight text-center";
        ventureHighlight.innerText = `${venture_count.value}`;

        div.appendChild(ventureHighlight);
    } catch (e) {
        div.innerHTML = e.msg;
    }
}

get_count("/venturehighlight/venture-count", VentureCountDiv);
get_count("/venturehighlight/launched-venture-count", LaunchedVentureDiv);
get_count("/venturehighlight/gpfund-count", GapFundDiv);
