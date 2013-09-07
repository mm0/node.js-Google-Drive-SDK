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

//var Google_AuthNone = require("./auth/Google_AuthNone");
/*	TODO: OAUTH

require_once "Google_OAuth2.php";
*/
/**
 * Abstract class for the Authentication in the API client
 * @author Chris Chabot <chabotc@google.com>
 *
 */

var Google_Auth 	= function(){};
Google_Auth.prototype =  {
	authenticate	: function(service){},
	sign		: function(request){},
	createAuthUrl	: function(scope){},
	getAccessToken	: function(){},
	setAccessToken	: function(accessToken){},
	setDeveloperKey	: function(developerKey){},
	refreshToken	: function(refreshToken){},
	revokeToken	: function(){},
	
};

module.exports.Google_Auth  =       Google_Auth;

