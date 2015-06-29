function thing(){ 
  var getRepo = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs/heads/master",{
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  muteHttpExceptions: true
                                  }).getContentText();
  
  var repo = JSON.parse(getRepo)
  var sha = repo.object.sha
  
  var basetree = UrlFetchApp.fetch( baseURl + repoURL + "/git/trees/" + sha,{
                               headers:{
                               'Authorization': 'token ' + git
                               },
                               muteHttpExceptions: true
                               }).getContentText();
  var repo = JSON.parse(basetree)
  
  
  var files = []
  
  for (var i in repo.tree){
    var leaf = repo.tree[i]
   
    
    //If its a folder, extract it by calling the fuction resusrivly
    if(leaf.type == "tree"){
      
      var url = leaf.url
      var leafContent = UrlFetchApp.fetch(url ,{
        headers:{
          'Authorization': 'token ' + git
        },
        muteHttpExceptions: true
      }).getContentText();
      
      leafContent = JSON.parse(leafContent)
      leafContent.tree.pop() 
    }
  }
  

  
 
  //Post files
  var postTreePayload = {
    base_tree: repo.sha,
    tree: leafContent.tree
  };
  
  var postTreePayloadE = JSON.stringify(postTreePayload)
  var newTree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees",
                                  {
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  method: "post",
                                  payload:postTreePayloadE
  
  }).getContentText();

  var tree = JSON.parse(newTree)
  var shaNewTree = tree.sha
  
  //Post files
  var postTreePayload = {
    base_tree: repo.sha,
    tree: [new Tree(tree.sha)]
  };
  
  var postTreePayloadE = JSON.stringify(postTreePayload)
  var newTree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees",
                                  {
                                  headers:{
                                  'Authorization': 'token ' + git
                                  },
                                  method: "post",
                                  payload:postTreePayloadE
  
  }).getContentText();

   
  ///Post comit
  
  var postCommitPayload = JSON.stringify({
    "message": "test",
    "author": {
      "date": Date().toString,
      "name": "Tim Cargan",
      "email": "timcargan@gmail.com"
    },
    'tree': shaNewTree,
    'parents': [sha]
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
  
  var push = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs/heads/master",
                               {
                               headers:{
                               'Authorization': 'token ' + git
                               },
                               "method" : "post",
                               payload: pushPayload,
                               muteHttpExceptions: true
                               }).getContentText();
 
  
}

function Tree (path, tree) {
  this.path = "Test/Tim/t"
  this.mode = "040000"
  this.type = "tree"
  this.sha = path
}

