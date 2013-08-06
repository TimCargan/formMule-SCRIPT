function formMule_retrieveformurlUi() {
  var app = UiApp.createApplication().setHeight(380);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var panel = app.createVerticalPanel();
  var muleGrid = app.createGrid(1, 2);
  var image = app.createImage(this.MULEICONURL);
  var title = app.createLabel("Retrieve form URLs and prepopulation arguments").setStyleAttribute('fontSize','16px');
  image.setHeight("60px");
  muleGrid.setWidget(0, 0, image);
  muleGrid.setWidget(0, 1, title);
  var mainGrid = app.createGrid(4, 1);
  var html = "<p>If this spreadsheet lives in the same folder as other forms, this feature will retrieve these form URLs for more convenient use as links in your automated emails.</p>";
      html += "<p>Once you have run this function, you will have a sheet with all the essential information you need to create URLs to prepopulate form values with personalized data, making life easier for your users.</p>"; 
      html += "<p>Note that Google Apps domain users who prefer to have their forms set to require login will need to temporarily make their forms public (available to anonymous users) for this feature to work.</p>"; 
      html += "Hint: To ease the job of \'Url encoding\' pre-populated form values, this script contains a custom spreadsheet function that takes the form \"=urlencode(text_to_be_encoded)\" Try it along with \"=concatenate(string1,string2,...)\" to build prepopulated form URLs.";   
  var link = app.createAnchor("Learn more about prepopulating Google form values", "http://support.google.com/docs/bin/answer.py?hl=en&answer=160000");
  var spinner = app.createImage(MULEICONURL).setWidth(150);
  spinner.setVisible(false);
  spinner.setStyleAttribute("position", "absolute");
  spinner.setStyleAttribute("top", "120px");
  spinner.setStyleAttribute("left", "220px");
  spinner.setId("dialogspinner");
  var clickHandler = app.createServerHandler('formMule_retrieveformurls');
  var waitingHandler = app.createClientHandler().forTargets(spinner).setVisible(true);
  var opacityHandler = app.createClientHandler().forTargets(panel).setStyleAttribute('opacity', '0.5')
  var quitHandler = app.createServerHandler('formMule_quitFormUrl')
  var button = app.createButton("Retrieve/refresh all forms in the same folder as this spreadsheet", clickHandler).addClickHandler(waitingHandler).addClickHandler(opacityHandler);
  var button2 = app.createButton("No thanks", quitHandler).addClickHandler(waitingHandler).addClickHandler(opacityHandler);    
  mainGrid.setWidget(0, 0, app.createHTML(html));
  mainGrid.setWidget(1, 0, link);
  mainGrid.setWidget(3, 0, button2);
  mainGrid.setWidget(2, 0, button);
  app.add(muleGrid);
  panel.add(mainGrid);
  app.add(panel);
  app.add(spinner);
  ss.show(app);
  return app;          
}

function formMule_quitFormUrl() {
  var app = UiApp.getActiveApplication();
  app.close();
  return app;
}

function formMule_retrieveformurls() {
  var app = UiApp.getActiveApplication();
  //other form must be in same folder as this form
  var ssId  = SpreadsheetApp.getActiveSpreadsheet().getId();
  var parent = DocsList.getFileById(ssId).getParents()[0];
  var spreadsheets = parent.getFilesByType('spreadsheet');
  var forms = [];
  forms[0] = [];
  forms[0][0] = "Spreadsheet";
  forms[0][1] = "Form URL";
  var j=1;
  for (var i=0; i<spreadsheets.length; i++) {
      var newSSId = spreadsheets[i].getId();
      var formUrl = SpreadsheetApp.openById(newSSId).getFormUrl();
    if (formUrl) {
      forms[j] = [];
      forms[j][0] = '=hyperlink("'+spreadsheets[i].getUrl()+'","'+spreadsheets[i].getName() +'")';
      forms[j][1] = formUrl;
      j++;
    }
  }
  var sheet = ss.getSheetByName("Forms in same folder");
  if (!(sheet)) {
    sheet = ss.insertSheet("Forms in same folder");
  }
  ss.setActiveSheet(sheet);
  sheet.clear();
  sheet.getRange(1, 1, forms.length, forms[0].length).setValues(forms);
  formMule_loadFormsArray();
  app.close();
  return app;
}



function formMule_fetchFormStructure(formsArray) {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Forms in same folder")
  var prepopArray = [];
  for (var i=0; i<formsArray.length; i++) {
    var formContent = UrlFetchApp.fetch(formsArray[i]).getContentText();
    var found = true;
    var titles = [];
    var ids = [];
    var checkPrivateTag = "loginBox"
    var checkPrivate = formContent.search(checkPrivateTag);
    var n = 0;
    if (checkPrivate==-1) {
    for (var j=0; j<30; j++) {
      var tag = '<label class="ss-q-title" for="entry_'+j+'">'
      var begin = formContent.search(tag);
      ids.push("entry_"+j);
      if (begin!=-1) {
        n = 0;
        begin = begin+tag.length;
        var likelySubstr = formContent.substring(begin, begin+200);
        var end = likelySubstr.search('<');
        var end = begin + end;
        var likelyTitle = formContent.substring(begin, end-1);
        if (likelyTitle!='') {
          titles.push(likelyTitle); 
        } else {
          titles.push("Sample"); 
        }
      } else {
        n++;
        if (n<2) {
        titles.push("");
        }
      }
    }
    sheet.getRange(i+2, 4, 1, titles.length).setValues([titles]) 
    var prepopString = '';
    for (var k=0; k<ids.length-n; k++) {
      if (titles!="question deleted") {
        prepopString += "&" + ids[k]+"="+urlencode(titles[k]);
      }
    }
  prepopArray.push(prepopString);
  } else {
     prepopArray.push("form set to require login, cannot detect prepopulation structure");
  }
  }
  if (ids.length>0) {
    sheet.getRange(1, 4, 1, ids.length).setValues([ids]);
    var values = [];
    values[0] = [];
    values[0][0] = "Example prepopulation string";
    for (var i=0; i<prepopArray.length; i++) {
      values[i+1] = [];
      values[i+1][0] = prepopArray[i];
    }
    sheet.getRange(1, 3, prepopArray.length+1, 1).setValues(values);
  }
}

function formMule_loadFormsArray() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Forms in same folder")
  var values = sheet.getRange(2, 2, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  var formsArray = [];
  for (var i=0; i<values.length; i++) {
    formsArray.push(values[i][0]);
  }
  var prepopArray = formMule_fetchFormStructure(formsArray);
}
