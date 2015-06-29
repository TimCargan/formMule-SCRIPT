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

  //Get commit
  var getCommit = UrlFetchApp.fetch(baseURl + repoURL + "/git/commits/" + shaLatestCommit,{
                                    headers:{
                                    'Authorization': 'token ' + git
                                    },
                                    muteHttpExceptions: true
                                    }).getContentText();
  
  var commit = JSON.parse(getCommit)
  var shaBaseTree = commit.tree.sha
 
  //Post files
  var postTreePayload = JSON.stringify({
    base_tree: shaBaseTree,
    tree:files
  });
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