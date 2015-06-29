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
    "ref": "refs/heads/" + branchName,
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


function test(){
  createBranch("newFet") 
  var file = new File("Test push another New file", "THis is a test push of a new file")

//Get post info
  var author = "tim cargan"
  var authorName = "Tim Cargan"
  var authorEmail = "timcargan@gmail.com"

  //Push commit to Github
  var commitMessage = "Test of a new file to a new branch"
  
  pushToGit([file], "/heads/newFet", authorName, authorEmail, commitMessage)
  
  pull("newFet", "master")
  
}

function pull(from, to){
  
 var mergePayload = JSON.stringify({
  "title": "Amazing new feature",
  "body": "Please pull this in!",
  "head": from,
  "base": to
} )
  
  
  var pullResponse = UrlFetchApp.fetch(baseURl + repoURL + "/pulls",
                                    {
                                    headers:{
                                    'Authorization': 'token ' + git
                                    },
                                    method: "post",
                                    payload: mergePayload,
                                    
                                    }).getContentText();
}
