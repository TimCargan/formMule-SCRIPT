//Object
function File (fileName, content) {
  this.path = fileName
  this.mode = "100644"
  this.type = "blob"
  this.content = content
}

var git = gitService().getAccessToken()
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
  var oldTree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees/" + shaLatestCommit,{
                                    headers:{
                                    'Authorization': 'token ' + git
                                    },
                                    muteHttpExceptions: true
                                    }).getContentText();
  
  oldTree = JSON.parse(oldTree)
  var shaBaseTree = oldTree.sha
  var treeRaw = oldTree.tree
  
  var treeToPush = calcDiffTree(files, treeRaw)
  
  //Post files
  //This is a hack of sorts, to keep up with file renames, everything is over written. 
  var postTreePayload = JSON.stringify({
    tree: treeToPush 
  });

  
  var postTree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees",
                                   {
                                   headers:{
                                   'Authorization': 'token ' + git
                                   },
                                   method: "post",
                                   payload:postTreePayload
                                   
                                   }).getContentText();
  
  var newTree = JSON.parse(postTree)
  var shaNewTree = newTree.sha
   
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

//Calculate the diff tree so files get renamed, updated and deleted
//esentaly rebuild the repo tree 
/*
@ files = files being pushed 
@ treeRaw = currentTree

*/
function calcDiffTree(files, treeRaw){
  
  //This is how files get renamed since there is no clean way to rename and bulk push commits
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
  
  return treeToPush
}