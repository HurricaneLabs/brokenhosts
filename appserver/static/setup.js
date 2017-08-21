var comps = (location.pathname.split('?')[0]).split('/');
var idx = comps.indexOf('app');
var appName = comps[idx + 1];

window.location = "/manager/" + appName + "/apps/local/" + appName + "/setup?action=edit";
