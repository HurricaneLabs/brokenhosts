(function() {
  // breakdown the URL into app name and page name
  var urlAppComponents = (function() {
    var comps = (location.pathname.split('?')[0]).split('/');
    var idx   = comps.indexOf('app');
    return [comps[idx + 1], comps[idx + 2]];
  })();

  // obtain values from previous anonymous function
  var appName  = urlAppComponents[0];
  var pageName = urlAppComponents[1];

  window.location = "/manager/" + $appName + "/apps/local/" + $appName + "/setup?action=edit"
