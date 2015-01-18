goog.provide('pb.Authorize');
goog.provide('pb.AuthorizeEventType');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.events.EventType');



/**
 * @enum {number}
 */
pb.AuthorizeEventType = {
  AUTHORIZED: 0
};


/**
 * @constructor
 */
pb.Authorize = function() {
  goog.base(this);

  /**
   * @private {Object|null}
   */
  this.lastAuthResult_ = null;

  /**
   * @private {number|null}
   */
  this.timeoutId_ = null;
};
goog.inherits(pb.Authorize, goog.ui.Component);


/**
 * @private {string}
 */
pb.Authorize.CLIENT_ID_ = '803173721883.apps.googleusercontent.com';


/**
 * @private {Array}
 */
pb.Authorize.CLIENT_SCOPES_ = [
  'https://www.googleapis.com/auth/drive.file'
];


/**
 * @enum {string}
 * @private
 */
pb.Authorize.Class_ = {
  BUTTON: 'authorize-button',
  SHOW: 'authorize--show'
};


/** @override */
pb.Authorize.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var authBtn = this.getElement(pb.Authorize.Class_.BUTTON);
  this.getHandler().listen(
      authBtn,
      goog.events.EventType.CLICK,
      goog.bind(this.authorize, this, false));

  gapi.load('auth:client', goog.bind(this.authorize, this, true));
};


/**
 * @param {boolean} immediate If true, then login uses "immediate mode",
 *     which means that the token is refreshed behind the scenes, and no UI is
 *     shown to the user.
 */
pb.Authorize.prototype.authorize = function(immediate) {
  gapi.auth.authorize({
    'client_id': pb.Authorize.CLIENT_ID_,
    'scope': pb.Authorize.CLIENT_SCOPES_,
    'immediate': immediate
  }, goog.bind(this.authorizeCallback_, this));
};


/**
 * @param {Object} authResult The result passed by gapi.auth.authorize.
 * @private
 */
pb.Authorize.prototype.authorizeCallback_ = function(authResult) {
  this.lastAuthResult_ = authResult;
  if (!authResult || authResult.error) {
    this.setVisible_(true);
    return;
  }

  // Refresh the token a bit before it expires.
  if (authResult.expires_in) {
    clearTimeout(this.timeoutId_);
    this.timeoutId_ = setTimeout(
        goog.bind(this.authorize, this, true),
        authResult.expires_in * .9 * 1000);
  }

  this.dispatchEvent(pb.AuthorizeEventType.AUTHORIZED);
  console.log("dispatched??");
  this.setVisible_(false);
};


/**
 * @param {boolean} visible True to show or false to hide.
 * @private
 */
pb.Authorize.prototype.setVisible_ = function(visible) {
  goog.dom.classlist.enable(
      this.getElement(), pb.Authorize.Class_.SHOW, visible);
};


/** Override */
pb.Authorize.prototype.disposeInternal = function() {
  clearTimeout(this.timeoutId_);
  goog.base(this, 'disposeInternal');
};
