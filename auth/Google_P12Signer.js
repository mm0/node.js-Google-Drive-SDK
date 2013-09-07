/*
 * Copyright 2011 Google Inc.
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
 * Signs data.
 *
 * Only used for testing.
 *
 * @author Brian Eaton <beaton@google.com>
 */

var crypto = require('crypto');
var fs = require('fs');
var exec = require('child_process').exec,
    child;

var Google_P12Signer	= function(p12,passphrase) { //extends Google_Signer {
	this.passphrase = passphrase;
	this.p12file = p12;
}
Google_P12Signer.prototype =  { //extends Google_Signer {
  // OpenSSL private key resource
	privateKey:null,
	sign	:	function(data,callback) {
		p12 = this.p12file
		fs.writeFile('/tmp/p12signer_data',data,function(err){
			//	Native support for digital signing buggy
/* bullshit nodejs doesn't sign correctly
	using comand line openssl http://stackoverflow.com/questions/2699338/phps-openssl-sign-generates-different-signature-than-sscryptos-sign
		var Signer = crypto.createSign('RSA-SHA256');
		Signer.update(data);
		var format = "binary";//default
		var signature = Signer.sign(this.privateKey,format);
*/
		var signature = exec('cat /tmp/p12signer_data |	openssl dgst -sha256 -sign '+p12+" | openssl enc -base64 ", 
			function(err,stdout,stderr){
				callback(stdout);
			});
		});
	}
}
module.exports = Google_P12Signer;
