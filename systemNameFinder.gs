//These functions are only used with scripts that are installed on systems packaged by New Visions for Public Schools

function setSystemName() {
  var systemName = getSystemName();
  if (systemName) {
    ScriptProperties.setProperty('systemName', systemName);
  }
}


function getSystemName() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = ss.getId();
  var file = DocsList.getFileById(ssId);
  var parents = file.getParents();
  var found = false;
  var maxIterations = 1;
  if (parents.length > 1) {
    maxIterations = 3;
  }
  var rootFolderId = DocsList.getRootFolder().getId();
  for (var i=0; i<maxIterations; i++) {
    var thisParent = parents[i];
    if ((parents.length>0)&&(thisParent)) {
      if (thisParent.getId()!=rootFolderId) {
        var theseSpreadsheets = thisParent.getFilesByType('spreadsheet');
        for (var j=0; j<theseSpreadsheets.length; j++) {
          var thisName = theseSpreadsheets[j].getName();
          if (thisName == "Read Me") {
            found = true;
            var readMeSS = SpreadsheetApp.openById(theseSpreadsheets[j].getId());
            break;
          }
        }
      }
    }
  }
  if ((found)&&(readMeSS)) {
    var sheet = readMeSS.getSheets()[0];
    var timeZone = readMeSS.getSpreadsheetTimeZone();
    var range = sheet.getRange(1,2,10,1);
    var thisSystem = NVSL.getColumnsData(sheet, range)[0];
    var version = '';
    if (!thisSystem.systemName) {
      return;
    }
    if (thisSystem.version) {
      version = " - V" + thisSystem.version;
    }
    var dateOfLastUpdate = '';
    if (thisSystem.dateOfLastUpdate) {
      dateOfLastUpdate = " (" + Utilities.formatDate(new Date(thisSystem.dateOfLastUpdate), timeZone, 'M/dd/yy') + ")";
    }
    var trackingName = thisSystem.systemName + version + dateOfLastUpdate;
    return trackingName;
  } else {
    return;
  } 
}


