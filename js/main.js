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
        population: {},
        neighborhoods:{},
        showAbout: true
    },
    created () {
        var that = this;

        d3.csv('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/tests-by-zcta.csv').then(function(data){
            data.forEach(element => {
                element.x = Math.random()
                element.y = Math.random()
            });
            that.tests = data

        })

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

        d3.csv('data/neighborhoods.csv').then(function(data){
            data.forEach(element => {
                element.Zip = JSON.parse(element.Zip)
                for (i in element.Zip){
                    let zip = element.Zip[i]
                    that.neighborhoods[zip] = {Borough: element.Borough, Neighborhood: element.Neighborhood}
                }
            });
        })

    },
    computed: {
        width() {
            return this.svgWidth - this.margin.left - this.margin.right;
        },
        height() {
            return this.svgHeight - this.margin.top - this.margin.bottom;
        },
        scale() {

            let x = d3.scaleTime().range([0, this.width])
                .domain([0,1]);

            let y = d3.scaleLinear().range([0,this.height])
                .domain([0,1]);

            const size = d3.scaleLinear().range([5,500])
                .domain([0,d3.max(this.tests, d => d.Positive * this.maxMultiplier)]);
            
            const color = d3.scaleSequential()
                .domain([100,0]).interpolator(d3.interpolateRdYlGn)

            if (this.map){
                x = (x) => x
                y = (y) => y
            }

            return {size, x, y,color};
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
                Percentage of Population Tested: ${populationTested.toFixed(2)}%<br>
                Percentage of Population Tested Positive: ${PopulationPositive.toFixed(2)}%<br>
                Projected Percentage of Population Tested Positive: ${PopulationProjected.toFixed(2)}%`
            }

            document.querySelector('#tooltip').innerHTML = tooltipString;
        },
        randomize(){
            this.tests.forEach(element => {
                element.x = Math.random()
                element.y = Math.random()
            });
        },
    },
    watch:{
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
        }
    }
});



