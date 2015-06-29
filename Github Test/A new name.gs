function autoCrat_advanced() {
  var ss = SpreadsheetApp.getActive();
  var app = UiApp.createApplication().setTitle("Advanced options").setHeight(130).setWidth(290);
  var quitHandler = app.createServerHandler('autoCrat_quitUi');
  var handler1 = app.createServerHandler('autoCrat_detectFormSheet');
  var button1 = app.createButton('Copy down formulas on form submit').addClickHandler(quitHandler).addClickHandler(handler1);
  var handler2 = app.createServerHandler('autoCrat_extractorWindow');
  var button2 = app.createButton('Package this system for others to copy').addClickHandler(quitHandler).addClickHandler(handler2);
  var handler3 = app.createServerHandler('autoCrat_institutionalTrackingUi');
  var button3 = app.createButton('Manage your usage tracker settings').addClickHandler(quitHandler).addClickHandler(handler3);
  var panel = app.createVerticalPanel();
  panel.add(button1);
  panel.add(button2);
  panel.add(button3);
  app.add(panel);
  ss.show(app);
  return app;
}

function autoCrat_quitUi(e) {
  var app = UiApp.getActiveApplication();
  app.close();
  return app;
}