/*
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
 * This class implements the RESTful transport of apiServiceRequest()'s
 *
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 */
var 
	Google_Client		=	require('../Google_Client'),
	URI_Template_Parser	=	require("uritemplate");

var Google_REST 	=	function(){};

Google_REST.prototype	=	{
	/**
	 * Executes a apiServiceRequest using a RESTful call by transforming it into
	 * an apiHttpRequest, and executed via apiIO::authenticatedRequest().
	 *
	 * @param Google_HttpRequest $req
	 * @return array decoded result
	 * @throws Google_ServiceException on server side error (ie: not authenticated,
	 *	invalid or malformed post body, invalid url)
	 */
	execute	:	function(/*Google_HttpRequest*/ req,io,callback) {
		me = this;
		io.makeRequest(req,function(response){
		var decodedResponse = me.decodeHttpResponse(response);
		var ret = typeof decodedResponse['data'] !== 'undefined' 
				? decodedResponse['data'] : decodedResponse;
		callback(response);
		});
	},

	
	/**
	 * Decode an HTTP Response.
	 * @static
	 * @throws Google_ServiceException
	 * @param Google_HttpRequest $response The http response to be decoded.
	 * @return mixed|null
	 */
	decodeHttpResponse	:	function(response) {
		var code = response.getResponseHttpCode();
		var body = response.getResponseBody();
		var decoded = null;
		
		if (code != '200' && code != '201' && code != '204') {
console.log(body);
			var decoded = JSON.parse(body);
			var err = 'Error calling ' + response.getRequestMethod() + ' ' + response.getUrl();
			if (decoded != null && decoded['error']['message'] && decoded['error']['code']) {
				// if we're getting a json encoded error definition, use that instead of the raw response
				// body for improved readability
				err += ": ("+decoded['error']['code']+") "+decoded['error']['message'];
			} else {
				err += ": ("+code+") "+body;
			}

			throw new Google_ServiceException(err, code, null, decoded['error']['errors']);
		}
		
		// Only attempt to decode the response, if the response code wasn't (204) 'no content'
		if (code != '204') {
			decoded = JSON.parse(body);
			if (decoded === null || decoded === "") {
				throw new Google_ServiceException("Invalid json in service response: "+body);
			}
		}
		return decoded;
	},

	/**
	 * Parse/expand request parameters and create a fully qualified
	 * request uri.
	 * @static
	 * @param string $servicePath
	 * @param string $restPath
	 * @param array $params
	 * @return string $requestUrl
	 */
	createRequestUri	:	function(servicePath, restPath, params) {
		var requestUrl = servicePath + restPath;
		var uriTemplateVars = [];
		var queryVars = [];
		for(var paramName in params ) {
			var paramSpec = params[paramName];
			// Discovery v1.0 puts the canonical location under the 'location' field.
			if (! paramSpec['location']) {
				paramSpec['location'] = paramSpec['restParameterType'];
			}

			if (paramSpec['type'] == 'boolean') {
				paramSpec['value'] = (paramSpec['value']) ? 'true' : 'false';
			}
			if (paramSpec['location'] == 'path') {
				uriTemplateVars[paramName] = paramSpec['value'];
			} else {
				if (paramSpec['repeated'] && Array.isArray(paramSpec['value'])) {
					for(var i in paramSpec['value'] ) {
						var value = paramSpec['value'][i];
						queryVars.push( paramName + '=' + encodeURIComponent(value));
					}
				} else {
					queryVars.push( paramName + '=' + encodeURIComponent(paramSpec['value']));
				}
			}
		}

		if (Object.keys(uriTemplateVars).length) {
			uriTemplateParser = URI_Template_Parser.parse(requestUrl);
			requestUrl = uriTemplateParser.expand(uriTemplateVars);
		}
		//FIXME work around for the the uri template lib which url encodes
		// the @'s & confuses our servers.
		requestUrl = requestUrl.replace('%40','@');

		if (queryVars.length) {
			requestUrl += '?' + queryVars.join('&');
		}

		return requestUrl;
	}
}

module.exports	=	new Google_REST();
