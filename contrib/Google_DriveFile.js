
var Google_DriveFile = function(fileOptions){
	this.mimeType;
	this.thumbnailLink;
	this.__labelsType = 'Google_DriveFileLabels';
	this.__labelsDataType = '';
	this.labels;
	this.__indexableTextType = 'Google_DriveFileIndexableText';
	this.__indexableTextDataType = '';
	this.indexableText;
	this.explicitlyTrashed;
	this.etag;
	this.lastModifyingUserName;
	this.writersCanShare;
	this.id; 
	this.title;
	this.ownerNames;
	this.sharedWithMeDate;
	this.lastViewedByMeDate;
	this.__parentsType = 'Google_ParentReference';
	this.__parentsDataType = 'array';
	this.parents;
	this.exportLinks;
	this.originalFilename;
	this.description;
	this.webContentLink;
	this.editable;
	this.kind;
	this.quotaBytesUsed;
	this.fileSize;
	this.createdDate;
	this.md5Checksum;
	this.__imageMediaMetadataType = 'Google_DriveFileImageMediaMetadata';
	this.__imageMediaMetadataDataType = '';
	this.imageMediaMetadata;
	this.embedLink;
	this.alternateLink;
	this.modifiedByMeDate;
	this.downloadUrl;
	this.__userPermissionType = 'Google_Permission';
	this.__userPermissionDataType = '';
	this.userPermission;
	this.fileExtension;
	this.selfLink;
	this.modifiedDate;
	for(var i in fileOptions){
		this[i] = fileOptions[i];
	}
};

Google_DriveFile.prototype 	=	{
  setMimeType : function(mimeType) {
	 this.mimeType = mimeType;
  },
  getMimeType : function() {
	 return this.mimeType;
  },
  setThumbnailLink : function(thumbnailLink) {
	 this.thumbnailLink = thumbnailLink;
  },
  getThumbnailLink : function() {
	 return this.thumbnailLink;
  },
  setLabels : function(/*Google_DriveFileLabels*/ labels) {
	 this.labels = labels;
  },
  getLabels : function() {
	 return this.labels;
  },
  setIndexableText : function(/*Google_DriveFileIndexableText*/ indexableText) {
	 this.indexableText = indexableText;
  },
  getIndexableText : function() {
	 return this.indexableText;
  },
  setExplicitlyTrashed : function(explicitlyTrashed) {
	 this.explicitlyTrashed = explicitlyTrashed;
  },
  getExplicitlyTrashed : function() {
	 return this.explicitlyTrashed;
  },
  setEtag : function(etag) {
	 this.etag = etag;
  },
  getEtag : function() {
	 return this.etag;
  },
  setLastModifyingUserName : function(lastModifyingUserName) {
	 this.lastModifyingUserName = lastModifyingUserName;
  },
  getLastModifyingUserName : function() {
	 return this.lastModifyingUserName;
  },
  setWritersCanShare : function(writersCanShare) {
	 this.writersCanShare = writersCanShare;
  },
getWritersCanShare : function() {
	 return this.writersCanShare;
  },
  setId : function(id) {
	 this.id = id;
  },
  getId : function() {
	 return this.id;
  },
  setTitle : function(title) {
	 this.title = title;
  },
  getTitle : function() {
	 return this.title;
  },
  setOwnerNames : function(/* array(Google_string) */ ownerNames) {
	 this.assertIsArray(ownerNames, 'Google_string', __METHOD__);
	 this.ownerNames = ownerNames;
  },
  getOwnerNames : function() {
	 return this.ownerNames;
  },
  setSharedWithMeDate : function(sharedWithMeDate) {
	 this.sharedWithMeDate = sharedWithMeDate;
  },
  getSharedWithMeDate : function() {
	 return this.sharedWithMeDate;
  },
  setLastViewedByMeDate : function(lastViewedByMeDate) {
	 this.lastViewedByMeDate = lastViewedByMeDate;
  },
  getLastViewedByMeDate : function() {
	 return this.lastViewedByMeDate;
  },
  setParents : function(/* array(Google_ParentReference) */ parents) {
	 this.assertIsArray(parents, 'Google_ParentReference', __METHOD__);
	 this.parents = parents;
  },
  getParents : function() {
	 return this.parents;
  },
  setExportLinks : function(exportLinks) {
	 this.exportLinks = exportLinks;
  },
getExportLinks : function() {
	 return this.exportLinks;
  },
  setOriginalFilename : function(originalFilename) {
	 this.originalFilename = originalFilename;
  },
  getOriginalFilename : function() {
	 return this.originalFilename;
  },
  setDescription : function(description) {
	 this.description = description;
  },
  getDescription : function() {
	 return this.description;
  },
  setWebContentLink : function(webContentLink) {
	 this.webContentLink = webContentLink;
  },
  getWebContentLink : function() {
	 return this.webContentLink;
  },
  setEditable : function(editable) {
	 this.editable = editable;
  },
  getEditable : function() {
	 return this.editable;
  },
  setKind : function(kind) {
	 this.kind = kind;
  },
  getKind : function() {
	 return this.kind;
  },
  setQuotaBytesUsed : function(quotaBytesUsed) {
	 this.quotaBytesUsed = quotaBytesUsed;
  },
  getQuotaBytesUsed : function() {
	 return this.quotaBytesUsed;
  },
  setFileSize : function(fileSize) {
	 this.fileSize = fileSize;
  },
  getFileSize : function() {
	 return this.fileSize;
  },
 setCreatedDate : function(createdDate) {
	 this.createdDate = createdDate;
  },
  getCreatedDate : function() {
	 return this.createdDate;
  },
  setMd5Checksum : function(md5Checksum) {
	 this.md5Checksum = md5Checksum;
  },
  getMd5Checksum : function() {
	 return this.md5Checksum;
  },
  setImageMediaMetadata : function(/*Google_DriveFileImageMediaMetadata*/ imageMediaMetadata) {
	 this.imageMediaMetadata = imageMediaMetadata;
  },
  getImageMediaMetadata : function() {
	 return this.imageMediaMetadata;
  },
  setEmbedLink : function(embedLink) {
	 this.embedLink = embedLink;
  },
  getEmbedLink : function() {
	 return this.embedLink;
  },
  setAlternateLink : function(alternateLink) {
	 this.alternateLink = alternateLink;
  },
  getAlternateLink : function() {
	 return this.alternateLink;
  },
  setModifiedByMeDate : function(modifiedByMeDate) {
	 this.modifiedByMeDate = modifiedByMeDate;
  },
  getModifiedByMeDate : function() {
	 return this.modifiedByMeDate;
  },
  setDownloadUrl : function(downloadUrl) {
	 this.downloadUrl = downloadUrl;
  },
  getDownloadUrl : function() {
	 return this.downloadUrl;
  },
  setUserPermission : function(/*Google_Permission*/ userPermission) {
	 this.userPermission = userPermission;
  },
  getUserPermission : function() {
	 return this.userPermission;
  },
  setFileExtension : function(fileExtension) {
	 this.fileExtension = fileExtension;
  },
  getFileExtension : function() {
	 return this.fileExtension;
  },
  setSelfLink : function(selfLink) {
	 this.selfLink = selfLink;
  },
  getSelfLink : function() {
	 return this.selfLink;
  },
  setModifiedDate : function(modifiedDate) {
	 this.modifiedDate = modifiedDate;
  },
  getModifiedDate : function() {
	 return this.modifiedDate;
  }

};


module.exports = Google_DriveFile;
