class ShaclData { 

	constructor(className, targetClass) 
	{ 
		this.className = className;
		this.targetClass = targetClass;
		this.properties = new Map();
	}
	
	addProperty(property){
		this.properties.set(property, []);
	}
	
	setPropertyValues(property, value){
		this.properties.get(property).push(value);
	}
	
	getTurtle(){
		var lines = [];
		lines.push("@prefix dash: <http://datashapes.org/dash#> .");
		lines.push("@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .");
		lines.push("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .");
		lines.push("@prefix schema: <http://schema.org/> .");
		lines.push("@prefix sh: <http://www.w3.org/ns/shacl#> .");
		lines.push("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
		
		lines.push(this.className);
		lines.push("a " + this.extendClass + " ;");
		var get_keys = this.properties.keys(); 

		for (var prop of get_keys) 
		{ 
			lines.push(prop + " " + this.properties.get(prop) + " ;"); 
		}
		
		return lines;
	}
	
	printTurtle(){
		var lines = this.getTurtle();
		for (var line of lines) 
		{ 
			console.log(line); 
		}
	}
}