var drive = require('./drive.json');
var Google_ServiceResource = require('../service/Google_ServiceResource');
var util = require('util');

var classd =	function() {};
for(var i in drive['methods']){
	classd.prototype[i]	= function(){ 
		this.scopes = drive['methods'][i]['scopes'];
		this.parameters= drive['methods'][i]['parameters'];
		this.request= drive['methods'][i]['request'];
		this.response= drive['methods'][i]['response'];
		this.httpMethod= drive['methods'][i]['httpMethod'];
		this.path= drive['methods'][i]['path'];
		this.id= drive['methods'][i]['id'];
	};

	}

console.log(classd.prototype);
util.inherits(classd,Google_ServiceResource);
var c = new classd();
for(var i in c){
	console.log(i);

}

module.exports = classd;
