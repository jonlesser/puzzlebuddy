goog.provide('pb.Index');

goog.require('goog.dom');
goog.require('goog.ui.Component');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 */
pb.Index = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
};
goog.inherits(pb.Index, goog.ui.Component);


/** @override */
pb.Index.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/** Override */
pb.Index.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
