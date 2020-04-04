var app = new Vue({
    // This is the id of our referenced div-element
    // only this element and everything in it
    // will be connected to the data
    el: '#app',
    data: {
        tests: [],
        svgWidth : window.innerWidth,
        svgHeight : window.innerHeight,
        margin: {top: 50, left: 50, bottom: 50, right: 50 },
        tooltipVisible: false,
        multiplier: 1,
        maxMultiplier: 18
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
    },
    computed: {
        width() {
            return this.svgWidth - this.margin.left - this.margin.right;
        },
        height() {
            return this.svgHeight - this.margin.top - this.margin.bottom;
        },
        scale() {
            const x = d3.scaleTime().range([0, this.width])
                .domain([0,1]);

            const y = d3.scaleLinear().range([0,this.height])
                .domain([0,1]);

            const size = d3.scaleLinear().range([5,500])
                .domain([0,d3.max(this.tests, d => d.Positive * this.maxMultiplier)]);

            return {size, x, y};
        }
    },
    methods: {
        tooltip(el){
            tooltip = d3.select('#tooltip')
                    .style("left", (event.clientX) + "px")		
                    .style("top", (event.clientY) + "px");	
            this.tooltipVisible = true;

            let tooltipString = `Zip: ${el.MODZCTA}<br>Number of Tests: ${el.Total}<br>Number of positive: ${el.Positive}<br>Projected Number of Positive in Population: ${el.Positive * this.multiplier}`

            document.querySelector('#tooltip').innerHTML = tooltipString;
        },
        randomize(){
            this.tests.forEach(element => {
                element.x = Math.random()
                element.y = Math.random()
            });
        }
    }
});



