goog.provide('hii.Page');

goog.require('goog.dom');
goog.require('goog.ui.Component');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @export
 */
hii.Page = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
};
goog.inherits(hii.Page, goog.ui.Component);


/**
 * @override
 */
hii.Page.prototype.enterDocument = function() {
  hii.Page.superClass_.enterDocument.call(this);
};


/**
 * Override
 */
hii.Page.prototype.disposeInternal = function() {
  hii.Page.superClass_.disposeInternal.call(this);
};

goog.exportProperty(hii.Page.prototype, 'decorate',
    hii.Page.prototype.decorate);
