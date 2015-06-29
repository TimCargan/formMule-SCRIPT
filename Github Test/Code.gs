//Object
function File (fileName, content) {
  this.path = fileName
  this.mode = "100644"
  this.type = "blob"
  this.content = content
}

var git = "dd63dbed7ef5c2b10c85b866f4db35897aecbe95"
var baseURl = "https://api.github.com/repos"
var repoURL = "/TimCargan/formMule-SCRIPT"

function pushToGit(files, branch, name, email, commitMessage){
  
  //Get Reop
  var getRepo = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs" + branch,{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  muteHttpExceptions: true
                                  }).getContentText();
  
  var repo = JSON.parse(getRepo)
  var shaLatestCommit = repo.object.sha

  //Get Tree
  var getTree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees/" + shaLatestCommit,{
                                    headers:{
                                    'Authorization': 'token ' + git
                                    },
                                    muteHttpExceptions: true
                                    }).getContentText();
  
  var treeFull = JSON.parse(getTree)
  var shaBaseTree = treeFull.sha
 
  var treeRaw = treeFull.tree
  var foldersBeingPushed = []
  //Get folders being updated
  for (var i in files){
    var file = files[i]
    var folder = file.path.split("/")[0]
    if (foldersBeingPushed.indexOf(folder) == -1){
      foldersBeingPushed.push(folder)
    }
  }
  
  //Remove files and folders that are being updated
  for (var i = treeRaw.length - 1; i >0; i--){
    var leaf = treeRaw[i]
    if (foldersBeingPushed.indexOf(leaf.path) != -1){
      treeRaw.splice(i,1)
    }
  }
  
  //Add new files
  var treeToPush = treeRaw
  treeToPush = treeToPush.concat(files)
  
  //Post files
  //This is a hack of sorts, to keep up with file renames, everything is over written. 
  var postTreePayload = JSON.stringify({
    tree: treeToPush 
  });
  debugger;
  var postTree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees",
                                   {
                                   headers:{
                                   'Authorization': 'token ' + git
                                   },
                                   method: "post",
                                   payload:postTreePayload
                                   
                                   }).getContentText();
  
  var tree = JSON.parse(postTree)
  var shaNewTree = tree.sha
   
  ///Post comit
  
  var postCommitPayload = JSON.stringify({
    "message": commitMessage,
    "author": {
      "date": Date().toString,
      "name": name,
      "email": email
    },
    'tree': shaNewTree,
    'parents': [shaLatestCommit]
  });
  
  var postCommit = UrlFetchApp.fetch(baseURl + repoURL + "/git/commits",
                                     {
                                     headers:{
                                     'Authorization': 'token ' + git
                                     },
                                     payload: postCommitPayload,
                                     muteHttpExceptions: true
                                     }).getContentText();
  
  var postedCommit = JSON.parse(postCommit)
  var shaNewCommit = postedCommit.sha
  
  var pushPayload = JSON.stringify({
                               sha: shaNewCommit,
                               })
  
  var push = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs" + branch,
                               {
                               headers:{
                               'Authorization': 'token ' + git
                               },
                               "method" : "post",
                               payload: pushPayload,
                               muteHttpExceptions: true
                               }).getContentText();
  
}