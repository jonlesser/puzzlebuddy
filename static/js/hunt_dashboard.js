goog.provide('pb.HuntDashboard');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('pb.Authorize');
goog.require('pb.CollaboratorStorage');
goog.require('pb.Collaborators');
goog.require('pb.Messages');
goog.require('pb.Puzzles');



/**
 * @constructor
 */
pb.HuntDashboard = function() {
  goog.base(this);

  /**
   * @private {gapi.drive.realtime.Document}
   */
  this.doc_;
};
goog.inherits(pb.HuntDashboard, goog.ui.Component);


/**
 * CSS classes used by this module.
 *
 * @enum {string}
 * @private
 */
pb.HuntDashboard.Class_ = {
  COLLABORATORS: 'section--collaborators',
  MESSAGES: 'section--messages',
  PUZZLES: 'section--puzzles'
};


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
  this.doc_ = doc;
  // Temp hack until this stabalizes.
  this.fileInitializeHandler_(doc.getModel());

  var root = doc.getModel().getRoot();

  // TODO: Doesn't need to be a singleton now.
  var collaboratorStorage = pb.CollaboratorStorage.getInstance();
  collaboratorStorage.init(root.get('collaborators'), doc);

  var collaborators = new pb.Collaborators(root.get('collaborators'), doc);
  collaborators.setId('collaborators');
  this.addChild(collaborators);
  collaborators.decorate(
      this.getElementByClass(pb.HuntDashboard.Class_.COLLABORATORS));

  var messages = new pb.Messages(root.get('messages'), doc);
  messages.setId('messages');
  this.addChild(messages);
  messages.decorate(this.getElementByClass(pb.HuntDashboard.Class_.MESSAGES));

  var puzzles = new pb.Puzzles(root.get('puzzles'), doc);
  puzzles.setId('puzzles');
  this.addChild(puzzles);
  puzzles.decorate(this.getElementByClass(pb.HuntDashboard.Class_.PUZZLES));
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
 *          'userId': string
 *  - collaborativeList: 'messages'
 *    - Object:
 *        'message': string
 *        'timestamp': Date
 *        'userId': string
 *        'pinned': boolean
 *  - collaborativeMap: 'collaborators'
 *    - 'userId': collaborativeMap:
 *        'active': boolean
 *        'timestamp': Date
 *        'userId': string
 *        'photoUrl': string
 *        'displayName': string
 *
 * @param {gapi.drive.realtime.Model} model The realtime document model.
 * @private
 */
pb.HuntDashboard.prototype.fileInitializeHandler_ = function(model) {
  var root = model.getRoot();
  if (!root.get('collaborators')) {
    root.set('collaborators', model.createMap());
  }
  if (!root.get('messages')) {
    root.set('messages', model.createList());
  }
  if (!root.get('puzzles')) {
    root.set('puzzles', model.createList());
  }
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
