node.js-Google-Drive-SDK
========================

node.js Google Drive SDK


This project was created as there was a lack of a Google-Drive SDK for use with node.js. The PHP SDK provided by Google was used as a model for this SDK. This was a sizable task as the PHP version was a synchronous and Object-Oriented yet node.js uses an asynchronous programming methodology.


Because node.js's Crypto package (used for encryption, SSL, etc) was incomplete, this project required the use of binary openssl as a workaround for creating secure conntections and payloads back and forth between Google's API.


The Drive SDK is mostly completed and has been left open-source for other programmers to add features related to not just Google Drive but also the wide range of APIs that Google has made available.


This project also makes use of Google's Spreadsheet API as it was originally created for an internal Resource Management project for Prolific Interactive. Rather than simply using an existing SDK from Google for another platform (Ruby, PHP, Java, etc), we saw a place where we could contribute to the open source community and create a node.js version.
