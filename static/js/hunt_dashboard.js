goog.provide('pb.HuntDashboard');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('pb.Authorize');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 */
pb.HuntDashboard = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(pb.HuntDashboard, goog.ui.Component);


/** @override */
pb.HuntDashboard.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var auth = new pb.Authorize();
  auth.setId('authorize');
  this.addChild(auth);

  this.getHandler().listen(auth, pb.AuthorizeEventType.AUTHORIZED, function(e){
    console.log(e);
  });

  auth.decorate(this.getElementByClass('authorize'));
};


/** Override */
pb.HuntDashboard.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
