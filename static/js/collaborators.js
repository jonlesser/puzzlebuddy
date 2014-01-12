goog.provide('pb.Collaborators');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');



/**
 * @param {gapi.drive.realtime.CollaborativeMap} collaboratorMap Collaborators.
 * @param {gapi.drive.realtime.Document} doc The realtime document.
 * @constructor
 */
pb.Collaborators = function(collaboratorMap, doc) {
  goog.base(this);
  /**
   * @private {gapi.drive.realtime.CollaborativeMap} collaboratorMap Peeps.
   */
  this.collaboratorMap_ = collaboratorMap;

  /**
   * @private {gapi.drive.realtime.Document} doc The realtime document.
   */
  this.doc_ = doc;
};
goog.inherits(pb.Collaborators, goog.ui.Component);


/**
 * CSS classes used by this module.
 *
 * @enum {string}
 * @private
 */
pb.Collaborators.Class_ = {
  ACTIVE: 'collaborator--active',
  BASE: 'collaborator',
  LIST: 'collaborator-list'
};


/** @override */
pb.Collaborators.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  // Add all the known collaborators.
  var userIds = this.collaboratorMap_.keys();
  var parentEl = this.getElementByClass(pb.Collaborators.Class_.LIST);
  for (var i=0, userId; userId = userIds[i]; i++) {
    this.addCollaboratorEl_(this.collaboratorMap_.get(userId), parentEl);
  }

  // Listen for new collaborators.
  this.collaboratorMap_.addEventListener(
      gapi.drive.realtime.EventType.VALUE_CHANGED,
      goog.bind(this.collaboratorAddedHander_, this));
};

/**
 * @param {gapi.drive.realtime.ValueChangedEvent} e The change event.
 */
pb.Collaborators.prototype.collaboratorAddedHander_ = function(e) {
  var parentEl = this.getElementByClass(pb.Collaborators.Class_.LIST);
  this.addCollaboratorEl_(e.newValue, parentEl);
};


/**
 * Updates the collaborator element with changes to the collaborator map.
 * Currently only supports updating the active class.
 *
 * @param {Element} el The element associated with this collaborator.
 * @param {gapi.drive.realtime.ValueChangedEvent} e The changed property event.
 */
pb.Collaborators.prototype.collaboratorUpdatedHander_ = function(el, e) {
  if (e.property === 'active') {
    goog.dom.classlist.enable(el, pb.Collaborators.Class_.ACTIVE, e.newValue);
  }
};


/**
 * @param {gapi.drive.realtime.CollaborativeMap} collaborator Colaborator Map.
 * @param {Element} parentEl The element to append to.
 */
pb.Collaborators.prototype.addCollaboratorEl_ = function(collaborator,
    parentEl) {
  var el = goog.dom.createDom('div', pb.Collaborators.Class_.BASE);
  if (collaborator.get('active')) {
    goog.dom.classlist.add(el, pb.Collaborators.Class_.ACTIVE);
  }

  // Set content with name and picture.
  goog.dom.setTextContent(el, collaborator.get('displayName'));
  var imgEl = goog.dom.createDom('img');
  imgEl.src = collaborator.get('photoUrl');
  el.appendChild(imgEl);

  // Listen for collaborator changes and update element.
  collaborator.addEventListener(
      gapi.drive.realtime.EventType.VALUE_CHANGED,
      goog.bind(this.collaboratorUpdatedHander_, this, el));

  parentEl.appendChild(el);
};


/** Override */
pb.Collaborators.prototype.disposeInternal = function() {
  this.doc_ = null;
  this.collaboratorMap_ = null;
  goog.base(this, 'disposeInternal');
};
