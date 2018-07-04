// the .then means the function is called only after the json file is downloaded
var dataURL = 'https://raw.githubusercontent.com/MQ-software-carpentry/D3-visualising-data/gh-pages/code/nations.json';
d3.json(dataURL)
	.then( function (nations) {
		console.table(nations);

		var chart = d3.select('#chart');
		var svg = chart.append('svg');

		var g = svg.append('g');
		var margin = { top: 20, left: 80, bottom: 50, right: 20 };
		var width = 960;
		var height = 350;
		var g_width = width - margin.left - margin.right;
		var g_height = height - margin.top - margin.bottom;

		svg.attr('width', width)
		svg.attr('height', height)

		g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		var incomes = [];
		var lifeExpectancies = [];
		var populations = [];
		nations.map( function (n) {
			incomes = incomes.concat(n.income);
			lifeExpectancies = lifeExpectancies.concat(n.lifeExpectancy);
			populations = populations.concat(n.population);
		});
		var xExtent = d3.extent(incomes);
		var yExtent = d3.extent(lifeExpectancies);
		var zExtent = d3.extent(populations);

		var regions = [
	      "Sub-Saharan Africa",
	      "South Asia",
	      "Middle East & North Africa",
	      "America",
	      "Europe & Central Asia",
	      "East Asia & Pacific"
    	];

    	var controls = d3.select('#controls');
    	regions.map( function (r) {
    		var div = controls.append('div');
    		div.append('input')
    			.attr('type', 'checkbox')
    			.attr('class', "checkbox")
    			.attr('value', r)
    			.attr('checked', true);
    		div.append('label')
    			.text(r);
    	});

    	var filtered_nations = nations.map(function(n) {return n;});

    	d3.selectAll('input').on('change', function () {
    		var region = this.value
    		if (this.checked) {
    			var new_nations = nations.filter (function (n) {
    				return n.region == region;
    			});
    			filtered_nations = filtered_nations.concat(new_nations);
    		} else {
    			filtered_nations = filtered_nations.filter( function (n) {
    				return n.region != region;
    				// console.log(n.region, region)
    			})
    			// console.log(filtered_nations);
    		}	
    		update();
    	});


    	var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

		console.log(xExtent)

		var xScale = d3.scaleLog()
						.domain(xExtent)
						.range([0, g_width]);
		var xAxis = d3.axisBottom(xScale)
						.ticks(10, ',.0f');
		g.append('g')
			.attr('class', 'x axis') // two classes added; x and axis class
			.attr('transform', 'translate(0,' + g_height + ')')
			.call(xAxis);

		var yScale = d3.scaleLinear()
						.domain(yExtent)
						.range([g_height, 0]);
		var yAxis = d3.axisLeft(yScale);
		g.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(0,' + 0+ ')')
			.call(yAxis);

		var rScale = d3.scaleSqrt()
						.domain(zExtent)
						.range([0, 40]);

		g.append('text')
			.attr('class', 'label')
			.text('Income per capita (dollars)')
			.attr('x', g_width/2)
			.attr('y', g_height + 40)


		g.append('text')
			.attr('class', 'label')
			.text('Life Expectancy (years)')
			.attr('transform', 'translate(-40,' + (g_height/2) + ') rotate(-90)')
			.attr('x', -g_height/4);

		function update() { 
			var circles = g.selectAll('.circle')
							.data(filtered_nations, function(d) {return d.name;});

			circles.enter()
				.append('circle') //html tag that happens to be the same name
				.attr('class', 'circle') //the class needs to be the same as the selectALL class above
				.attr('cx', function(d) {return xScale(d.income[d.income.length-1])})
				.attr('cy', function(d) {return yScale(d.lifeExpectancy[d.lifeExpectancy.length-1])})
				.attr('r', function(d) {return rScale(d.population[d.population.length-1])})
				.attr('fill', function(d) {return colorScale(d.region)});

			circles.exit().remove();
		}
		update();

	}).catch( function (err) {
		console.error(err)
	});



// var cat_image = document.getElementById('cat');
// var feed_button = document.getElementById('feed_button');

// cat_image.addEventListener('click', meow);
// feed_button.addEventListener('click', feed);

// function meow (event) {
// 	console.log(event)
// 	console.log('meow!');
// }

// function feed () {
// 	cat_image.style.height = cat_image.offsetHeight + 'px';
// 	cat_image.style.width = (cat_image.offsetWidth + 30) + 'px';
// }

// the .then means the function is called only after the json file is downloaded
// var dataURL = 'https://raw.githubusercontent.com/MQ-software-carpentry/D3-visualising-data/gh-pages/code/nations.json';
// d3.json(dataURL).then( function (nations) {
// 	console.table(nations)
// 	nations.map( function (n) {
// 		var year = n.years[n.years.length-1]
// 		var income = n.income[n.income.length-1]
// 		console.log(n.name, year, income)
// 	});
// }).catch( function (err) {
// 	console.error(err)
// });


// var fibs = [1,1,2,3,5,8,13];
// var json = JSON.stringify(fibs);
// console.log(json)








