function createBranch(branchName) {
  //Get Reop
  var getRepo = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs/heads/master",{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  muteHttpExceptions: true
                                  }).getContentText();
  
  var repo = JSON.parse(getRepo)
  var shaLatestCommit = repo.object.sha
  
  var newBranchPayload = JSON.stringify({
    "ref": "refs/heads/featureA",
    "sha": shaLatestCommit
  })
  
  
  var newBranch = UrlFetchApp.fetch(baseURl + repoURL + "/git/refs",
                                    {
                                    headers:{
                                    'Authorization': 'token ' + git
                                    },
                                    method: "post",
                                    payload: newBranchPayload,
                                    
                                    }).getContentText();
  
  return newBranch
}

function mergeToMaster(from, commit){
  mergerBranch(from, "master", commit)
}

function mergeBranch(from, to, commit){
  
 var mergePayload = JSON.stringify({
  "base": to,
  "head": from,
  "commit_message": "Shipped cool_feature!"
})
  
  
  var mergeResponse = UrlFetchApp.fetch(baseURl + repoURL + "/merges",
                                    {
                                    headers:{
                                    'Authorization': 'token ' + git
                                    },
                                    method: "post",
                                    payload: mergePayload,
                                    
                                    }).getContentText();
  
  var deleteBranch = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs/heads/" + from,{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                   method: "delete"
                                  }).getContentText();
  

  debugger;
}

function test(){
  var file = new File("Test push another New file", "THis is a test push of a new file")

//Get post info
  var author = "tim cargan"
  var authorName = "Tim Cargan"
  var authorEmail = "timcargan@gmail.com"

  //Push commit to Github
  var commitMessage = "Test of a new file to a new branch"
  
  pushToGit([file], "/heads/featureA", authorName, authorEmail, commitMessage)
  
  
}
 