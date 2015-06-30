//TO_DO
//Need to calciuate diff so not pushing big commits
    
function pushFilesToGit() {
  var fileIds = ["1LZQAZoZvwPLRBFrYntDBkswOzLXzPR8nBNXmy07YXj9HDiD0M46YyMda", "1TlBOVOzyZG2PlMgB6MKGekH4KqfiFQ9CNYStc54RDM9EV6DujViTL9lz"]
  var filesToPush = []
  
  for (var fileId in fileIds){
    //Get file from drive
    var scriptFile = Drive.Files.get(fileIds[fileId]);
    var exportLink = scriptFile.exportLinks["application/vnd.google-apps.script+json"];
    var oAuthToken = ScriptApp.getOAuthToken();
    var lib = UrlFetchApp.fetch(exportLink, {
      headers:{
        'Authorization': 'Bearer ' + oAuthToken
      },
      muteHttpExceptions: true
    });
    
    //load files into Array
    var files = JSON.parse(lib.getContentText()).files
    var folder =  scriptFile.title
    
    for(var gs in files){
      var extention = files[gs].type == "server_js" ? ".gs" : ".html"
      var fileName = folder + "/" + files[gs].name + extention
      var fileContent = files[gs].source  
      filesToPush.push({
        "path": fileName,
        "mode": "100644",
        "type": "blob",
        "content": fileContent
      })
    }   
  }
  
  var name = "Tim Cargan"
  var email = "timcargan@gmail.com"
  var commitMessage = "Test"
  
  pushToGit(filesToPush, "/heads/master" , name, email, commitMessage)
}


