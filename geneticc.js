/***********************************************************************************
/* Genetic Algorithm implementation
/***********************************************************************************/

var GeneticAlgorithm = function(max_units, top_units){
	this.max_units = max_units; // max number of units in population
	this.top_units = top_units; // number of top units (winners) used for evolving population
	
	if (this.max_units < this.top_units) this.top_units = this.max_units;
	
	this.Population = []; // array of all units in current population
	
	this.SCALE_FACTOR = 200; // the factor used to scale normalized input values
}

GeneticAlgorithm.prototype = {
	// resets genetic algorithm parameters
	reset : function(){
		this.iteration = 1;	// current iteration number (it is equal to the current population number)
		this.mutateRate = 1; // initial mutation rate
		
		this.best_population = 0; // the population number of the best unit
		this.best_fitness = 0;  // the fitness of the best unit
		this.best_score = 0;	// the score of the best unit ever
	},
	
	// creates a new population
	createPopulation : function(){
		// clear any existing population
		this.Population.splice(0, this.Population.length);
		
		for (var i=0; i<this.max_units; i++){
			// create a new unit by generating a random Synaptic neural network
			// with 2 neurons in the input layer, 6 neurons in the hidden layer and 1 neuron in the output layer
			var newUnit = new synaptic.Architect.Perceptron(2, 6, 1);
			
			// set additional parameters for the new unit
			newUnit.index = i;
			newUnit.fitness = 0;
			newUnit.score = 0;
			newUnit.isWinner = false;
			
			// add the new unit to the population 
			this.Population.push(newUnit);
		}
	},
	// activates the neural network of an unit from the population 
	// to calculate an output action according to the inputs
	activateBrain : function(bird, target){		
		// input 1: the horizontal distance between the bird and the target
		var targetDeltaX = this.normalize(target.x, 700) * this.SCALE_FACTOR;
		
		// input 2: the height difference between the bird and the target
		var targetDeltaY = this.normalize(bird.y - target.y, 800) * this.SCALE_FACTOR;
	
		// create an array of all inputs
		var inputs = [targetDeltaX, targetDeltaY];
		
		// calculate outputs by activating synaptic neural network of this bird
		var outputs = this.Population[bird.index].activate(inputs);
			
		// perform flap if output is greater than 0.5
		if (outputs[0] > 0.5) bird.flap();
	},
	
}
