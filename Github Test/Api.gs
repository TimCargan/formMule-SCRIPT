//Wrapper functions for githup API
var git = gitService().getAccessToken()
var baseURl = "https://api.github.com/repos"

//Get Repo
function getRepo(repoURL, branch) {
  return getRepo_(repoURL, branch, git);
}
function getRepo_(repoURL, branch, token){
  var getRepo = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs" + branch,{
                                  headers:{
                                  'Authorization': 'token ' + token
                                  },
                                  }).getContentText();
  
  return JSON.parse(getRepo);
}

//Get Tree
function getTree(repoURL, sha){
  return getTree_(repoURL, sha, git);
}
function getTree_(repoURL, sha, token){
  var tree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees/" + sha,{
                               headers:{
                               'Authorization': 'token ' + token
                               },
                               }).getContentText();
  
  return JSON.parse(tree);
}

//Post Tree
function postTree(repoURL, payload){
  return postTree_(repoURL, payload, git);
}
function postTree_(repoURL, payload, token){
  var tree = UrlFetchApp.fetch(baseURl + repoURL + "/git/trees",
                               {
                               headers:{
                               'Authorization': 'token ' + token
                               },
                               "method": "post",
                               "payload": payload
                               }).getContentText();
  return JSON.parse(tree)
  
}


//Post Commit
function postCommit(repoURL, payload){
  return postCommit_(repoURL, payload, git)
} 
function postCommit_(repoURL, payload, token){
  var postCommit = UrlFetchApp.fetch(baseURl + repoURL + "/git/commits",
                                     {
                                     headers:{
                                     'Authorization': 'token ' + token
                                     },
                                     payload: payload,
                                     muteHttpExceptions: true
                                     }).getContentText();
  return JSON.parse(postCommit)
}

//Post Reff
/**
* Updates the refrence for a given branch of a repo.
*
* @param {string} base the number we're raising to a power
* @param {string} exp the exponent we're raising the base to
* @return {object} the js object response
*/

function postRef(repoURL, branch, payload){
  return postRef_(repoURL, branch, payload, git);
}
function postRef_(repoURL, branch, payload, token){
  var post = UrlFetchApp.fetch( baseURl + repoURL + "/git/refs" + branch,
                               {
                               headers:{
                               'Authorization': 'token ' + token 
                               },
                               "method" : "post",
                               payload: payload,
                               muteHttpExceptions: true
                               }).getContentText();
  
  return JSON.parse(post);
}