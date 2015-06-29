function pushToGit2(files, branch, name, email, commitMessage){
  
  //Get Reop
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
  
  var commit = JSON.parse(tree)
  var shaBaseTree = commit.sha
  
  for (var i in commit.tree){
    var leaf = commit.tree[i]
    //If its a folder, extract it by calling the fuction resusrivly
    if(leaf.type == "tree"){
      var folderSha = leaf.sha
      break
    }
  }

  
  //Post files
  var postTreePayload = JSON.stringify({
    base_tree: folderSha,
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



   