goog.provide('pb.Page');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('pb.HuntDashboard');
goog.require('pb.HuntList');
goog.require('pb.Index');



/**
 * @param {string} pageType String indicating which page to load.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @export
 */
pb.Page = function(pageType, opt_domHelper) {
  goog.base(this, opt_domHelper);
  /**
   * @type {string}
   * @private
   */
  this.pageType_ = pageType;
};
goog.inherits(pb.Page, goog.ui.Component);


/**
 * @enum {string}
 */
pb.Page.PageTypes = {
  INDEX: 'index',
  HUNT_DASHBOARD: 'hunt_dashboard',
  HUNT_LIST: 'hunt_list'
};


/** @override */
pb.Page.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var component;

  switch (this.pageType_) {
    case pb.Page.PageTypes.INDEX:
      component = new pb.Index();
      break;
    case pb.Page.PageTypes.HUNT_LIST:
      component = new pb.HuntList();
      break;
    case pb.Page.PageTypes.HUNT_DASHBOARD:
      component = new pb.HuntDashboard();
      break;
  }

  if (component) {
    component.setModel(window.JS_MODEL || {});
    component.setId(this.pageType_);
    this.addChild(component);
    component.decorate(document.body);
  }
};


/** Override */
pb.Page.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};

goog.exportProperty(pb.Page.prototype, 'decorate',
    pb.Page.prototype.decorate);
