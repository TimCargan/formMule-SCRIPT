//new name 
//DOes it work?


function createGoogleFileInFolder3() {  
    var requestBody =  {
      "files": [
        {
          "name":"Code",
          "type":"server_js",
          "source":"function doGet() {\n  return HtmlService.createHtmlOutputFromFile(\u0027index\u0027);\n}\n"
        },
        {
          "name":"index",
          "type":"html",
          "source":"\u003chtml\u003e\n  \u003cbody\u003e\n    Created with Apps Script.\n  \u003c/body\u003e\n\u003c/html\u003e"
        }
      ]
    };

  var resource = {
    "title": "Test script",
    "parents": [
      {
        "id": "0B4FHJs5FbHQMcFE3YlBCVEZuMms"
      }
    ]
  };

  var blob = Utilities.newBlob(JSON.stringify(requestBody), "application/vnd.google-apps.script+json");

  Drive.Files.insert(resource, blob, {"convert":"true"});
}
//This is a thig

//This matters


//Dont hate