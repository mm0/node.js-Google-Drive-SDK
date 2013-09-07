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
 * HTTP Request to be executed by apiIO classes. Upon execution, the
 * responseHttpCode, responseHeaders and responseBody will be filled in.
 *
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 *
 */
var config = require("../config");
var crypto = require('crypto');

var Google_HttpRequest = function(url,method,headers,postBody){
	if (!method ) method= "GET";
	if (!headers) headers= [];
	if (!postBody) postBody= null;
	this.USER_AGENT_SUFFIX = "google-api-node-client/0.6.0",
	this.userAgent = (typeof config['application_name'] == 'string' && config['application_name'].length ? config['application_name'] : "" )+ this.USER_AGENT_SUFFIX
	this.batchHeaders = {
		'Content-Type' : 'application/http',
		'Content-Transfer-Encoding' : 'binary',
		'MIME-Version' : '1.0',
		'Content-Length' : ''
	},

	this.url	=	url,
	this.requestMethod	=	method,
	this.requestHeaders	=	headers,
	this.postBody		=	postBody,

	this.responseHttpCode,
	this.responseHeaders,
	this.responseBody,
	
	this.accessKey;

};

Google_HttpRequest.prototype	=	{


	/**
	 * Misc function that returns the base url component of the url
	 * used by the OAuth signing class to calculate the base string
	 * @return string The base url component of the url.
	 * @see http://oauth.net/core/1.0a/#anchor13
	 */
	getBaseUrl : function () {
		var url = this.url.split("?");
		return url[0];
	},

	/**
	 * Misc function that returns an array of the query parameters of the current
	 * url used by the OAuth signing class to calculate the signature
	 * @return array Query parameters in the query string.
	 */
	getQueryParams : function () {
		var url = this.url.split("?");
		if (url.length>1){
			queryStr = url[1];
			var params = [];
			parse_str(queryStr, params);
			return params;
		}
		return [];
	},

	/**
	 * @return string HTTP Response Code.
	 */
	getResponseHttpCode : function () {
		return parseInt(this.responseHttpCode);
	},

	/**
	 * @param int responseHttpCode HTTP Response Code.
	 */
	setResponseHttpCode : function (responseHttpCode) {
		this.responseHttpCode = responseHttpCode;
	},

	/**
	 * @return responseHeaders (array) HTTP Response Headers.
	 */
	getResponseHeaders : function () {
		return this.responseHeaders;
	},

	/**
	 * @return string HTTP Response Body
	 */
	getResponseBody : function () {
		return this.responseBody;
	},

	/**
	 * @param array headers The HTTP response headers
	 * to be normalized.
	 */
	setResponseHeaders : function (headers) {
		/*
		headers = Google_Utils::normalize(headers);
		if (this.responseHeaders) {
			headers = array_merge(this.responseHeaders, headers);
		}
		*/
		this.responseHeaders = headers;
	},

	/**
	 * @param string key
	 * @return array|boolean Returns the requested HTTP header or
	 * false if unavailable.
	 */
	getResponseHeader : function (key) {
		return this.responseHeaders[key]
				? this.responseHeaders[key]
				: false;
	},

	/**
	 * @param string responseBody The HTTP response body.
	 */
	setResponseBody : function (responseBody) {
		this.responseBody = responseBody;
	},

	/**
	 * @return string url The request URL.
	 */

	getUrl : function () {
		return this.url;
	},

	/**
	 * @return string method HTTP Request Method.
	 */
	getRequestMethod : function () {
		return this.requestMethod;
	},

	/**
	 * @return array headers HTTP Request Headers.
	 */
	getRequestHeaders : function () {
		return this.requestHeaders;
	},

	/**
	 * @param string key
	 * @return array|boolean Returns the requested HTTP header or
	 * false if unavailable.
	 */
	getRequestHeader : function (key) {
		return this.requestHeaders[key]
				? this.requestHeaders[key]
				: false;
	},

	/**
	 * @return string postBody HTTP Request Body.
	 */
	getPostBody : function () {
		return this.postBody;
	},

	/**
	 * @param string url the url to set
	 */
	setUrl : function (url) {
		if (url.indexOf('http')==0) {
			this.url = url;
		} else {
			// Force the path become relative.(? absolute?)
			if (url.charAt(0) !== '/') {
				url = '/' + url;
			}
			this.url = config['basePath'] + url;
		}
	},

	/**
	 * @param string method Set he HTTP Method and normalize
	 * it to upper-case, as required by HTTP.
	 *
	 */
	setRequestMethod : function (method) {
		this.requestMethod = strtoupper(method);
	},

	/**
	 * @param array headers The HTTP request headers
	 * to be set and normalized.
	 */
	setRequestHeaders : function (headers) {
		/*headers = Google_Utils.normalize(headers);
		if (this.requestHeaders) {
			headers = array_merge(this.requestHeaders, headers);
		}
		*/
		this.requestHeaders = headers;
	},

	/**
	 * @param string postBody the postBody to set
	 */
	setPostBody : function (postBody) {
		this.postBody = postBody;
	},

	/**
	 * Set the User-Agent Header.
	 * @param string userAgent The User-Agent.
	 */
	setUserAgent : function (userAgent) {
		this.userAgent = userAgent;
	},

	/**
	 * @return string The User-Agent.
	 */
	getUserAgent : function () {
		return this.userAgent;
	},

	/**
	 * Returns a cache key depending on if this was an OAuth signed request
	 * in which case it will use the non-signed url and access key to make this
	 * cache key unique per authenticated user, else use the plain request url
	 * @return string The md5 hash of the request cache key.
	 */
	getCacheKey : function () {
		key = this.getUrl();

		if (this.accessKey) {
			key += this.accessKey;
		}

		if (this.requestHeaders['authorization']) {
			key += this.requestHeaders['authorization'];
		}
		return crypto.createHash('md5').update(key).digest("hex");
	},

	getParsedCacheControl : function () {
		parsed = [];
		rawCacheControl = this.getResponseHeader('cache-control');
		if (rawCacheControl) {
			rawCacheControl = rawCacheControl.replace(', ', '&');
			parse_str(rawCacheControl, parsed);
		}

		return parsed;
	},

	/**
	 * @param string id
	 * @return string A string representation of the HTTP Request.
	 */
	toBatchString : function (id) {
		str = '';
		for(var key in this.batchHeaders ) {
			val = this.batchHeaders[key];
			str += key + ': ' + val + "\n";
		}

		str += "Content-ID: id\n";
		str += "\n";

		parsed = url.parse(this.getUrl());
		path = parsed.path;
		str += this.getRequestMethod() + ' ' + path + " HTTP/1.1\n";
		var headers = this.getRequestHeaders();
		for(var key in headers){
			val = headers[key];
			str += key + ': ' + val + "\n";
		}

		if (this.getPostBody()) {
			str += "\n";
			str += this.getPostBody();
		}

		return str;
	},
}



module.exports = Google_HttpRequest;
