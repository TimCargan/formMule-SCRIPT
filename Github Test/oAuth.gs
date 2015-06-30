function gitService() {
  return OAuth2.createService('git')
  .setAuthorizationBaseUrl('https://github.com/login/oauth/authorize')
  .setTokenUrl('https://github.com/login/oauth/access_token')
  .setClientId('a1829f1a0c64039ae04a')
  .setClientSecret('1549fcfdc9f1e626fe0703eb6836c95dd1269bc1')
  .setCallbackFunction('authCallback')
  .setPropertyStore(PropertiesService.getUserProperties())
  .setScope('gist,repo,user')
 
}

function authCallback(request) {
  var git = gitService();
  var isAuthorized = git.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.').setSandboxMode(HtmlService.SandboxMode.IFRAME);
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab').setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
}