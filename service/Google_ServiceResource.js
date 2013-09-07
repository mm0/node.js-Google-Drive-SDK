/**
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Implements the actual methods/resources of the discovered Google API using magic function
 * calling overloading (__call()), which on call will see if the method name (plus.activities.list)
 * is available in this service, and if so construct an apiHttpRequest representing it.
 *
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 *
 */
var array_merge = require('../helpers/array_merge');
var Google_REST = require('../io/Google_REST');
var Google_HttpRequest = require('../io/Google_HttpRequest');

var Google_ServiceResource =	function(options){
	// Valid query parameters that work, but don't appear in discovery.
	this.stackParameters = {
			'alt' : {'type' : 'string', 'location' : 'query'},
			'boundary' : {'type' : 'string', 'location' : 'query'},
			'fields' : {'type' : 'string', 'location' : 'query'},
			'trace' : {'type' : 'string', 'location' : 'query'},
			'userIp' : {'type' : 'string', 'location' : 'query'},
			'userip' : {'type' : 'string', 'location' : 'query'},
			'file' : {'type' : 'complex', 'location' : 'body'},
			'data' : {'type' : 'string', 'location' : 'body'},
			'mimeType' : {'type' : 'string', 'location' : 'header'},
			'uploadType' : {'type' : 'string', 'location' : 'query'},
			'mediaUpload' : {'type' : 'complex', 'location' : 'query'}
	};

	/** @var Google_Service $service */
	this.service	=	options.service;

	/** @var string $serviceName */
	this.serviceName	=	options.serviceName;

	/** @var string $resourceName */
	this.resourceName	=	options.resourceName;

	/** @var array $methods */
	this.methods = typeof options.resource['methods'] !== 'undefined' ? options.resource.methods : { resourceName : options.resource };

};
Google_ServiceResource.prototype.stripNull=	function(array){
		for(var i in array){
			if(array[i] == null || array[i] == 'null')
				delete array[i]; 
		}
	};

	/**
	 * @param $name
	 * @param $arguments
	 * @return Google_HttpRequest|array
	 * @throws Google_Exception
	 */
Google_ServiceResource.prototype.request =	function(name, callback,args) {
		if (! this.methods[name]) {
			throw new Google_Exception("Unknown function: {$this->serviceName}->{$this->resourceName}->{$name}()");
		}
		method = this.methods[name];
		parameters = args;

		// postBody is a special case since it's not defined in the discovery document as parameter, but we abuse the param entry for storing it
		postBody = null;
		if (parameters && parameters.postBody) {
			this.stripNull(parameters['postBody']);

			// Some APIs require the postBody to be set under the data key.
			if (Array.isArray(parameters['postBody']) && 'latitude' == this.serviceName) {
				if (!(parameters['postBody']['data'])) {
					rawBody = parameters['postBody'];
					delete parameters['postBody'];
					parameters['postBody']['data'] = rawBody;
				}
			}

			/*$postBody = is_array($parameters['postBody']) || is_object($parameters['postBody'])
					? json_encode($parameters['postBody'])
					: $parameters['postBody'];
			*/
			postBody = JSON.stringify(parameters['postBody']);
			delete parameters['postBody'];

			if (parameters['optParams']) {
				optParams = parameters['optParams'];
				delete parameters['optParams'];
				parameters = array_merge(parameters, optParams);
			}
		}

		if (!method['parameters']) {
			method['parameters'] = [];
		}
		
		method['parameters'] = array_merge(method['parameters'], this.stackParameters);
		for(var key in parameters ) {
			var val = parameters[key];

			if (key != 'postBody' && ! method['parameters'][key]) {
				throw new Google_Exception("($name) unknown parameter: '$key'");
			}
		}
		if (method['parameters']) {
			for(var paramName in method['parameters'] ) {
				var paramSpec = method['parameters'][paramName];
				if (paramSpec['required'] && paramSpec['required'] && ! parameters[paramName]) {
					throw new Google_Exception("($name) missing required param: '$paramName'");
				}
				if (parameters && parameters[paramName]) {
					value = parameters[paramName];
					parameters[paramName] = paramSpec;
					parameters[paramName]['value'] = value;
					delete parameters[paramName]['required'];
				} else {
					if (parameters )
					delete parameters[paramName];
				}
			}
		}

		// Discovery v1.0 puts the canonical method id under the 'id' field.
		if (! method['id']) {
			method['id'] = method['rpcMethod'];
		}

		// Discovery v1.0 puts the canonical path under the 'path' field.
		if (! method['path']) {
			method['path'] = method['restPath'];
		}

		//servicePath = this.service.servicePath;
		servicePath = this.servicePath;

		// Process Media Request
		contentType = false;
		if (method['mediaUpload']) {
			media = Google_MediaFileUpload.process(postBody, parameters);
			if (media) {
				contentType = media['content-type'] ? media['content-type']: null;
				postBody = media['postBody'] ? media['postBody'] : null;
				servicePath = method['mediaUpload']['protocols']['simple']['path'];
				method['path'] = '';
			}
		}

		url = Google_REST.createRequestUri(servicePath, method['path'], parameters);
		httpRequest = new Google_HttpRequest(url, method['httpMethod'], null, postBody);
		if (postBody) {
			contentTypeHeader = [];
			if (contentType && contentType) {
				contentTypeHeader['content-type'] = contentType;
			} else {
				contentTypeHeader['content-type'] = 'application/json; charset=UTF-8';
				contentTypeHeader['content-length'] = Google_Utils.getStrLen(postBody);
			}
			httpRequest.setRequestHeaders(contentTypeHeader);
		}

		this.client.auth.setClient(this.client);
		var io =  this.client.io;
		this.client.auth.sign(httpRequest,function(httpRequest){
			/*TODO: figure out why this isn't being added automatically */
			httpRequest.url = "https://www.googleapis.com/"+httpRequest.url;
			if (parameters && parameters.uploadType && parameters['uploadType']['value']
					&& 'resumable' == parameters['uploadType']['value']) {
				return httpRequest;
			}
			Google_REST.execute(httpRequest,io,callback);
		});
/*	TODO:
		Batch requests

		if (Google_Client::useBatch) {
			return $httpRequest;
		}
*/
		// Terminate immediatly if this is a resumable request.

	};




module.exports = Google_ServiceResource;
