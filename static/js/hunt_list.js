goog.provide('pb.HuntList');

goog.require('goog.dom');
goog.require('goog.ui.Component');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 */
pb.HuntList = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(pb.HuntList, goog.ui.Component);


/** @override */
pb.HuntList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/** Override */
pb.HuntList.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
