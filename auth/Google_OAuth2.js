/*
 * Copyright 2008 Google Inc.
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

/*	TODO: Google_Verifier + Google_PemVerifier	
require_once "Google_Verifier.php";
*/
/*	TODO: Google_LoginTicket (used for PemVerifier)
require_once "Google_LoginTicket.php";
*/
var Google_Utils = require("../service/Google_Utils");
var Google_HttpRequest = require("../io/Google_HttpRequest");

/**
 * Authentication class that deals with the OAuth 2 web-server authentication flow
 *
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 *
 */
var Google_OAuth2 = function (apiConfig) {//extends Google_Auth {
  /**
   * Instantiates the class, but does not initiate the login flow, leaving it
   * to the discretion of the caller (which is done by calling authenticate()).
   */
		this.client		= apiConfig.client;
		this.assertion;
		this.clientId		= apiConfig.clientId,
		this.clientSecret	= apiConfig.clientSecret,
		this.developerKey	= apiConfig.developerKey,
		this.token		= apiConfig.token,
		this.redirectUri	= apiConfig.redirectUri,
		this.state		= apiConfig.state,
		this.accessType 	= typeof apiConfig.accessType !== 'undefined'  ? apiConfig.accessType : 'offline',
		approvalPrompt	= typeof(apiConfig.approvalPrompt) !== 'undefined'  ? apiConfig.approvalPrompt: 'force';

  /** @var Google_AssertionCredentials assertionCredentials */

	this.OAUTH2_REVOKE_URI = 'https://accounts.google.com/o/oauth2/revoke';
	this.OAUTH2_TOKEN_URI = 'https://accounts.google.com/o/oauth2/token';
	this.OAUTH2_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
	this.OAUTH2_FEDERATED_SIGNON_CERTS_URL = 'https://www.googleapis.com/oauth2/v1/certs';
	this.CLOCK_SKEW_SECS = 300; // five minutes in seconds
	this.AUTH_TOKEN_LIFETIME_SECS = 300; // five minutes in seconds
	this.MAX_TOKEN_LIFETIME_SECS = 86400; // one day in seconds

};

Google_OAuth2.prototype	=	{




	setClient : function(client){
		this.client = client;
	},
  /**
   * @param service
   * @param string|null code
   * @throws Google_AuthException
   * @return string
	 */
	authenticate : function (service, code ) {
		if (!code && isset(_GET['code'])) {
			code = _GET['code'];
		}

		if (code) {
			// We got here from the redirect from a successful authorization grant, fetch the access token
			request = this.client.io.makeRequest(new Google_HttpRequest(this.OAUTH2_TOKEN_URI, 'POST', {}, {
					'code' : code,
					'grant_type' : 'authorization_code',
					'redirect_uri' : this.redirectUri,
					'client_id' : this.clientId,
					'client_secret' : this.clientSecret
			}));

			if (request.getResponseHttpCode() == 200) {
				this.setAccessToken(request.getResponseBody());
				var d1 = new Date();
				var now = Math.floor(d1.getTime()/1000);
				this.token.created = now;
				return this.getAccessToken();
			} else {
				response = request.getResponseBody();
				decodedResponse = JSON.parse(response);
				if (decodedResponse != null && decodedResponse.error) {
					response = decodedResponse.error;
				}
				throw new Google_AuthException("Error fetching OAuth2 access token, message: 'response'", request.getResponseHttpCode());
			}
		}

		authUrl = this.createAuthUrl(service.scope);
/*	TODO: header redirect equivalent in node	*/
		header('Location: ' + authUrl);
		return true;
	} ,

	/**
	 * Create a URL to obtain user authorization.
	 * The authorization endpoint allows the user to first
	 * authenticate, and then grant/deny the access request.
	 * @param string scope The scope is expressed as a list of space-delimited strings.
	 * @return string
	 */
	createAuthUrl : function (scope) {
		var params = new Array(
				'response_type=code',
				'redirect_uri=' . encodeURIComponent(this.redirectUri),
				'client_id=' . encodeURIComponent(this.clientId),
				'scope=' . encodeURIComponent(this.scope),
				'access_type=' . encodeURIComponent(this.accessType),
				'approval_prompt=' . encodeURIComponent(this.approvalPrompt)
			);

		if (typeof this.state !== 'undefined') {
			params.push('state=' + encodeURIComponent(this.state));
		}
		params = params.join('&');
		return this.OAUTH2_AUTH_URL+"?"+params;
	},

	/**
	 * @param string token
	 * @throws Google_AuthException
	 */
	setAccessToken : function (token) {
		token = JSON.parse(token);
		if (typeof token == 'undefined') {
			throw new Google_AuthException('Could not json decode the token');
		}
		if (typeof token.access_token == 'undefined') {
			throw new Google_AuthException("Invalid token format");
		}
		this.token = token;
	},

	getAccessToken : function () {
		return JSON.stringify(this.token);
	},

	setDeveloperKey : function (developerKey) {
		this.developerKey = developerKey;
	},

	setState : function (state) {
		this.state = state;
	},

	setAccessType : function (accessType) {
		this.accessType = accessType;
	},

	setApprovalPrompt : function (approvalPrompt) {
		this.approvalPrompt = approvalPrompt;
	},

	setAssertionCredentials : function (/*Google_AssertionCredentials*/ creds,assertion) {
		this.assertionCredentials = creds;
		this.assertion = assertion;
	},

	/**
	 * Include an accessToken in a given apiHttpRequest.
	 * @param Google_HttpRequest request
	 * @return Google_HttpRequest
	 * @throws Google_AuthException
	 */
	sign : function (/*Google_HttpRequest*/ request,callback) {
		// add the developer key to the request before signing it
		if (this.developerKey) {
			requestUrl = request.getUrl();
			requestUrl += (request.getUrl().indexOf('?') == -1) ? '?' : '&';
			requestUrl +=	'key=' . encodeURIComponent(this.developerKey);
			request.setUrl(requestUrl);
		}

		// Cannot sign the request without an OAuth access token.
		if (typeof this.token == 'undefined' && typeof this.assertionCredentials == 'undefined') {
			return request;
		}

		// Check if the token is set to expire in the next 30 seconds
		// (or has already expired).
		if (this.isAccessTokenExpired()) {
			if (this.assertionCredentials) {
				this.refreshTokenWithAssertion(this.assertionCredentials,
					function(response/*?*/){
						 request.setRequestHeaders(
							{'Authorization' : 'Bearer ' + this.token.access_token}
						);
						callback(request);
				});
			} else {
				if ( typeof this.token.refresh_token == 'undefined') {
				//		throw new Google_AuthException("The OAuth 2.0 access token has expired, "
				//				. "and a refresh token is not available. Refresh tokens are not "
				//				. "returned for responses that were auto-approved.");
				}
				this.refreshToken(this.token.refresh_token);
			}
		}else{
	
				 request.setRequestHeaders(
					{'Authorization' : 'Bearer ' + this.token.access_token}
				);
				callback(request);

		}

		// Add the OAuth2 header to the request

		//return request;
	},

	/**
	 * Fetches a fresh access token with the given refresh token.
	 * @param string refreshToken
	 * @return void
	 */
	refreshToken : function (refreshToken) {
		this.refreshTokenRequest({
				'client_id' : this.clientId,
				'client_secret' : this.clientSecret,
				'refresh_token' : refreshToken,
				'grant_type' : 'refresh_token'
		});
	},

	/**
	 * Fetches a fresh access token with a given assertion token.
	 * @param Google_AssertionCredentials assertionCredentials optional.
	 * @return void
	 */
	refreshTokenWithAssertion : function (assertionCredentials,callback) {

		if (typeof assertionCredentials !== 'undefined') {
			assertionCredentials = this.assertionCredentials;
		}
		G_this = this;
		this.assertionCredentials.generateAssertion(function(assertion){

		if (typeof this.assertionCredentials !== 'undefined') {
			this.assertionCredentials = assertionCredentials = this.auth;
		}

			G_this.refreshTokenRequest({
					'grant_type' :	'assertion',
					'assertion_type' :	assertionCredentials.assertionType,
					'assertion' : assertion
			},callback);
		});
	},

	refreshTokenRequest : function (params,callback) {
		http = new Google_HttpRequest(this.OAUTH2_TOKEN_URI, 'POST', {}, params);
		me = this;
		this.client.io.makeRequest(http,function(request){
			code = request.getResponseHttpCode();//request.response.statusCode;
			body = request.getResponseBody();//request.response.body;
			if (200 == code) {
				token = JSON.parse(body);
				if (token == null) {
					throw new Google_AuthException("Could not json decode the access token");
				}
				if ( typeof token.access_token == 'undefined' || typeof token.expires_in == 'undefined') {
					throw new Google_AuthException("Invalid token format");
				}

				if(typeof me.token == 'undefined')
					me.token = {};
				me.token.access_token = token.access_token;
				me.token.expires_in = token.expires_in;
				var d1 = new Date();
				var now = Math.floor(d1.getTime()/1000);
				me.token.created = now;
				callback(request);
			} else {
				throw new Google_AuthException("Error refreshing the OAuth2 token, message: 'body'", code);
			}
		});
	},

		/**
		 * Revoke an OAuth2 access token or refresh token. This method will revoke the current access
		 * token, if a token isn't provided.
		 * @throws Google_AuthException
		 * @param string|null token The token (access token or a refresh token) that should be revoked.
		 * @return boolean Returns True if the revocation was successful, otherwise False.
		 */
	revokeToken : function (token) {
		if (typeof token == 'undefined') {
			token = this.token.access_token;
		}
		request = new Google_HttpRequest(this.OAUTH2_REVOKE_URI, 'POST', {}, "token=token");
		response = Google_Client.io.makeRequest(request);//static
		code = response.getResponseHttpCode();
		if (code == 200) {
			this.token = null;
			return true;
		}

		return false;
	},

	/**
	 * Returns if the access_token is expired.
	 * @return bool Returns True if the access_token is expired.
	 */
	isAccessTokenExpired : function () {
		if (typeof this.token == 'undefined') {
			return true;
		}

		// If the token is set to expire in the next 30 seconds.
		var d1 = new Date();
		var now = Math.floor(d1.getTime()/1000);
		expired = (this.token.created
				+ (this.token.expires_in - 30)) < now ;

		return expired;
	},

	// Gets federated sign-on certificates to use for verifying identity tokens.
	// Returns certs as array structure, where keys are key ids, and values
	// are PEM encoded certificates.
/*	TODO: getFederatedSignOnCerts	
	private function getFederatedSignOnCerts() {
		// This relies on makeRequest caching certificate responses.
		request = Google_Client::io->makeRequest(new Google_HttpRequest(
				self::OAUTH2_FEDERATED_SIGNON_CERTS_URL));
		if (request->getResponseHttpCode() == 200) {
			certs = json_decode(request->getResponseBody(), true);
			if (certs) {
				return certs;
			}
		}
		throw new Google_AuthException(
				"Failed to retrieve verification certificates: '" .
						request->getResponseBody() . "'.",
				request->getResponseHttpCode());
	}
*/

	/**
	 * Verifies an id token and returns the authenticated apiLoginTicket.
	 * Throws an exception if the id token is not valid.
	 * The audience parameter can be used to control which id tokens are
	 * accepted.	By default, the id token must have been issued to this OAuth2 client.
	 *
	 * @param id_token
	 * @param audience
	 * @return Google_LoginTicket
	 */
/*	TODO: verifyIdToken 
	verifyIdToken : function (id_token , audience  ) {
		if (typeof id_token == 'undefined') {
			id_token = this.token.id_token;
		}

		certs = this.getFederatedSignonCerts();
		if (!audience) {
			audience = this.clientId;
		}
		return this.verifySignedJwtWithCerts(id_token, certs, audience);
	}
*/

	// Verifies the id token, returns the verified token contents.
	// Visible for testing.
/*	TODO: verifySignedJwtWithCerts
	function verifySignedJwtWithCerts(jwt, certs, required_audience) {
		segments = explode(".", jwt);
		if (count(segments) != 3) {
			throw new Google_AuthException("Wrong number of segments in token: jwt");
		}
		signed = segments[0] . "." . segments[1];
		signature = Google_Utils::urlSafeB64Decode(segments[2]);

		// Parse envelope.
		envelope = json_decode(Google_Utils::urlSafeB64Decode(segments[0]), true);
		if (!envelope) {
			throw new Google_AuthException("Can't parse token envelope: " . segments[0]);
		}

		// Parse token
		json_body = Google_Utils::urlSafeB64Decode(segments[1]);
		payload = json_decode(json_body, true);
		if (!payload) {
			throw new Google_AuthException("Can't parse token payload: " . segments[1]);
		}

		// Check signature
		verified = false;
		foreach (certs as keyName => pem) {
			public_key = new Google_PemVerifier(pem);
			if (public_key->verify(signed, signature)) {
				verified = true;
				break;
			}
		}

		if (!verified) {
			throw new Google_AuthException("Invalid token signature: jwt");
		}

		// Check issued-at timestamp
		iat = 0;
		if (array_key_exists("iat", payload)) {
			iat = payload["iat"];
		}
		if (!iat) {
			throw new Google_AuthException("No issue time in token: json_body");
		}
		earliest = iat - self::CLOCK_SKEW_SECS;

		// Check expiration timestamp
		now = time();
		exp = 0;
		if (array_key_exists("exp", payload)) {
			exp = payload["exp"];
		}
		if (!exp) {
			throw new Google_AuthException("No expiration time in token: json_body");
		}
		if (exp >= now + self::MAX_TOKEN_LIFETIME_SECS) {
			throw new Google_AuthException(
					"Expiration time too far in future: json_body");
		}

		latest = exp + self::CLOCK_SKEW_SECS;
		if (now < earliest) {
			throw new Google_AuthException(
					"Token used too early, now < earliest: json_body");
		}
		if (now > latest) {
			throw new Google_AuthException(
					"Token used too late, now > latest: json_body");
		}

		// TODO(beaton): check issuer field?

		// Check audience
		aud = payload["aud"];
		if (aud != required_audience) {
			throw new Google_AuthException("Wrong recipient, aud != required_audience: json_body");
		}

    // All good.
		return new Google_LoginTicket(envelope, payload);
	}
	*/
};

module.exports = Google_OAuth2;
