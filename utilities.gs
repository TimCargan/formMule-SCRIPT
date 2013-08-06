function formMule_institutionalTrackingUi() {
  var institutionalTrackingString = UserProperties.getProperty('institutionalTrackingString');
  var eduSetting = UserProperties.getProperty('eduSetting');
  if (!(institutionalTrackingString)) {
    UserProperties.setProperty('institutionalTrackingString', 'not participating');
  }
  var app = UiApp.createApplication().setTitle('Hello there! Help us track the usage of this script').setHeight(400);
  if ((!(institutionalTrackingString))||(!(eduSetting))) {
    var helptext = app.createLabel("You are most likely seeing this prompt because this is the first time you are using a Google Apps script created by New Visions for Public Schools, 501(c)3. If you are using scripts as part of a school or grant-funded program like New Visions' CloudLab, you may wish to track usage rates with Google Analytics. Entering tracking information here will save it to your user credentials and enable tracking for any other New Visions scripts that use this feature. No personal info will ever be collected.").setStyleAttribute('marginBottom', '10px');
  } else {
  var helptext = app.createLabel("If you are using scripts as part of a school or grant-funded program like New Visions' CloudLab, you may wish to track usage rates with Google Analytics. Entering or modifying tracking information here will save it to your user credentials and enable tracking for any other scripts produced by New Visions for Public Schools, 501(c)3, that use this feature. No personal info will ever be collected.").setStyleAttribute('marginBottom', '10px');
  }
  var panel = app.createVerticalPanel();
  var gridPanel = app.createVerticalPanel().setId("gridPanel").setVisible(false);
  var grid = app.createGrid(4,2).setId('trackingGrid').setStyleAttribute('background', 'whiteSmoke').setStyleAttribute('marginTop', '10px');
  var checkHandler = app.createServerHandler('formMule_refreshTrackingGrid').addCallbackElement(panel);
  var checkBox = app.createCheckBox('Participate in institutional usage tracking.  (Only choose this option if you know your institution\'s Google Analytics tracker Id.)').setName('trackerSetting').addValueChangeHandler(checkHandler);  
  var checkBox2 = app.createCheckBox('Let New Visions for Public Schools, 501(c)3 know you\'re an educational user.').setName('eduSetting');  
  if ((institutionalTrackingString == "not participating")||(institutionalTrackingString=='')) {
    checkBox.setValue(false);
  } 
  if (eduSetting=="true") {
    checkBox2.setValue(true);
  }
  var institutionNameFields = [];
  var trackerIdFields = [];
  var institutionNameLabel = app.createLabel('Institution Name');
  var trackerIdLabel = app.createLabel('Google Analytics Tracker Id (UA-########-#)');
  grid.setWidget(0, 0, institutionNameLabel);
  grid.setWidget(0, 1, trackerIdLabel);
  if ((institutionalTrackingString)&&((institutionalTrackingString!='not participating')||(institutionalTrackingString==''))) {
    checkBox.setValue(true);
    gridPanel.setVisible(true);
    var institutionalTrackingObject = Utilities.jsonParse(institutionalTrackingString);
  } else {
    var institutionalTrackingObject = new Object();
  }
  for (var i=1; i<4; i++) {
    institutionNameFields[i] = app.createTextBox().setName('institution-'+i);
    trackerIdFields[i] = app.createTextBox().setName('trackerId-'+i);
    if (institutionalTrackingObject) {
      if (institutionalTrackingObject['institution-'+i]) {
        institutionNameFields[i].setValue(institutionalTrackingObject['institution-'+i]['name']);
        if (institutionalTrackingObject['institution-'+i]['trackerId']) {
          trackerIdFields[i].setValue(institutionalTrackingObject['institution-'+i]['trackerId']);
        }
      }
    }
    grid.setWidget(i, 0, institutionNameFields[i]);
    grid.setWidget(i, 1, trackerIdFields[i]);
  } 
  var help = app.createLabel('Enter up to three institutions, with Google Analytics tracker Id\'s.').setStyleAttribute('marginBottom','5px').setStyleAttribute('marginTop','10px');
  gridPanel.add(help);
  gridPanel.add(grid); 
  panel.add(helptext);
  panel.add(checkBox2);
  panel.add(checkBox);
  panel.add(gridPanel);
  var button = app.createButton("Save settings");
  var saveHandler = app.createServerHandler('formMule_saveInstitutionalTrackingInfo').addCallbackElement(panel);
  button.addClickHandler(saveHandler);
  panel.add(button);
  app.add(panel);
  ss.show(app);
  return app;
}

function formMule_refreshTrackingGrid(e) {
  var app = UiApp.getActiveApplication();
  var gridPanel = app.getElementById("gridPanel");
  var grid = app.getElementById("trackingGrid");
  var setting = e.parameter.trackerSetting;
  if (setting=="true") {
    gridPanel.setVisible(true);
  } else {
    gridPanel.setVisible(false);
  }
  return app;
}

function formMule_saveInstitutionalTrackingInfo(e) {
  var app = UiApp.getActiveApplication();
  var eduSetting = e.parameter.eduSetting;
  var oldEduSetting = UserProperties.getProperty('eduSetting')
  if (eduSetting == "true") {
    UserProperties.setProperty('eduSetting', 'true');
  }
  if ((oldEduSetting)&&(eduSetting=="false")) {
    UserProperties.setProperty('eduSetting', 'false');
  }
  var trackerSetting = e.parameter.trackerSetting;
  if (trackerSetting == "false") {
    UserProperties.setProperty('institutionalTrackingString', 'not participating');
    app.close();
    return app;
  } else {
  var institutionalTrackingObject = new Object;
  for (var i=1; i<4; i++) {
    var checkVal = e.parameter['institution-'+i];
    if (checkVal!='') {
      institutionalTrackingObject['institution-'+i] = new Object();
      institutionalTrackingObject['institution-'+i]['name'] = e.parameter['institution-'+i];
      institutionalTrackingObject['institution-'+i]['trackerId'] = e.parameter['trackerId-'+i];
      if (!(e.parameter['trackerId-'+i])) {
        Browser.msgBox("You entered an institution without a Google Analytics Tracker Id");
        formMule_institutionalTrackingUi()
      }
    }
  }
  var institutionalTrackingString = Utilities.jsonStringify(institutionalTrackingObject);
  UserProperties.setProperty('institutionalTrackingString', institutionalTrackingString);
  app.close();
  return app;
}
}


function formMule_checkForSourceChanges() {
var ss = SpreadsheetApp.getActiveSpreadsheet();
var activeSheet = ss.getActiveSheet();
var activeSheetName = activeSheet.getName();
    var activeRange = activeSheet.getActiveCell();
    var activeRow = activeRange.getRow();
    var emailConditionString = ScriptProperties.getProperty('emailConditions');
    if (emailConditionString) {
      var emailConditionObject = Utilities.jsonParse(emailConditionString);
      if (activeRow == 1) {
        var numSelected = ScriptProperties.getProperty("numSelected");
        for (var i = 0; i<numSelected; i++) {
          var sheetName = emailConditionObject['sht-'+i].trim();
          var sheet = ss.getSheetByName(sheetName);
          formMule_setAvailableTags(sheet);
        }
      }
    }
}


// This code was borrowed and modified from the Flubaroo Script author Dave Abouav
// It anonymously tracks script usage to Google Analytics, allowing our non-profit to report our impact to funders
// For original source see http://www.edcode.org



function formMule_createInstitutionalTrackingUrls(institutionTrackingObject, encoded_page_name, encoded_script_name) {
  for (var key in institutionTrackingObject) {
   var utmcc = formMule_createGACookie();
  if (utmcc == null)
    {
      return null;
    }
  var encoded_page_name = encoded_script_name+"/"+encoded_page_name;
  var trackingId = institutionTrackingObject[key].trackerId;
  var ga_url1 = "http://www.google-analytics.com/__utm.gif?utmwv=5.2.2&utmhn=www.formmule-analytics.com&utmcs=-&utmul=en-us&utmje=1&utmdt&utmr=0=";
  var ga_url2 = "&utmac="+trackingId+"&utmcc=" + utmcc + "&utmu=DI~";
  var ga_url_full = ga_url1 + encoded_page_name + "&utmp=" + encoded_page_name + ga_url2;
  
  if (ga_url_full)
    {
      var response = UrlFetchApp.fetch(ga_url_full);
    }
  }
}



function formMule_createGATrackingUrl(encoded_page_name)
{
  var utmcc = formMule_createGACookie();
  var eduSetting = UserProperties.getProperty('eduSetting');
  if (eduSetting=="true") {
    encoded_page_name = "edu/" + encoded_page_name;
  }
  if (utmcc == null)
    {
      return null;
    }
 
  var ga_url1 = "http://www.google-analytics.com/__utm.gif?utmwv=5.2.2&utmhn=www.formmule-analytics.com&utmcs=-&utmul=en-us&utmje=1&utmdt&utmr=0=";
  var ga_url2 = "&utmac=UA-30976195-1&utmcc=" + utmcc + "&utmu=DI~";
  var ga_url_full = ga_url1 + encoded_page_name + "&utmp=" + encoded_page_name + ga_url2;
  
  return ga_url_full;
}


function formMule_createSystemTrackingUrls(institutionTrackingObject, encoded_system_name, encoded_execution_name) {
  for (var key in institutionTrackingObject) {
  var utmcc = formMule_createGACookie();
  if (utmcc == null)
    {
      return null;
    }
  var trackingId = institutionTrackingObject[key].trackerId;
  var encoded_page_name = encoded_system_name+"/"+encoded_execution_name;
  var ga_url1 = "http://www.google-analytics.com/__utm.gif?utmwv=5.2.2&utmhn=www.cloudlab-systems-analytics.com&utmcs=-&utmul=en-us&utmje=1&utmdt&utmr=0=";
  var ga_url2 = "&utmac="+trackingId+"&utmcc=" + utmcc + "&utmu=DI~";
  var ga_url_full1 = ga_url1 + encoded_page_name + "&utmp=" + encoded_page_name + ga_url2;
  if (ga_url_full1)
    {
      var response = UrlFetchApp.fetch(ga_url_full1);
    } 
  }
  
  var encoded_page_name = encoded_system_name+"/"+encoded_execution_name;
  var ga_url1 = "http://www.google-analytics.com/__utm.gif?utmwv=5.2.2&utmhn=www.cloudlab-systems-analytics.com&utmcs=-&utmul=en-us&utmje=1&utmdt&utmr=0=";
  var ga_url2 = "&utmac=UA-34521561-1&utmcc=" + utmcc + "&utmu=DI~";
  var ga_url_full2 = ga_url1 + encoded_page_name + "&utmp=" + encoded_page_name + ga_url2;
  if (ga_url_full2)
    {
      var response = UrlFetchApp.fetch(ga_url_full2);
    }

}







function formMule_createGACookie()
{
  var a = "";
  var b = "100000000";
  var c = "200000000";
  var d = "";

  var dt = new Date();
  var ms = dt.getTime();
  var ms_str = ms.toString();
 
  var formmule_uid = UserProperties.getProperty("formmule_uid");
  if ((formmule_uid == null) || (formmule_uid == ""))
    {
      // shouldn't happen unless user explicitly removed flubaroo_uid from properties.
      return null;
    }
  
  a = formmule_uid.substring(0,9);
  d = formmule_uid.substring(9);
  
  utmcc = "__utma%3D451096098." + a + "." + b + "." + c + "." + d 
          + ".1%3B%2B__utmz%3D451096098." + d + ".1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B";
 
  return utmcc;
}

function formMule_logCalEvent()
{
  var ga_url = formMule_createGATrackingUrl("Auto-Created%20Calendar%20Event");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
  var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
  if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"Auto-Created%20Calendar%20Event", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "Auto-Created%20Calendar%20Event")
    }
  }
}




function formMule_logCalUpdate()
{
  var ga_url = formMule_createGATrackingUrl("Auto-Updated%20Calendar%20Event");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
  var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
  if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"Auto-Updated%20Calendar%20Event", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "Auto-Updated%20Calendar%20Event")
    }
  }
}


function formMule_logSMS()
{
  var ga_url = formMule_createGATrackingUrl("SMS%20Message%20Sent");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
  var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
  if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"SMS%20Message%20Sent", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "SMS%20Message%20Sent")
    }
  }
}


function formMule_logVoiceCall()
{
  var ga_url = formMule_createGATrackingUrl("Voice%20Call%20Made");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
  var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
  if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"Voice%20Call%20Made", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "Voice%20Call%20Made")
    }
  }
}





function formMule_getInstitutionalTrackerObject() {
  var institutionalTrackingString = UserProperties.getProperty('institutionalTrackingString');
  if ((institutionalTrackingString)&&(institutionalTrackingString != "not participating")) {
    var institutionTrackingObject = Utilities.jsonParse(institutionalTrackingString);
    return institutionTrackingObject;
  }
  if (!(institutionalTrackingString)||(institutionalTrackingString='')) {
    formMule_institutionalTrackingUi();
    return;
  }
}

function formMule_logEmail()
{
  var ga_url = formMule_createGATrackingUrl("Mailed%20Templated%20Email");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
    var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
  if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"Mailed%20Templated%20Email", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "Mailed%20Templated%20Email")
    }
  }
}


function formMule_logRepeatInstall()
{
  var ga_url = formMule_createGATrackingUrl("Repeat%20Install");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
      var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
  if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"Repeat%20Install", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "Repeat%20Install")
    }
  }
}

function formMule_logFirstInstall()
{
  var ga_url = formMule_createGATrackingUrl("First%20Install");
  if (ga_url)
    {
      var response = UrlFetchApp.fetch(ga_url);
    }
  var institutionalTrackingObject = formMule_getInstitutionalTrackerObject();
   if (institutionalTrackingObject) {
    formMule_createInstitutionalTrackingUrls(institutionalTrackingObject,"First%20Install", "formMule");
    var systemName = ScriptProperties.getProperty('systemName');
    if (systemName) {
      var encoded_system_name = urlencode(systemName);
      formMule_createSystemTrackingUrls(institutionalTrackingObject, encoded_system_name, "First%20Install")
    }
  }
}


function setFormMuleUid()
{ 
  var formmule_uid = UserProperties.getProperty("formmule_uid");
  if (formmule_uid == null || formmule_uid == "")
    {
      // user has never installed formMule before (in any spreadsheet)
      var dt = new Date();
      var ms = dt.getTime();
      var ms_str = ms.toString();
 
      UserProperties.setProperty("formmule_uid", ms_str);
      formMule_logFirstInstall();
    }
}


function setFormMuleSid()
{ 
  var formmule_sid = ScriptProperties.getProperty("formmule_sid");
  if (formmule_sid == null || formmule_sid == "")
    {
      // user has never installed formMule before (in any spreadsheet)
      var dt = new Date();
      var ms = dt.getTime();
      var ms_str = ms.toString();
      ScriptProperties.setProperty("formmule_sid", ms_str);
      var formmule_uid = UserProperties.getProperty("formmule_uid");
      if (formmule_uid != null || formmule_uid != "") {
        formMule_logRepeatInstall();
      }
    }
}


function formMule_clearAllFlags() {
  formMule_clearMergeFlags();
  formMule_clearEventUpdateFlags();
  formMule_clearEventCreateFlags()
}


function formMule_clearSpecificTemplateMergeFlags() {
  var templateName = "First Reminder";  //Hand code the name of the template whose status you want deleted
  var sheetName = ScriptProperties.getProperty('sheetName');
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var emailConditionString = ScriptProperties.getProperty('emailConditions');  
  var emailConditionObject = Utilities.jsonParse(emailConditionString);    
  var numSelected = emailConditionObject['max'];
  var copyDownOn = ScriptProperties.getProperty('copyDownOption');
    var k = 2;
    if (copyDownOn=="true") {
      k=3;
    }
  var col = headers.indexOf(templateName + " Status") + 1;
  var lastRow = sheet.getLastRow();
  if ((col!=0)&&(lastRow>k-1)) {
    var range = sheet.getRange(k, col, lastRow-(k-1), 1).clear();
  }
}



function formMule_clearMergeFlags() {
  var sheetName = ScriptProperties.getProperty('sheetName');
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var emailConditionString = ScriptProperties.getProperty('emailConditions');  
  if (emailConditionString) {
    var emailConditionObject = Utilities.jsonParse(emailConditionString);  
    var numSelected = emailConditionObject['max'];
  }
  var copyDownOn = ScriptProperties.getProperty('copyDownOption');
    var k = 2;
    if (copyDownOn=="true") {
      k=3;
    }
  for (var i=0; i<numSelected; i++) {
    var col = headers.indexOf(emailConditionObject['sht-'+i] + " Status") + 1;
    var lastRow = sheet.getLastRow();
    if ((col!=0)&&(lastRow>k-1)) {
      var range = sheet.getRange(k, col, lastRow-(k-1), 1).clear();
    }
  }
}



function formMule_clearEventUpdateFlags() {
  var sheetName = ScriptProperties.getProperty('sheetName');
  var ss = SpreadsheetApp.getActive();
  if ((sheetName)&&(sheetName!='')) {
    var sheet = ss.getSheetByName(sheetName);
    var headers = formMule_fetchHeaders(sheet);
    var eventUpdateIndex = headers.indexOf("Event Update Status");
    var lastRow = sheet.getLastRow();
    var copyDownOn = ScriptProperties.getProperty('copyDownOption');
    var k = 2;
    if (copyDownOn=="true") {
      k=3;
    }
    if ((eventUpdateIndex!=-1)&&(eventUpdateIndex>k-1)) {
      if (lastRow-(k-1)>0) {
        var range = sheet.getRange(k, eventUpdateIndex+1, lastRow-(k-1), 1).clear();
      }
    }
  }
}
  
  
function formMule_clearEventCreateFlags() {
  var sheetName = ScriptProperties.getProperty('sheetName');
  var ss = SpreadsheetApp.getActive();
  if ((sheetName)&&(sheetName!='')) {
    var sheet = ss.getSheetByName(sheetName);
    var headers = formMule_fetchHeaders(sheet);
    var eventUpdateIndex = headers.indexOf("Event Creation Status");
    var lastRow = sheet.getLastRow();
    var copyDownOn = ScriptProperties.getProperty('copyDownOption');
    var k = 2;
    if (copyDownOn=="true") {
      k=3;
    }
    if ((eventUpdateIndex!=-1)&&(eventUpdateIndex>k-1)) {
      if (lastRow-(k-1)>0) {
        var range = sheet.getRange(k, eventUpdateIndex+1, lastRow-(k-1), 1).clear();
      }
    }
  }
}

function rangetotable(input) {
  var output = '<table cellpadding="8" border="1">';
  var rows = input.length;
  var cols = input[0].length;
  for (var i=0; i<input.length; i++) {
    output += "<tr>";
   for (var j=0; j<input[0].length; j++) {
      if (i==0) {
        output += '<th bgcolor="whitesmoke">'+input[i][j]+'</th>';
      } else {
        output += "<td>"+input[i][j]+"</td>";
      }
    }
    output += "</tr>";
  }
  output += "</table>";
  return output;
}
