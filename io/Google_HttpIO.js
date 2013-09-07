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
 * Curl based implementation of apiIO.
 *
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 */

/*TODO : *///var Google_CacheParser = require('Google_CacheParser');
var 
	util 		= 	require('util'),
	Google_IO	=	require("./Google_IO"),
	_request 	= 	require('request'),
	querystring 	= 	require('querystring');

var Google_HttpIO = function() {
};
//util.inherits(Google_HttpIO,Google_IO);

	/**
	 * Perform an authenticated / signed apiHttpRequest.
	 * This function takes the apiHttpRequest, calls apiAuth.sign on it
	 * (which can modify the request in what ever way fits the auth mechanism)
	 * and then calls apiCurlIO::makeRequest on the signed request
	 *
	 * @param Google_HttpRequest request
	 * @return Google_HttpRequest The resulting HTTP response including the
	 * responseHttpCode, responseHeaders and responseBody.
	 */
Google_HttpIO.prototype.authenticatedRequest = function (/*Google_HttpRequest*/ request,client,callback) {
		me = this;
		client.auth.sign(request,function(request){
			me.makeRequest(request,callback);
		});
	};

	/**
	 * Execute a apiHttpRequest
	 *
	 * @param Google_HttpRequest request the http request to be executed
	 * @return Google_HttpRequest http request with the response http code, response
	 * headers and response body filled in
	 * @throws Google_IOException on curl or IO error
	 */
Google_HttpIO.prototype.makeRequest = function (/*Google_HttpRequest*/ request,callback) {
	headers = {};
	for (var header in request.requestHeaders){
		headers[header] = request.requestHeaders[header];
	}
	headers['content-type'] = 'application/x-www-form-urlencoded';
	options = {
		headers: headers,
		method: request.requestMethod,
		uri : request.url,
		body : querystring.stringify(request.postBody),
	};
	_request(options,function(error,response,body){
		request.setResponseHttpCode(response.statusCode);
		request.setResponseHeaders(response.headers);
		request.setResponseBody(response.body);
		callback(request);
	});
		// First, check to see if we have a valid cached version.
/*
	cached = this.getCachedRequest(request);
		if (cached !== false) {
			if (Google_CacheParser.mustRevalidate(cached)) {
				addHeaders = new Array();
				if (cached.getResponseHeader('etag')) {
					// [13.3.4] If an entity tag has been provided by the origin server,
					// we must use that entity tag in any cache-conditional request.
					addHeaders['If-None-Match'] = cached.getResponseHeader('etag');
				} elseif (cached.getResponseHeader('date')) {
					addHeaders['If-Modified-Since'] = cached.getResponseHeader('date');
				}

				request.setRequestHeaders(addHeaders);
			} else {
				// No need to revalidate the request, return it directly
				return cached;
			}
		}

		if (array_key_exists(request.getRequestMethod(),
					this.ENTITY_HTTP_METHODS)) {
			request = this.processEntityRequest(request);
		}

		ch = curl_init();
		curl_setopt_array(ch, this.curlParams);
		curl_setopt(ch, CURLOPT_URL, request.getUrl());
		if (request.getPostBody()) {
			curl_setopt(ch, CURLOPT_POSTFIELDS, request.getPostBody());
		}

		requestHeaders = request.getRequestHeaders();
		if (requestHeaders && is_array(requestHeaders)) {
			parsed = array();
			foreach (requestHeaders as k => v) {
				parsed[] = "k: v";
			}
			curl_setopt(ch, CURLOPT_HTTPHEADER, parsed);
		}

		curl_setopt(ch, CURLOPT_CUSTOMREQUEST, request.getRequestMethod());
		curl_setopt(ch, CURLOPT_USERAGENT, request.getUserAgent());
		respData = curl_exec(ch);

		// Retry if certificates are missing.
		if (curl_errno(ch) == CURLE_SSL_CACERT) {
			error_log('SSL certificate problem, verify that the CA cert is OK.'
				. ' Retrying with the CA cert bundle from google-api-php-client.');
			curl_setopt(ch, CURLOPT_CAINFO, dirname(__FILE__) . '/cacerts.pem');
			respData = curl_exec(ch);
		}

		respHeaderSize = curl_getinfo(ch, CURLINFO_HEADER_SIZE);
		respHttpCode = (int) curl_getinfo(ch, CURLINFO_HTTP_CODE);
		curlErrorNum = curl_errno(ch);
		curlError = curl_error(ch);
		curl_close(ch);
		if (curlErrorNum != CURLE_OK) {
			throw new Google_IOException("HTTP Error: (respHttpCode) curlError");
		}

		// Parse out the raw response into usable bits
		list(responseHeaders, responseBody) =
					this.parseHttpResponse(respData, respHeaderSize);

		if (respHttpCode == 304 && cached) {
			// If the server responded NOT_MODIFIED, return the cached request.
			if (isset(responseHeaders['connection'])) {
				hopByHop = array_merge(
					this.HOP_BY_HOP,
					explode(',', responseHeaders['connection'])
				);

				endToEnd = array();
				foreach(hopByHop as key) {
					if (isset(responseHeaders[key])) {
						endToEnd[key] = responseHeaders[key];
					}
				}
				cached.setResponseHeaders(endToEnd);
			}
			return cached;
		}

		// Fill in the apiHttpRequest with the response values
		// Store the request in cache (the function checks to see if the request
		// can actually be cached)
		this.setCachedRequest(request);
		// And finally return it
		return request;
*/
	};

	/**
	 * @visible for testing.
	 * Cache the response to an HTTP request if it is cacheable.
	 * @param Google_HttpRequest request
	 * @return bool Returns true if the insertion was successful.
	 * Otherwise, return false.
	 */
/*
	TODO: cache implementation
	setCachedRequest : function (Google_HttpRequest request) {
		// Determine if the request is cacheable.
		if (Google_CacheParser::isResponseCacheable(request)) {
			Google_Client::cache.set(request.getCacheKey(), request);
			return true;
		}

		return false;
	}

	/**
	 * @visible for testing.
	 * @param Google_HttpRequest request
	 * @return Google_HttpRequest|bool Returns the cached object or
	 * false if the operation was unsuccessful.
	 */

/*
	TODO: cache implementation
	getCachedRequest : function (Google_HttpRequest request) {
		if (false == Google_CacheParser::isRequestCacheable(request)) {
			false;
		}

		return Google_Client::cache.get(request.getCacheKey());
	}
*/

	/**
	 * @param respData
	 * @param headerSize
	 * @return array
	 */

Google_HttpIO.prototype.parseHttpResponse = 
		function (respData, headerSize) {
/*	TODO:

	May not be necessary today
*/
		if (respData.indexOf(this.CONNECTION_ESTABLISHED) <0 ) {
			respData = respData.replace(this.CONNECTION_ESTABLISHED, '');
		}

		if (headerSize) {
			responseBody = respData.substr(headerSize);
			responseHeaders = respData.substr(0, headerSize);
		} else {
			var data = explode("\r\n\r\n", respData, 2);
			var responseHeaders	= data[0];
			var responseBody = 	data[1];
		}

		responseHeaders = this.parseResponseHeaders(responseHeaders);
		return new Array(responseHeaders, responseBody);
	};

Google_HttpIO.prototype.parseResponseHeaders= function (/*Google_HttpRequest*/ response) {
/*
		responseHeaders = {};

		responseHeaderLines = explode("\r\n", rawHeaders);
		foreach (responseHeaderLines as headerLine) {
			if (headerLine && strpos(headerLine, ':') !== false) {
				list(header, value) = explode(': ', headerLine, 2);
				header = strtolower(header);
				if (isset(responseHeaders[header])) {
					responseHeaders[header] .= "\n" . value;
				} else {
					responseHeaders[header] = value;
				}
			}
		}
		return responseHeaders;
*/
		return response.headers;
	};

	/**
	 * @visible for testing
	 * Process an http request that contains an enclosed entity.
	 * @param Google_HttpRequest request
	 * @return Google_HttpRequest Processed request with the enclosed entity.
	 */
/*	TODO:
	processEntityRequest : function (Google_HttpRequest request) {
		postBody = request.getPostBody();
		contentType = request.getRequestHeader("content-type");

		// Set the default content-type as application/x-www-form-urlencoded.
		if (false == contentType) {
			contentType = this.FORM_URLENCODED;
			request.setRequestHeaders(array('content-type' => contentType));
		}

		// Force the payload to match the content-type asserted in the header.
		if (contentType == this.FORM_URLENCODED && is_array(postBody)) {
			postBody = http_build_query(postBody, '', '&');
			request.setPostBody(postBody);
		}

		// Make sure the content-length header is set.
		if (!postBody || is_string(postBody)) {
			postsLength = strlen(postBody);
			request.setRequestHeaders(array('content-length' => postsLength));
		}

		return request;
	},

*/	
	/**
	 * Set options that update cURL's default behavior.
	 * The list of accepted options are:
	 * {@link http://php.net/manual/en/function.curl-setopt.php]
	 *
	 * @param array optCurlParams Multiple options used by a cURL session.
	setOptions : function (optParams) {
		for(var key in optParams) {
			this.curlParams[key] = optParams[key];
		}
	}
}
	 */

module.exports = Google_HttpIO;
