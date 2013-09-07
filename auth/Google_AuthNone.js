/*
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Do-nothing authentication implementation, use this if you want to make un-authenticated calls
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 */
//requires global apitConfig
var Google_Auth = require("./Google_Auth");
var apiConfig;
var Google_AuthNone = Google_Auth.extend({
 	key : null,
	__init: function(){
		if (!typeof (apiConfig['developer_key']) != 'undefined') {
			this.setDeveloperKey(apiConfig['developer_key']);
		}
	  },
	setDeveloperKey	:	function(key){
		this.key = key;
	},
	setAccessToken	:	function(accessToken){},
	getAccessToken	:	function(){
		return null;
	},
	authenticate	:	function(service){},
	createAuthUrl	:	function(scope){
		return null;
	},
	refreshToken	:	function(refreshToken){},
	revokeToken	:	function(){},
	sign		:	function(request){
		if(this.key != null){
			request.setUrl(request.getUrl + ((request.getUrl().indexOf('?')===-1) ? '?' : '&')+"key="+encodeURI(this.key);
		}
		return request;
	}
});

module.exports.Google_AuthNone  =	Google_AuthNone; 
