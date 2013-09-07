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

// Check for the required json and curl extensions, the Google APIs PHP Client
// won't function without them.




var array_merge = require('./helpers/array_merge');

var config = require("./config"),
	Google_AssertionCredentials = require('./auth/Google_AssertionCredentials'),
	Google_Signer		=	require('./auth/Google_Signer'),
	Google_P12Signer	=	require('./auth/Google_P12Signer'),
	//Google_IO		=	require('./io/Google_IO'),
	Google_Auth		=	require('./auth/Google_Auth'),
	util 			= 	require("util");


// If a local configuration file is found, merge it's values with the default configuration
/*
	TODO: local_config

if (file_exists(dirname(__FILE__)	. '/local_config.php')) {
	defaultConfig = apiConfig;
	require_once (dirname(__FILE__)	. '/local_config.php');
	apiConfig = array_merge(defaultConfig, apiConfig);
}
*/

/*
	TODO:	the rest of these::

// Include the top level classes, they each include their own dependencies
require_once 'service/Google_Model.php';
require_once 'service/Google_BatchRequest.php';
require_once 'cache/Google_Cache.php';
require_once('service/Google_MediaFileUpload.php');
*/

/**
 * The Google API Client
 * http://code.google.com/p/google-api-php-client/
 *
 * @author Chris Chabot <chabotc@google.com>
 * @author Chirag Shah <chirags@google.com>
 */
var Google_Client = function(options){
	/**
	 * @static
	 * @var Google_Auth auth
	 */
	//var a = config.authClass;
	this.auth	=	require(config.authClass);//new a(),
	this.auth	=	new this.auth(config);
		/* apiConfig	*/
	this.apiConfig = config,
	/**
	 * @static
	 * @var Google_IO io
	 */
	this.io	=	require(config.ioClass);//new a(),
	this.io =	new this.io(config);
	/**
	 * @static
	 * @var Google_Cache cache
	 */
		//cache	=	new config.cacheClass(),
	/**
	 * @static
	 * @var boolean useBatch
	 */
	this.useBatch = false,
	/** @var array scopes */
	this.scopes = [],
	/** @var bool useObjects */
	this.useObjects = false;
	// definitions of services that are discovered.
	this.services = [];

	// Used to track authenticated state, can't discover services after doing authenticate()
	this.authenticated = false;

		//global apiConfig;
		//apiConfig = array_merge(apiConfig, config);
	};

Google_Client.prototype	=	{

	/**
	 * Add a service
	 */
	addService : function (service, version ) {
		//global apiConfig;
		if (this.authenticated) {
			throw new Google_Exception('Cant add services after having authenticated');
		}
		this.services[service] = {}
		if (typeof this.apiConfig.services[service] == 'undefined') {
			// Merge the service descriptor with the default values
			this.services[service] = array_merge(this.services[service], this.apiConfig.services[service]);
		}
	},

	authenticate : function (code) {
		if (arguments.length) code = null;
		service = this.prepareService();
		this.authenticated = true;
		return this.auth.authenticate(service, code);
	},

	/**
	 * @return array
	 * @visible For Testing
	 */
	prepareService : function () {
		service = array();
		scopes = array();
		if (this.scopes) {
			scopes = this.scopes;
		} else {
			for(var key in this.services ) {
				if (isset(this.services[key]['scope'])) {
					if (typeof this.services[key]['scope'] == 'array') {
						scopes = array_merge(this.services[key]['scope'], scopes);
					} else {
						scopes.push(this.services[key]['scope']);
					}
				} else {
					scopes.push('https://www.googleapis.com/auth/' . key);
				}
				this.services[key]['discoveryURI']	=	null;
				this.services[key]['scope']	=	null;
				service = array_merge(service, this.services[key]);
			}
		}
		service['scope'] = scopes.join(" ");
		return service;
	},

	/**
	 * Set the OAuth 2.0 access token using the string that resulted from calling authenticate()
	 * or Google_Client#getAccessToken().
	 * @param string accessToken JSON encoded string containing in the following format:
	 * {"access_token":"TOKEN", "refresh_token":"TOKEN", "token_type":"Bearer",
	 *	"expires_in":3600, "id_token":"TOKEN", "created":1320790426}
	 */
	setAccessToken : function (accessToken) {
		if (typeof accessToken == 'undefined'|| 'null' == accessToken) {
			accessToken = null;
		}
		this.auth.setAccessToken(accessToken);
	},

	/**
	 * Set the type of Auth class the client should use.
	 * @param string authClassName
	 */
	setAuthClass : function (authClassName) {
		this.auth = new authClassName();
	},

	/**
	 * Construct the OAuth 2.0 authorization request URI.
	 * @return string
	 */
	createAuthUrl : function () {
		service = this.prepareService();
		return this.auth.createAuthUrl(service.scope);
	},

	/**
	 * Get the OAuth 2.0 access token.
	 * @return string accessToken JSON encoded string in the following format:
	 * {"access_token":"TOKEN", "refresh_token":"TOKEN", "token_type":"Bearer",
	 *	"expires_in":3600,"id_token":"TOKEN", "created":1320790426}
	 */
	getAccessToken : function () {
		token = this.auth.getAccessToken();
		return (typeof  token == 'undefined' || null == token) ? null : token;
	},

	/**
	 * Returns if the access_token is expired.
	 * @return bool Returns True if the access_token is expired.
	 */
	isAccessTokenExpired : function () {
		return this.auth.isAccessTokenExpired();
	},

	/**
	 * Set the developer key to use, these are obtained through the API Console.
	 * @see http://code.google.com/apis/console-help/#generatingdevkeys
	 * @param string developerKey
	 */
	setDeveloperKey : function (developerKey) {
		this.auth.setDeveloperKey(developerKey);
	},

	/**
	 * Set OAuth 2.0 "state" parameter to achieve per-request customization.
	 * @see http://tools.ietf.org/html/draft-ietf-oauth-v2-22#section-3.1.2.2
	 * @param string state
	 */
	setState : function (state) {
		this.auth.setState(state);
	},

	/**
	 * @param string accessType Possible values for access_type include:
	 *	{@code "offline"} to request offline access from the user. (This is the default value)
	 *	{@code "online"} to request online access from the user.
	 */
	setAccessType : function (accessType) {
		this.auth.setAccessType(accessType);
	},

	/**
	 * @param string approvalPrompt Possible values for approval_prompt include:
	 *	{@code "force"} to force the approval UI to appear. (This is the default value)
	 *	{@code "auto"} to request auto-approval when possible.
	 */
	setApprovalPrompt : function (approvalPrompt) {
		this.auth.setApprovalPrompt(approvalPrompt);
	},

	/**
	 * Set the application name, this is included in the User-Agent HTTP header.
	 * @param string applicationName
	 */
	setApplicationName : function (applicationName) {
		this.apiConfig.application_name = applicationName;
	},

	/**
	 * Set the OAuth 2.0 Client ID.
	 * @param string clientId
	 */
	setClientId : function (clientId) {
		this.apiConfig.oauth2_client_id = clientId;
		this.auth.clientId = clientId;
	},

	/**
	 * Get the OAuth 2.0 Client ID.
	 */
	getClientId : function () {
		return this.auth.clientId;
	},
	
	/**
	 * Set the OAuth 2.0 Client Secret.
	 * @param string clientSecret
	 */
	setClientSecret : function (clientSecret) {
		this.apiConfig.oauth2_client_secret = clientSecret;
		this.auth.clientSecret = clientSecret;
	},

	/**
	 * Get the OAuth 2.0 Client Secret.
	 */
	getClientSecret : function () {
		return this.auth.clientSecret;
	},

	/**
	 * Set the OAuth 2.0 Redirect URI.
	 * @param string redirectUri
	 */
	setRedirectUri : function (redirectUri) {
		this.apiConfig.oauth2_redirect_uri = redirectUri;
		this.auth.redirectUri = redirectUri;
	},

	/**
	 * Get the OAuth 2.0 Redirect URI.
	 */
	getRedirectUri : function () {
		return this.auth.redirectUri;
	},

	/**
	 * Fetches a fresh OAuth 2.0 access token with the given refresh token.
	 * @param string refreshToken
	 * @return void
	 */
	refreshToken : function (refreshToken) {
		this.auth.refreshToken(refreshToken);
	},

	/**
	 * Revoke an OAuth2 access token or refresh token. This method will revoke the current access
	 * token, if a token isn't provided.
	 * @throws Google_AuthException
	 * @param string|null token The token (access token or a refresh token) that should be revoked.
	 * @return boolean Returns True if the revocation was successful, otherwise False.
	 */
	revokeToken : function (token) {
		this.auth.revokeToken(token);
	},

	/**
	 * Verify an id_token. This method will verify the current id_token, if one
	 * isn't provided.
	 * @throws Google_AuthException
	 * @param string|null token The token (id_token) that should be verified.
	 * @return Google_LoginTicket Returns an apiLoginTicket if the verification was
	 * successful.
	 */
	verifyIdToken : function (token ) {
		return this.auth.verifyIdToken(token);
	},

	/**
	 * @param Google_AssertionCredentials creds
	 * @return void
	 */
	setAssertionCredentials : function (/*Google_AssertionCredentials*/ creds) {
		this.auth.setAssertionCredentials(creds);
	},
	getAssertionCredentials : function(){
		return this.auth.getAssertionCredentials();
	},	

	/**
	 * This function allows you to overrule the automatically generated scopes,
	 * so that you can ask for more or less permission in the auth flow
	 * Set this before you call authenticate() though!
	 * @param array scopes, ie: array('https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/moderator')
	 */
	setScopes : function (scopes) {
		this.scopes = typeof(scopes) =='string'  ? scopes.split(" ") : scopes;
	},

	/**
	 * Declare if objects should be returned by the api service classes.
	 *
	 * @param boolean useObjects True if objects should be returned by the service classes.
	 * False if associative arrays should be returned (default behavior).
	 * @experimental
	 */
	setUseObjects : function (useObjects) {
		this.apiConfig.use_objects = useObjects;
	},

	/**
	 * Declare if objects should be returned by the api service classes.
	 *
	 * @param boolean useBatch True if the experimental batch support should
	 * be enabled. Defaults to False.
	 * @experimental
	 */
	setUseBatch : function (useBatch) {
		this.useBatch = useBatch;
	},

	/**
	 * @static
	 * @return Google_Auth the implementation of apiAuth.
	 */
	getAuth	:	function () {
		return this.auth;
	},

	/**
	 * @static
	 * @return Google_IO the implementation of apiIo.
	 */
	getIo	:	function () {
		return this.io;
	},

	/**
	 * @return Google_Cache the implementation of apiCache.
	 */
	getCache : function () {
		return this.cache;
	}
};

// Exceptions that the Google PHP API Library can throw
var Exception			=	function(name,code,message){
	this.name = name;
	this.code = code;
	this.message = message;
	var errors = [];
};

Exception.prototype.getErrors = function(){ return this.errors; };
var Google_Exception		=	function(){};
var Google_AuthException		=	function(){};
var Google_CacheException	=	function(){};
var Google_IOException		=	function(){};
var Google_ServiceException	=	function(){};

Exception.prototype.toString = function() {
    var name = this.name || 'unknown';
    var message = this.message || 'no description';
    return '[' + name + '] ' + message;
};

util.inherits(Google_Exception,Exception);
util.inherits(Google_AuthException,Exception);
util.inherits(Google_CacheException,Exception);
util.inherits(Google_IOException,Exception);
util.inherits(Google_ServiceException,Exception);


module.exports = {
	'Google_Exception': Google_Exception,
	'Google_AuthException' : Google_AuthException,
	'Google_IOException' : Google_IOException,
	'Google_ServiceException' : Google_ServiceException,
	'Google_CacheException' : Google_CacheException,
	'Google_Client' : Google_Client
};
//module.exports = 
//	 Google_Client;
