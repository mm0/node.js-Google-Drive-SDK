var Google_ServiceResource	=	require('../service/Google_ServiceResource'),
	util		=	require("util");


 //var drive = require('./import_methods.js');


var Google_DriveService 	=	function(options){
	this.servicePath	=	"drive/v2/";
	this.version		=	"v2";
	this.serviceName	=	"drive";
	this.client 		= 	options.client;
	var drive_methods = require('./drive.json');
	this.methods = drive_methods.methods;
	for(var name in drive_methods['methods']){
		this[name]     = function(){ 
			/*this.scopes = drive_methods['methods'][name]['scopes'];
			this.parameters= drive_methods['methods'][name]['parameters'];
			this.request= drive_methods['methods'][name]['request'];
			this.response= drive_methods['methods'][name]['response'];
			this.httpMethod= drive_methods['methods'][name]['httpMethod'];
			this.path= drive_methods['methods'][name]['path'];
			this.id= drive_methods['methods'][name]['id'];
			this.args = arguments;
			*/
			this.request(name,arguments,function(){

			});
		};  
	};   
	options.client.addService(this.serviceName,	this.version);

};
util.inherits(Google_DriveService,Google_ServiceResource);

module.exports = Google_DriveService;
