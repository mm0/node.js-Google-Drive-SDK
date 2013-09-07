var Google_Service	=	require('../service/Google_Service');



var Google_DriveService 	=	function(client){
	this.servicePath	=	"drive/v2";
	this.version		=	"v2";
	this.serviceName	=	"drive";
	this.addService(this.serviceName,	this.version);
}
Google_DriveService.prototype	=	{

	addService	:	function(service
} 	



extends Google_Service {
  public $files;
  public $about;
  public $apps;
  public $parents;
  public $revisions;
  public $changes;
  public $children;
  public $permissions;
  /**
   * Constructs the internal representation of the Drive service.
   *
   * @param Google_Client $client
   */
  public function __construct(Google_Client $client) {
    $this->servicePath = 'drive/v2/';
    $this->version = 'v2';
    $this->serviceName = 'drive';

    $client->addService($this->serviceName, $this->version);
    $this->files = new Google_FilesServiceResource($this, $this->serviceName, 'files', json_decode('{"methods": {"insert": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"convert": {"default": "false", "type": "boolean", "location": "query"}, "targetLanguage": {"type": "string", "location": "query"}, "sourceLanguage": {"type": "string", "location": "query"}, "ocrLanguage": {"type": "string", "location": "query"}, "pinned": {"default": "false", "type": "boolean", "location": "query"}, "ocr": {"default": "false", "type": "boolean", "location": "query"}, "timedTextTrackName": {"type": "string", "location": "query"}, "timedTextLanguage": {"type": "string", "location": "query"}}, "supportsMediaUpload": true, "request": {"$ref": "File"}, "mediaUpload": {"maxSize": "10GB", "protocols": {"simple": {"path": "/upload/drive/v2/files", "multipart": true}, "resumable": {"path": "/resumable/upload/drive/v2/files", "multipart": true}}, "accept": ["*/*"]}, "response": {"$ref": "File"}, "httpMethod": "POST", "path": "files", "id": "drive.files.insert"}, "untrash": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.files.untrash", "httpMethod": "POST", "path": "files/{fileId}/untrash", "response": {"$ref": "File"}}, "trash": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.files.trash", "httpMethod": "POST", "path": "files/{fileId}/trash", "response": {"$ref": "File"}}, "get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"updateViewedDate": {"default": "false", "type": "boolean", "location": "query"}, "projection": {"enum": ["BASIC", "FULL"], "type": "string", "location": "query"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.files.get", "httpMethod": "GET", "path": "files/{fileId}", "response": {"$ref": "File"}}, "list": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"q": {"type": "string", "location": "query"}, "pageToken": {"type": "string", "location": "query"}, "projection": {"enum": ["BASIC", "FULL"], "type": "string", "location": "query"}, "maxResults": {"default": "100", "minimum": "0", "type": "integer", "location": "query", "format": "int32"}}, "response": {"$ref": "FileList"}, "httpMethod": "GET", "path": "files", "id": "drive.files.list"}, "update": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"convert": {"default": "false", "type": "boolean", "location": "query"}, "ocr": {"default": "false", "type": "boolean", "location": "query"}, "setModifiedDate": {"default": "false", "type": "boolean", "location": "query"}, "updateViewedDate": {"default": "true", "type": "boolean", "location": "query"}, "sourceLanguage": {"type": "string", "location": "query"}, "ocrLanguage": {"type": "string", "location": "query"}, "pinned": {"default": "false", "type": "boolean", "location": "query"}, "newRevision": {"default": "true", "type": "boolean", "location": "query"}, "targetLanguage": {"type": "string", "location": "query"}, "timedTextLanguage": {"type": "string", "location": "query"}, "timedTextTrackName": {"type": "string", "location": "query"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "supportsMediaUpload": true, "request": {"$ref": "File"}, "mediaUpload": {"maxSize": "10GB", "protocols": {"simple": {"path": "/upload/drive/v2/files/{fileId}", "multipart": true}, "resumable": {"path": "/resumable/upload/drive/v2/files/{fileId}", "multipart": true}}, "accept": ["*/*"]}, "response": {"$ref": "File"}, "httpMethod": "PUT", "path": "files/{fileId}", "id": "drive.files.update"}, "patch": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"convert": {"default": "false", "type": "boolean", "location": "query"}, "ocr": {"default": "false", "type": "boolean", "location": "query"}, "setModifiedDate": {"default": "false", "type": "boolean", "location": "query"}, "updateViewedDate": {"default": "true", "type": "boolean", "location": "query"}, "sourceLanguage": {"type": "string", "location": "query"}, "ocrLanguage": {"type": "string", "location": "query"}, "pinned": {"default": "false", "type": "boolean", "location": "query"}, "newRevision": {"default": "true", "type": "boolean", "location": "query"}, "targetLanguage": {"type": "string", "location": "query"}, "timedTextLanguage": {"type": "string", "location": "query"}, "timedTextTrackName": {"type": "string", "location": "query"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "File"}, "response": {"$ref": "File"}, "httpMethod": "PATCH", "path": "files/{fileId}", "id": "drive.files.patch"}, "touch": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.files.touch", "httpMethod": "POST", "path": "files/{fileId}/touch", "response": {"$ref": "File"}}, "copy": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"convert": {"default": "false", "type": "boolean", "location": "query"}, "ocr": {"default": "false", "type": "boolean", "location": "query"}, "sourceLanguage": {"type": "string", "location": "query"}, "ocrLanguage": {"type": "string", "location": "query"}, "pinned": {"default": "false", "type": "boolean", "location": "query"}, "targetLanguage": {"type": "string", "location": "query"}, "timedTextLanguage": {"type": "string", "location": "query"}, "timedTextTrackName": {"type": "string", "location": "query"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "File"}, "response": {"$ref": "File"}, "httpMethod": "POST", "path": "files/{fileId}/copy", "id": "drive.files.copy"}, "delete": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "path": "files/{fileId}", "id": "drive.files.delete", "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "httpMethod": "DELETE"}}}', true));
    $this->about = new Google_AboutServiceResource($this, $this->serviceName, 'about', json_decode('{"methods": {"get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"includeSubscribed": {"default": "true", "type": "boolean", "location": "query"}, "maxChangeIdCount": {"default": "1", "type": "string", "location": "query", "format": "int64"}, "startChangeId": {"type": "string", "location": "query", "format": "int64"}}, "response": {"$ref": "About"}, "httpMethod": "GET", "path": "about", "id": "drive.about.get"}}}', true));
    $this->apps = new Google_AppsServiceResource($this, $this->serviceName, 'apps', json_decode('{"methods": {"list": {"scopes": ["https://www.googleapis.com/auth/drive.apps.readonly"], "path": "apps", "response": {"$ref": "AppList"}, "id": "drive.apps.list", "httpMethod": "GET"}, "get": {"scopes": ["https://www.googleapis.com/auth/drive.apps.readonly"], "parameters": {"appId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.apps.get", "httpMethod": "GET", "path": "apps/{appId}", "response": {"$ref": "App"}}}}', true));
    $this->parents = new Google_ParentsServiceResource($this, $this->serviceName, 'parents', json_decode('{"methods": {"insert": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "ParentReference"}, "response": {"$ref": "ParentReference"}, "httpMethod": "POST", "path": "files/{fileId}/parents", "id": "drive.parents.insert"}, "get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"parentId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.parents.get", "httpMethod": "GET", "path": "files/{fileId}/parents/{parentId}", "response": {"$ref": "ParentReference"}}, "list": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.parents.list", "httpMethod": "GET", "path": "files/{fileId}/parents", "response": {"$ref": "ParentList"}}, "delete": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "path": "files/{fileId}/parents/{parentId}", "id": "drive.parents.delete", "parameters": {"parentId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "httpMethod": "DELETE"}}}', true));
    $this->revisions = new Google_RevisionsServiceResource($this, $this->serviceName, 'revisions', json_decode('{"methods": {"patch": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"revisionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "Revision"}, "response": {"$ref": "Revision"}, "httpMethod": "PATCH", "path": "files/{fileId}/revisions/{revisionId}", "id": "drive.revisions.patch"}, "get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"revisionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.revisions.get", "httpMethod": "GET", "path": "files/{fileId}/revisions/{revisionId}", "response": {"$ref": "Revision"}}, "list": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.revisions.list", "httpMethod": "GET", "path": "files/{fileId}/revisions", "response": {"$ref": "RevisionList"}}, "update": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"revisionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "Revision"}, "response": {"$ref": "Revision"}, "httpMethod": "PUT", "path": "files/{fileId}/revisions/{revisionId}", "id": "drive.revisions.update"}, "delete": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "path": "files/{fileId}/revisions/{revisionId}", "id": "drive.revisions.delete", "parameters": {"revisionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "httpMethod": "DELETE"}}}', true));
    $this->changes = new Google_ChangesServiceResource($this, $this->serviceName, 'changes', json_decode('{"methods": {"list": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"includeSubscribed": {"default": "true", "type": "boolean", "location": "query"}, "startChangeId": {"type": "string", "location": "query", "format": "int64"}, "includeDeleted": {"default": "true", "type": "boolean", "location": "query"}, "maxResults": {"default": "100", "minimum": "0", "type": "integer", "location": "query", "format": "int32"}, "pageToken": {"type": "string", "location": "query"}}, "response": {"$ref": "ChangeList"}, "httpMethod": "GET", "path": "changes", "id": "drive.changes.list"}, "get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"changeId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.changes.get", "httpMethod": "GET", "path": "changes/{changeId}", "response": {"$ref": "Change"}}}}', true));
    $this->children = new Google_ChildrenServiceResource($this, $this->serviceName, 'children', json_decode('{"methods": {"insert": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"folderId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "ChildReference"}, "response": {"$ref": "ChildReference"}, "httpMethod": "POST", "path": "files/{folderId}/children", "id": "drive.children.insert"}, "get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"folderId": {"required": true, "type": "string", "location": "path"}, "childId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.children.get", "httpMethod": "GET", "path": "files/{folderId}/children/{childId}", "response": {"$ref": "ChildReference"}}, "list": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"q": {"type": "string", "location": "query"}, "pageToken": {"type": "string", "location": "query"}, "folderId": {"required": true, "type": "string", "location": "path"}, "maxResults": {"default": "100", "minimum": "0", "type": "integer", "location": "query", "format": "int32"}}, "id": "drive.children.list", "httpMethod": "GET", "path": "files/{folderId}/children", "response": {"$ref": "ChildList"}}, "delete": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "path": "files/{folderId}/children/{childId}", "id": "drive.children.delete", "parameters": {"folderId": {"required": true, "type": "string", "location": "path"}, "childId": {"required": true, "type": "string", "location": "path"}}, "httpMethod": "DELETE"}}}', true));
    $this->permissions = new Google_PermissionsServiceResource($this, $this->serviceName, 'permissions', json_decode('{"methods": {"insert": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"sendNotificationEmails": {"default": "true", "type": "boolean", "location": "query"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "Permission"}, "response": {"$ref": "Permission"}, "httpMethod": "POST", "path": "files/{fileId}/permissions", "id": "drive.permissions.insert"}, "get": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"permissionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.permissions.get", "httpMethod": "GET", "path": "files/{fileId}/permissions/{permissionId}", "response": {"$ref": "Permission"}}, "list": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.readonly"], "parameters": {"fileId": {"required": true, "type": "string", "location": "path"}}, "id": "drive.permissions.list", "httpMethod": "GET", "path": "files/{fileId}/permissions", "response": {"$ref": "PermissionList"}}, "update": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"permissionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "Permission"}, "response": {"$ref": "Permission"}, "httpMethod": "PUT", "path": "files/{fileId}/permissions/{permissionId}", "id": "drive.permissions.update"}, "patch": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "parameters": {"permissionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "request": {"$ref": "Permission"}, "response": {"$ref": "Permission"}, "httpMethod": "PATCH", "path": "files/{fileId}/permissions/{permissionId}", "id": "drive.permissions.patch"}, "delete": {"scopes": ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"], "path": "files/{fileId}/permissions/{permissionId}", "id": "drive.permissions.delete", "parameters": {"permissionId": {"required": true, "type": "string", "location": "path"}, "fileId": {"required": true, "type": "string", "location": "path"}}, "httpMethod": "DELETE"}}}', true));

  }
}
