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
