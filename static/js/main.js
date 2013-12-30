goog.provide('pb.Page');

goog.require('goog.dom');
goog.require('goog.ui.Component');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @export
 */
pb.Page = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
};
goog.inherits(pb.Page, goog.ui.Component);


/**
 * @override
 */
pb.Page.prototype.enterDocument = function() {
  pb.Page.superClass_.enterDocument.call(this);
};


/**
 * Override
 */
pb.Page.prototype.disposeInternal = function() {
  pb.Page.superClass_.disposeInternal.call(this);
};

goog.exportProperty(pb.Page.prototype, 'decorate',
    pb.Page.prototype.decorate);
