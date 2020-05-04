var app = new Vue({
    // This is the id of our referenced div-element
    // only this element and everything in it
    // will be connected to the data
    el: '#app',
    data: {
        tests: [],
        geolocation: {},
        svgWidth : window.innerWidth,
        svgHeight : window.innerHeight,
        margin: {top: 50, left: 50, bottom: 50, right: 50 },
        tooltipVisible: false,
        multiplier: 1,
        maxMultiplier: 18,
        nycGeoJSON: null,
        map:false,
        outlineButton:false,
        population: {},
        neighborhoods:{},
        income:{},
        showAbout: true,
        sortOutcomes: false,
        totals: [],
        color: 'zcta_cum.perc_pos',
        predicted: []
    },
    created () {
        var that = this;

        d3.dsv(';','data/us-zip-code-latitude-and-longitude.csv').then(function(data){
            data.forEach(element => {
                that.geolocation[element.Zip] = element
            });
        })

        d3.json('data/nyc.json').then(function(data){
            that.nycGeoJSON = data

        })

        d3.csv('data/population.csv').then(function(data){
            data.forEach(element => {
                that.population[element.Zip] = element
            });

        })

        d3.csv('data/income.csv').then(function(data){
            data.forEach(element => {
                that.income[element.Zip] = element
            });

        })

        d3.csv('data/neighborhoods.csv').then(function(data){
            data.forEach(element => {
                element.Zip = JSON.parse(element.Zip)
                for (i in element.Zip){
                    let zip = element.Zip[i]
                    that.neighborhoods[zip] = {Borough: element.Borough, Neighborhood: element.Neighborhood}
                    
                }
            });
        })

        d3.csv('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/tests-by-zcta.csv').then(function(data){
            data.forEach(element => {
                element.x = Math.random()
                element.y = Math.random()
                if(element.MODZCTA != "NA"){
                    if (element.MODZCTA != "99999"){ // no idea why i had to nest this
                        element.Total = parseInt(element.Total)
                        element.Positive = parseInt(element.Positive)
                        element.neighborhood = that.neighborhoods[element.MODZCTA]
                        element.population = parseInt(that.population[element.MODZCTA].Population)
                        element.density = parseInt(that.population[element.MODZCTA].Density)
                        element.populationTested = (element.Total / element.population)*100
                        element.populationPositive = (element.Positive / element.population)*100
                        if (that.income.hasOwnProperty(element.MODZCTA)){
                            element.income = parseInt(that.income[element.MODZCTA]['Avg-Income'])
                            element.testIncome = element.Total / element.income
                        } else {
                            element.income = 'N/A'
                            element.testIncome = 'N/A'
                        }

                        that.tests.push(element)
                    }
                }
            });

            for (let i in that.tests){
                let zip = that.tests[i]
                for (let x=0;x<zip.Total;x+=500){
                    if (x <= zip.Positive){
                        that.totals.push({'zip':zip.MODZCTA, outcome: 'Positive',x:0, y:-100, multiplier:0})
                        that.predicted.push({'zip':zip.MODZCTA, outcome: 'Positive',x:0, y:-100,multiplier:0})

                    } else {
                        that.totals.push({'zip':zip.MODZCTA, outcome: 'Negative',x:0, y:-100,multiplier:0})
                        that.predicted.push({'zip':zip.MODZCTA, outcome: 'Negative',x:0, y:-100,multiplier:0})
                    }
                }
            }

        })
    },
    mounted(){
        setTimeout(()=> {
            this.updateCoords()
        },500)
    },
    computed: {

        width() {
            return this.svgWidth - this.margin.left - this.margin.right;
        },
        gridWidth() {
            return (this.svgWidth*0.75) - this.margin.left - this.margin.right;
        },
        height() {
            return this.svgHeight - this.margin.top - this.margin.bottom;
        },
        multiplierScale(){
            let color = d3.scaleSequential()
            .domain([this.maxMultiplier,0]).interpolator(d3.interpolateRdYlGn)

            return color(this.multiplier)
        },
        scale() {

            let x = d3.scaleTime().range([0, this.width])
                .domain([0,1]);

            let y = d3.scaleLinear().range([0,this.height])
                .domain([0,1]);

            const size = d3.scaleLinear().range([5,500])
                .domain([0,d3.max(this.tests, d => d.Positive * this.maxMultiplier)]);

                let color = d3.scaleSequential()
                    .domain(d3.extent(this.tests, d => d[this.color]).reverse()).interpolator(d3.interpolateRdYlGn)

                if (this.color == 'income'){
                    color = d3.scaleSequential()
                        .domain(d3.extent(this.tests, d => d[this.color])).interpolator(d3.interpolateRdYlGn)
                }

            if (this.map){
                x = (x) => x
                y = (y) => y
            }

            return {size, x, y, color};
        },
        grid(){
            const rowLength = Math.ceil(Math.sqrt(this.predicted.length))
            let color = (el) => {
                if (el.outcome == "Positive"){
                    return "#fca52a"
                } else if (el.outcome == "Negative") {
                    return "#ffcc02"
                } else {
                    return "#d6d6d6"
                }
            }

            size = this.height / (rowLength*3);

            return {color, size}
        },
        nyc(){
            let path = d3.geoPath()
                .projection(this.mapProjection)

            return path(this.nycGeoJSON)
        },
        mapProjection(){
            return d3.geoConicConformal()
            .parallels([33, 45])
            .rotate([96, -39])
            .fitSize([this.width, this.height], this.nycGeoJSON)
        },
        outline(){
            if (this.map == false){
                return false
            } else {
                return this.outlineButton
            }
        }
    },
    methods: {
        tooltip(el){
            tooltip = d3.select('#tooltip')
                    .style("left", (event.clientX) + "px")		
                    .style("top", (event.clientY) + "px");	
            this.tooltipVisible = true;

            let tooltipString =''
            if (this.neighborhoods.hasOwnProperty(el.MODZCTA)){
                tooltipString += `Neighborhood: ${this.neighborhoods[el.MODZCTA].Neighborhood}<br>
                Borough: ${this.neighborhoods[el.MODZCTA].Borough}<br>`
            }

            tooltipString += `Zip: ${el.MODZCTA}<br>
            Number of Tests: ${el.Total}<br>
            Number of positive: ${el.Positive}<br>
            Percentage positive: ${el['zcta_cum.perc_pos']}<br>
            Projected Number of Positive in Population: ${el.Positive * this.multiplier}`

            if (this.population.hasOwnProperty(el.MODZCTA)){
                let populationTested = (el.Total / this.population[el.MODZCTA].Population)*100
                let PopulationPositive = (el.Positive / this.population[el.MODZCTA].Population)*100
                let PopulationProjected = ((el.Positive*this.multiplier) / this.population[el.MODZCTA].Population)*100

                tooltipString += `<br>Zip Population: ${this.population[el.MODZCTA].Population}<br>
                Zip Population Density: ${this.population[el.MODZCTA].Density} Sq Mile<br>
                Percentage of Population Tested: ${populationTested.toFixed(2)}%<br>
                Percentage of Population Tested Positive: ${PopulationPositive.toFixed(2)}%<br>
                Projected Percentage of Population Tested Positive: ${PopulationProjected.toFixed(2)}%`
            }

            tooltipString += `<br>Median Income: ${el.income}<br>
            Tests / Income: ${el.testIncome}<br>`

            document.querySelector('#tooltip').innerHTML = tooltipString;
        },
        gridTooltip(el){
            tooltip = d3.select('#tooltip')
                    .style("left", (event.clientX) + "px")		
                    .style("top", (event.clientY) + "px");	
            this.tooltipVisible = true;

            let tooltipString =''
            if (this.neighborhoods.hasOwnProperty(el.zip)){
                tooltipString += `Neighborhood: ${this.neighborhoods[el.zip].Neighborhood}<br>
                Borough: ${this.neighborhoods[el.zip].Borough}<br>`
            }
            tooltipString += `Zip: ${el.zip}<br>
            Test Result: <strong>${el.outcome}</strong>`

            document.querySelector('#tooltip').innerHTML = tooltipString;
        },
        randomize(){
            this.tests.forEach(element => {
                element.x = Math.random()
                element.y = Math.random()
            });
        },
        updateCoords(){
            const rowLength = Math.ceil(Math.sqrt(this.predicted.length))
            const xScale = d3.scaleLinear()
                .domain([0,rowLength])
                .range([0, this.gridWidth])

            const x = (i) => xScale(i % rowLength )

            const yScale = d3.scaleLinear()
                .domain([0,rowLength])
                .range([0, this.height])

            const y = (i) => yScale(Math.floor(i / rowLength))

            for (let i = 0; i<this.predicted.length;i++){
                this.predicted[i].x = x(i)
                this.predicted[i].y = y(i)
            }
        }
    },
    watch:{
        multiplier(newVal, oldVal){

            let diff = newVal - oldVal

            if (diff > 0 ){
                for(let i in this.totals){
                    let el = this.totals[i]
                    for (let x=oldVal;x<newVal;x++){
                        this.predicted.push({'zip':el.zip, outcome: 'Unknown / Untested', multiplier:x+1})
                    }
                }
            } else {
                this.predicted = this.predicted.filter(x => x.multiplier <= newVal)
            }

            this.updateCoords()

        },
        map(){
            if(this.map){
                let that = this
                this.tests.forEach(element => {
                    if (that.geolocation.hasOwnProperty(element.MODZCTA)){
                        let coords = that.mapProjection([that.geolocation[element.MODZCTA].Longitude, that.geolocation[element.MODZCTA].Latitude])
                        element.x = coords[0]
                        element.y = coords[1]
                    }
                });
            } else {
                this.randomize()
            }
        },
        sortOutcomes(){
            if (this.sortOutcomes){
                this.predicted.sort((a,b) => (a.outcome < b.outcome) ? 1 : ((b.outcome < a.outcome) ? -1 : 0));
            } else {
                this.predicted.sort((a,b) => (a.zip < b.zip) ? 1 : ((b.zip < a.zip) ? -1 : 0));
            }
        }
    }
});



