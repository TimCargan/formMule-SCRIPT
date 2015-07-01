//Object
function File (fileName, content) {
  this.path = fileName
  this.mode = "100644"
  this.type = "blob"
  this.content = content
}



function pushToGit(files, branch, name, email, commitMessage){
  var repoURL = "/TimCargan/formMule-SCRIPT"

  //Get Reop  
  var repo = getRepo(repoURL, branch)
  var shaLatestCommit = repo.object.sha

  //Get Tree
  var oldTree = getTree(repoURL, shaLatestCommit)
  //var shaBaseTree = oldTree.sha
  var treeRaw = oldTree.tree
  
  var treeToPush = calcDiffTree(files, treeRaw) //This is a hack of sorts, to keep up with file renames, everything is over written.
  
  //Post files
  var postTreePayload = JSON.stringify({
    tree: treeToPush 
  });
  
  var newTree = postTree(repoURL, postTreePayload)
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

  var postedCommit = postCommit(repoURL, postCommitPayload)
  var shaNewCommit = postedCommit.sha
  
  //Update ref so the new commit is shown
  var pushPayload = JSON.stringify({sha: shaNewCommit})
  postRef(repoURL, branch, pushPayload)

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