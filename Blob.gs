function newBlob(content) {
//Post files
  var cc = Utilities.newBlob(JSON.stringify(content), "application/json").getBytes()
  cc = Utilities.base64Encode(cc)
  var postPayload = {
    "content": cc,
    "encoding": "base64"
  };
  
 
  postPayload = JSON.stringify(postPayload)
  var blob = UrlFetchApp.fetch(baseURl + repoURL + "/git/blobs",
                                  {
                                  headers:{
                                  'Authorization': 'token ' + git,
                   
                                  },
                                  method: "post",
                                  payload:postPayload
  
  }).getContentText();

return JSON.parse(blob)

}
