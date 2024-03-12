// VARIABLES
const states = [
    { name: 'Alabama', abreviation: 'AL' },
    { name: 'Alaska', abreviation: 'AK' },
    { name: 'Arizona', abreviation: 'AZ' },
    { name: 'Arkansas', abreviation: 'AR' },
    { name: 'California', abreviation: 'CA' },
    { name: 'Colorado', abreviation: 'CO' },
    { name: 'Connecticut', abreviation: 'CT' },
    { name: 'Delaware', abreviation: 'DE' },
    { name: 'Florida', abreviation: 'FL' },
    { name: 'Georgia', abreviation: 'GA' },
    { name: 'Hawaii', abreviation: 'HI' },
    { name: 'Idaho', abreviation: 'ID' },
    { name: 'Illinois', abreviation: 'IL' },
    { name: 'Indiana', abreviation: 'IN' },
    { name: 'Iowa', abreviation: 'IA' },
    { name: 'Kansas', abreviation: 'KS' },
    { name: 'Kentucky', abreviation: 'KY' },
    { name: 'Louisiana', abreviation: 'LA' },
    { name: 'Maine', abreviation: 'ME' },
    { name: 'Maryland', abreviation: 'MD' },
    { name: 'Massachusetts', abreviation: 'MA' },
    { name: 'Michigan', abreviation: 'MI' },
    { name: 'Minnesota', abreviation: 'MN' },
    { name: 'Mississippi', abreviation: 'MS' },
    { name: 'Missouri', abreviation: 'MO' },
    { name: 'Montana', abreviation: 'MT' },
    { name: 'Nebraska', abreviation: 'NE' },
    { name: 'Nevada', abreviation: 'NV' },
    { name: 'New Hampshire', abreviation: 'NH' },
    { name: 'New Jersey', abreviation: 'NJ' },
    { name: 'New Mexico', abreviation: 'NM' },
    { name: 'New York', abreviation: 'NY' },
    { name: 'North Carolina', abreviation: 'NC' },
    { name: 'North Dakota', abreviation: 'ND' },
    { name: 'Ohio', abreviation: 'OH' },
    { name: 'Oklahoma', abreviation: 'OK' },
    { name: 'Oregon', abreviation: 'OR' },
    { name: 'Pennsylvania', abreviation: 'PA' },
    { name: 'Rhode Island', abreviation: 'RI' },
    { name: 'South Carolina', abreviation: 'SC' },
    { name: 'South Dakota', abreviation: 'SD' },
    { name: 'Tennessee', abreviation: 'TN' },
    { name: 'Texas', abreviation: 'TX' },
    { name: 'Utah', abreviation: 'UT' },
    { name: 'Vermont', abreviation: 'VT' },
    { name: 'Virginia', abreviation: 'VA' },
    { name: 'Washington', abreviation: 'WA' },
    { name: 'West Virginia', abreviation: 'WV' },
    { name: 'Wisconsin', abreviation: 'WI' },
    { name: 'Wyoming', abreviation: 'WY' },
];

var data_graph_2;

const categories = ["Clothing", "Accessories", "Footwear", "Outerwear"];

const seasons = ["Spring", "Fall", "Summer", "Winter"];

// FUNCTIONS
function loadGraph() {
    d3.csv('datos/shopping_trends.csv').then(function (data) {

        var data_cleaned = clean_data(data);

        var data_graph_1 = transform_data_for_graph_1(data_cleaned);

        data_graph_2 = transform_data_for_graph_2(data_cleaned);

        create_graph_1(data_graph_1);

        create_graph_2(data_graph_2["Alabama"], "Alabama")

    })
        .catch(function (error) {
            console.log("There was an error creating the graph:", error);
        });
}

function clean_data(data) {
    console.log("Data without any treatment")
    console.log(data);

    data.forEach(element => {
        element.purchase_amount_usd = Number.parseFloat(element.purchase_amount_usd);
    });

    console.log("Data cleaned")
    console.log(data);
    return data;
}

function transform_data_for_graph_1(data) {
    const aggregation = data.reduce((accumulator, transaction) => {
        const { location, purchase_amount_usd } = transaction;

        if (!accumulator[location]) {
            accumulator[location] = { location, total: 0 };
        }

        accumulator[location].total += purchase_amount_usd;

        return accumulator;
    }, {});

    console.log("Data transformed for graph 1")
    console.log(aggregation);

    return aggregation;
}

function transform_data_for_graph_2(data) {

    var result = [];

    states.forEach(element => {
        var accumulators = [
            { season: "Summer", clothing: 0, accessories: 0, footwear: 0, outerwear: 0 },
            { season: "Fall", clothing: 0, accessories: 0, footwear: 0, outerwear: 0 },
            { season: "Winter", clothing: 0, accessories: 0, footwear: 0, outerwear: 0 },
            { season: "Spring", clothing: 0, accessories: 0, footwear: 0, outerwear: 0 },
        ];

        const categories = ["Clothing", "Accessories", "Footwear", "Outerwear"];

        categories.forEach(cat => {
            seasons.forEach(sea => {
                data.forEach(e => {
                    if (e.location == element.name && e.category == cat && e.season == sea) {
                        
                        switch (categories.indexOf(cat)) {
                            case 0:
                                accumulators.find(e => e.season == sea).clothing += e.purchase_amount_usd;
                                break;
                            case 1:
                                accumulators.find(e => e.season == sea).accessories += e.purchase_amount_usd;
                                break;
                            case 2:
                                accumulators.find(e => e.season == sea).footwear += e.purchase_amount_usd;
                                break;
                            case 3:
                                accumulators.find(e => e.season == sea).outerwear += e.purchase_amount_usd;
                                break;
                            default:
                                throw Error;
                                break;
                        }
                    }
                });
            })
        })

        result[element.name] = accumulators
    });
        
    console.log("Data transformed for graph 2")
    console.log(result);

    return result;
}

function create_graph_1(data) {
    const width = 650;
    const height = 450;

    const graph1 = d3.select('body')
        .append("div")
        .attr("id", "graph1")
        .style("display", "block")
        .style("width", "60%")
        .style("float", "left")
        .style("margin-top", "2%");

    graph1.append("h2")
        .text("Cantidad de ventas por año en la tienda online X en los Estados Unidos");

    const svg = graph1.append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(750);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
        .domain([d3.min(Object.values(data), d => d.total), d3.max(Object.values(data), d => d.total)]);
    
    const tooltip = graph1.append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    d3.json('geojson/us-states.json').then(function (geojson) {

        geojson.features.push(geojson.features[0])

        svg.selectAll('path')
            .data(geojson.features)
            .enter().append('path')
            .attr('d', path)
            .attr('fill', d => {
                const stateName = d.properties.NAME;
                
                if (stateName == "District of Columbia") {
                    return colorScale(data["Washington"].total);
                }
                else {
                    return colorScale(data[stateName].total);
                }
            })
            .on('mouseover', function (event, d) {
                const stateName = d.properties.NAME;

                if (stateName == "District of Columbia") {
                    stateName = "Washington"
                }

                const sales = data[stateName].total;

                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);

                tooltip.html(`<b>${stateName}</b><br/>US$ ${sales}`)
                    .style('left', (event.clientX) + 'px')
                    .style('top', (event.clientY - 28) + 'px');
            })
            .on('mouseout', function (event, d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .on('click', function (event, d) {
                var graph2 = d3.select('#graph2');
                graph2.remove();
                
                create_graph_2(data_graph_2[d.properties.NAME], d.properties.NAME);
            });
        
        geojson.features.push(geojson.features.find(x => x.properties.NAME == "California"));
        geojson.features.push(geojson.features.find(x => x.properties.NAME == "Georgia"));
        geojson.features.push(geojson.features.find(x => x.properties.NAME == "Colorado"));
        geojson.features.push(geojson.features.find(x => x.properties.NAME == "Arkansas"));
        geojson.features.push(geojson.features.find(x => x.properties.NAME == "Connecticut"));

        svg.selectAll('text')
            .data(geojson.features)
            .enter().append('text')
            .attr('transform', d => `translate(${path.centroid(d)})`)
            .attr('dy', '0.3em')
            .style('text-anchor', 'middle')
            .style('font-size', "8px")
            .style("font-weight", "bold")
            .text(d => {
                const estadoInfo = states.find(estado => estado.name === d.properties.NAME);

                return estadoInfo != null ? estadoInfo.abreviation : d.properties.NAME;
            })
            .on('click', function (event, d) {
                var graph2 = d3.select('#graph2');
                graph2.remove();

                create_graph_2(data_graph_2[d.properties.NAME], d.properties.NAME);
            });;
    })
        .catch(function (error) {
            console.log("There was an error creating the graph:", error);
        });;

    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width - 200) + ',' + (height - 20) + ')');

    const legendScale = d3.scaleLinear()
        .domain([d3.min(Object.values(data), d => d.total), d3.max(Object.values(data), d => d.total)])
        .range([0, 200]);

    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d3.format(',.0f'));

    legend.append('g')
        .attr('class', 'axis')
        .call(legendAxis);

    legend.selectAll('rect')
        .data(colorScale.ticks(5).map(colorScale))
        .enter().append('rect')
        .attr('x', (d, i) => i * 40)
        .attr('width', 40)
        .attr('height', 8)
        .attr('fill', d => d);

    legend.append('text')
        .attr('class', 'legend-title')
        .attr('x', 0)
        .attr('y', -10)
        .text('Cantidad de Ventas (US$)');
    
    graph1.append("p").text('Fuente:  BANERJEE, S. "Customer Shopping Trends Dataset".  Disponible en  <a href="https://www.kaggle.com/datasets/iamsouravbanerjee/customer-shopping-trends-dataset">https://www.kaggle.com/datasets/iamsouravbanerjee/customer-shopping-trends-dataset</a>, último acceso Noviembre, 2023.')
    .style("font-size", "10px"
    )
    .style("margin-top","5%")
}

function create_graph_2(data, state) {

    const graph2 = d3.select('body')
        .append("div")
        .attr("id", "graph2")
        .style("display", "block")
        .style("float", "right")
        .style("margin-top", "8%")
        .style("width", "30%");
    
    graph2.append("h3")
        .text("Cantidad de ventas por categoría en las estaciones del año en " + state);

    var margin = { top: 20, right: 100, bottom: 170, left: 70 },
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = graph2.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.season))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.clothing, d.accessories, d.footwear, d.outerwear))])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const lineClothing = d3.line()
        .x(d => xScale(d.season) + xScale.bandwidth() / 2)
        .y(d => yScale(d.clothing));

    const lineAccessories = d3.line()
        .x(d => xScale(d.season) + xScale.bandwidth() / 2)
        .y(d => yScale(d.accessories));

    const lineFootwear = d3.line()
        .x(d => xScale(d.season) + xScale.bandwidth() / 2)
        .y(d => yScale(d.footwear));

    const lineOuterwear = d3.line()
        .x(d => xScale(d.season) + xScale.bandwidth() / 2)
        .y(d => yScale(d.outerwear));
    
    var color = function (value) {
        var map = {
            0: "rgb(247, 135, 79)",
            1: "rgb(254, 239, 169)",
            2: "rgb(189, 225, 237)",
            3: "rgb(81, 128, 186)"
        }

        return map[value];
    }

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(0))
        .attr('stroke-width', 2)
        .attr('d', lineClothing);

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(1))
        .attr('stroke-width', 2)
        .attr('d', lineAccessories);

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(2))
        .attr('stroke-width', 2)
        .attr('d', lineFootwear);

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(3))
        .attr('stroke-width', 2)
        .attr('d', lineOuterwear);
    
    var customFormat = function (value) {
        var translation = {
            "Spring": "Primavera",
            "Summer": "Verano",
            "Fall": "Otoño",
            "Winter": "Invierno"
        };

        return translation[value];
    };

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(customFormat));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0, 350)");

    var legendData = ["Ropas", "Accesorios", "Calzados", "Ropas de Calle"];

    var legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", function (d, i) {
            return "translate(0, " + i * -25 + ")";
        });

    legendItems.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function (d, i) {
            return color(i);
        });

    legendItems.append("text")
        .attr("x", 30)
        .attr("y", 10)
        .attr("dy", ".15em")
        .style("text-anchor", "start")
        .text(function (d) {
            return d;
        });

    svg.append("text")
        .attr("transform", "translate(" + (width / 2.5) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Estación del Año");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Cantidad de Ventas (US$)");
}