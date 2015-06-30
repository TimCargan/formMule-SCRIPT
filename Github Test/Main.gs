/*User Flow
auth the app

Checkout a repo, creats a copy of the repo in drive
Make changes
Pull Request
Merge (done on github)

*/

function doGet(e) {

 
  var git = gitService();
  if (false) {
    var authorizationUrl = git.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    
    return page;
  } else{
    
  }
  
  var thing = git.getAccessToken()
  var thing2 = PropertiesService.getUserProperties().getProperties()
  Logger.log(thing)
  Logger.log(thing2)
}

