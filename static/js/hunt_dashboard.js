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
    gapi.load('drive-realtime', goog.bind(this.loadDoc_, this));
  });

  auth.decorate(this.getElementByClass('authorize'));
};


/**
 * @private
 */
pb.HuntDashboard.prototype.loadDoc_ = function() {
  gapi.drive.realtime.load(
      this.getModel()['rt_file_id'],
      goog.bind(this.fileLoadHandler_, this),
      goog.bind(this.fileInitializeHandler_, this),
      goog.bind(this.errorHandler_, this));
};


/**
 * @param {gapi.drive.realtime.Document} doc The realtime document.
 * @private
 */
pb.HuntDashboard.prototype.fileLoadHandler_ = function(doc) {
  console.log(doc);
};


/**
 * Initializes the document model of newly created document.
 *
 * root
 *  - collaborativeList: 'puzzles'
 *    - collaborativeMap:
 *        'url': string
 *        'name': collaborativeString
 *        'notes': collaborativeString
 *        'docs': collaborativeList
 *          - collaborativeMap:
 *              'url': string
 *              'type': doctypes enum
 *              'deleted': boolean
 *              'created': Date
 *              'modified': Date
 *        'deleted': boolean
 *        'needsHelp': boolean
 *        'created': Date
 *        'modified': Date
 *        'creator': string
 *        'modifier': string
 *        'answer': collaborativeString
 *        'hunters': collaborativeList
 *          - collaborativeMap:
 *              'timestamp': Date
 *              'userId': string
 *              'photoUrl': string
 *              'displayName': string
 *  - collaborativeList: 'messages'
 *    - collaborativeMap:
 *        'subject': collaborativeString
 *        'message': collaborativeString
 *        'modified': Date
 *        'modifier': string
 *  - collaborativeList: 'hunters'
 *    - collaborativeMap:
 *        'timestamp': Date
 *        'userId': string
 *        'photoUrl': string
 *        'displayName': string
 *
 * @param {gapi.drive.realtime.Model} model The realtime document model.
 * @private
 */
pb.HuntDashboard.prototype.fileInitializeHandler_ = function(model) {
  console.log(model)
};


/**
 * @param {gapi.drive.realtime.Error} error Error object.
 * @private
 */
pb.HuntDashboard.prototype.errorHandler_ = function(error) {
  switch (error.type) {
    case gapi.drive.realtime.ErrorType.TOKEN_REFRESH_REQUIRED:
      this.getChild('authorize').authorize(true);
      break;
    default:
      alert("An Error happened :(...");
      console.error(error);
  }
};


/** Override */
pb.HuntDashboard.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
