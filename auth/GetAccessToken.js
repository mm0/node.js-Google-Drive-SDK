var Google_AssertionCredentials = require('./Google_AssertionCredentials'),
	exec = require('child_process').exec;


var scopes = new Array("https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/drive",
"https://www.googleapis.com/auth/userinfo.email",
"https://www.googleapis.com/auth/userinfo.profile",
"https://docs.googleusercontent.com/",
"https://docs.google.com/feeds/");


var options = {
      serviceAccountName:       '389552467993-gqsl9ihfrfagc48rkvedgk875gt7fvke@developer.gserviceaccount.com',
      scopes            :       scopes,
      privateKey        :       './pkey.pem',
      privateKeyPassword:       'notasecret',
      assertionType     :       'http://oauth.net/grant_type/jwt/1.0/bearer',
        prn             :       false
        };
test = new Google_AssertionCredentials(options);
test.generateAssertion(function(a){
        exec('curl -d "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+a+'" https://accounts.google.com/o/oauth2/token',function(err,stdout,stderr){
                var response = JSON.parse(stdout);
                console.log(response.access_token);
        });
});
