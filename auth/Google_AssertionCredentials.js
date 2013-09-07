/*
 * Copyright 2012 Google Inc.
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
 * Credentials object used for OAuth 2.0 Signed JWT assertion grants.
 *
 * @author Chirag Shah <chirags@google.com>
 */

var Google_P12Signer = require("./Google_P12Signer.js"),
	Google_Utils = require("./../service/Google_Utils.js");
/**
var options = {
      serviceAccountName:	'',
      scopes		:	'', array List of scopes
      privateKey	:	'',
      privateKeyPassword: 'notasecret',
      assertionType	: 'http://oauth.net/grant_type/jwt/1.0/bearer',
      prn		: false bool|string $prn The email address of the user for which the
				 application is requesting delegated access (DOESN'T WORK, returns invalid_request, not necessary)
	}
   */
var Google_AssertionCredentials = function(options){
	this.MAX_TOKEN_LIFETIME_SECS = 3600;

	this.serviceAccountName	= options.serviceAccountName;
	this.scopes			= typeof (options.scopes) == "string"  ? options.scopes : options.scopes.join(" ");
	this.privateKey		= options.privateKey;
	this.privateKeyPassword	= options.privateKeyPassword;
	this.assertionType		= options.assertionType;
	this.prn			= options.prn;

}
Google_AssertionCredentials.prototype = {

	generateAssertion		:	function (callback) {
var d1 = new Date();
 d1.toUTCString();

var d2 = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
var now = Math.floor(d1.getTime()/ 1000)
		var jwtParams = {
	/* TODO OAuth2	*/
			'aud' : 'https://accounts.google.com/o/oauth2/token',//Google_OAuth2::OAUTH2_TOKEN_URI,
			'scope' : this.scopes,
			'iat' : now,
			'exp' : now + this.MAX_TOKEN_LIFETIME_SECS,
			'iss' : this.serviceAccountName,
		};

		if (this.prn !== false) {
			jwtParams.prn = this.prn;
		}

		this.makeSignedJwt(jwtParams,callback);
	},

	/**
	* Creates a signed JWT.
	* @param array $payload
	* @return string The signed JWT.
	*/
	makeSignedJwt	:	function (payload,callback) {
		var header = {'typ' : 'JWT', 'alg' : 'RS256'};

		var segments = new Array(
			Google_Utils.urlSafeB64Encode(JSON.stringify(header)),
			Google_Utils.urlSafeB64Encode(JSON.stringify(payload).replace(/\//g,"\\/"))
		);

		signingInput = segments.join('.');
		signer = new Google_P12Signer(this.privateKey, this.privateKeyPassword);
		signer.sign(signingInput, function(signature){
			var b64 = signature
			b64 = b64.replace(/\+/g,"-");
			b64 = b64.replace(/\//g,"_");
			b64 = b64.replace(/(\r\n|\n|\r|=)/gm,'');
			var jwt = b64;
			segments.push(jwt);
			var jwt = segments.join('.');
			callback(jwt);
		});
	}
}

module.exports = Google_AssertionCredentials;

