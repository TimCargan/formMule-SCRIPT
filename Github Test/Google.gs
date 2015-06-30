function createScriptFile(fileName, code) {
  //wrap code in oject for DriveSDK  
  var code = { "files": code}
  //Create DriveFile for script file
  var resource = {
    "title": fileName,
    "parents": [{ "id": "0B4FHJs5FbHQMcFE3YlBCVEZuMms" }] //One line for neatness, its an array of id objs
  };
  
  var blob = Utilities.newBlob(JSON.stringify(code), "application/vnd.google-apps.script+json");
  Drive.Files.insert(resource, blob, {"convert":"true"});
}

function gitToGas() {
 var getRepo = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs/heads/master",{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  muteHttpExceptions: true
                                  }).getContentText();
  
  var repo = JSON.parse(getRepo)
  var sha = repo.object.sha
  
  var tree = UrlFetchApp.fetch( baseURl + repoURL + "/git/trees/" + sha,{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  muteHttpExceptions: true
                                  }).getContentText();
  
  var repo = JSON.parse(tree)
  treeToSorce(repo, "metta")
  
}

function treeToSorce(repo, scriptName){
  var files = []
  
  for (var i in repo.tree){
    var leaf = repo.tree[i]
    var url = leaf.url
    var leafContent = UrlFetchApp.fetch(url ,{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  muteHttpExceptions: true
                                  }).getContentText();
    
    leafContent = JSON.parse(leafContent)
    
    //If its a folder, extract it by calling the fuction resusrivly
    if(leaf.type == "tree"){
      treeToSorce(leafContent, leaf.path)
      continue
    }
    
    var decoded = Utilities.base64Decode(leafContent['content'], Utilities.Charset.UTF_8)
    var code = Utilities.newBlob(decoded).getDataAsString()
    
    //Get the type and name by matching the file extention
    var fileNameArray = leaf.path.split(".")
    var fileType = "html" //Defult to html so it can always save
    if (fileNameArray.length > 1){
      fileType = (fileNameArray.pop() == "gs") ? "server_js" : fileType //Match against gs file extention
    }
    var fileName = fileNameArray.join() //join incase filename has "."s in
    
      
    var file = {
      "name": fileName,
      "type": fileType,
      "source": code
      }
    files.push(file)
    }

  createScriptFile(scriptName, files) 
}
