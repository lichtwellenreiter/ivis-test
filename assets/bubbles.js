d3.text("../data/cybercrime-switzerland-2020.csv")
    .then(d3.csvParse)
    .then(tryData);


const rectangle = document.getElementById("bubble-chart");
const moreData = document.getElementById("more-data-box");
const close = document.getElementById("close");

//rectangle.onmouseleave = e => moreData.style.display = "none";
close.onclick = _ => moreData.style.display = 'none';

function tryData(data) {

    let bubbles = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", 900)
        .attr("id", "bubbles");

    let r = 5;
    let cx = r;
    let cy = r;
    let m = r + 2;

    let previousTitle = "";
    const categories = getCategories(data)

    console.log(categories)

    categories.forEach((it, idx) => {

        const cases_for_cat = getCasesForCategory(data, it);
        const circles = calcPoints(cases_for_cat);
        let colorVal = '#000000';


        for (let c = 0; c < circles; c++) {

            //(idx % 2 === 0) ? colorVal = '#000000' : colorVal = '#ffffff';

            bubbles.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("id", c)
                .attr("data-title", it)
                .attr("fill", colorVal)
                .attr("r", r)
                .on('mouseover', function (d, i) {
                    moreData.style.display = 'block';
                    updateMoreData(data, it);
                })
                .on('touchstart', function (d, i) {
                    moreData.style.display = 'block';
                    updateMoreData(data, it);
                })
                .on('touchend', function (d, i) {
                    moreData.style.display = 'none';
                });

            cx += r + m;
            if (cx >= rectangle.getBoundingClientRect().width) {
                cy += r + m;
                cx = r;
            }
        }
        cx = r;
        cy += 20;
    });

    rectangle.style.height = cy + "px";
    const bubblesSvg = document.getElementById("bubbles");
    bubblesSvg.setAttribute("height", (cy + r) + "px");
}

const getWikipediaTitleForCategory = (data, category) => {
    let wikipedia = "";
    data.forEach(d => {
        (d.category === category) ? wikipedia = d.wikipedia : "";
    });
    return wikipedia;
}


const getCategories = data => {
    const categories = [];
    data.forEach(d => categories.push(d.category));
    return [...new Set(categories)];
}

const getCasesForCategory = (data, category) => {
    let cases = 0;
    data.forEach(d => {
        (d.category === category) ? cases += parseInt(d.cases) : "";
    });
    return cases;
}

const getColorForCategory = (data, category) => {

    let color = "";

    data.forEach(d => {
        if (d.category === category) {
            color = d.bgColor;
        }
    });
    return color;
}


async function updateMoreData(data, category) {

    const moreData = document.getElementById("more-data-box");
    const moreDataTitle = document.getElementById("more-data-title");
    const moreDataExcerpt = document.getElementById("more-data-excerpt");
    const moreDataCases = document.getElementById("more-data-cases");
    const moreDataReadMore = document.getElementById("more-data-read-more");

    moreDataTitle.innerText = category;
    moreDataCases.innerText = `${getCasesForCategory(data, category)} Fälle`;
    //moreDataExcerpt.innerText = await getExcerptFromWikipedia(getWikipediaTitleForCategory(data, category));
}


function calcPoints(numberOfCases) {
    const c = (Math.ceil(numberOfCases / 10) * 10) / 10;
    return (c > 0) ? c : 1;
}


async function getExcerptFromWikipedia(title) {
    let url = `https://de.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&action=query&prop=extracts&explaintext=false&exintro&titles=${title}`;
    let response = await fetch(url, {
        method: 'GET',
    });

    let data = response.json();
    return data.query.pages[0].extract;
}

function logging(data) {
    console.table(data)
}