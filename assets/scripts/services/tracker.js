wt.Services.Tracker = function(appId) {
  this.appId = appId || 'UA-XXXXXXXX-XX';
};

wt.Services.Tracker.prototype.launchApp = function() {
  ga('create', this.appId, 'http://website.io');
};

wt.Services.Tracker.prototype.track = function() {
  // ga('send', 'pageview');
};
