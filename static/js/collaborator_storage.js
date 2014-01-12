goog.provide('pb.CollaboratorStorage');

goog.require('goog.Disposable');



/**
 * Manages a map of all collaborators past and present. Collaborators are keyed
 * by userId.
 *
 * @constructor
 */
pb.CollaboratorStorage = function() {
  goog.base(this);
  /**
   * @private {gapi.drive.realtime.Document}
   */
  this.doc_;

  /**
   * @private {gapi.drive.realtime.CollaborativeMap}
   */
  this.collaboratorsMap_;
};
goog.inherits(pb.CollaboratorStorage, goog.Disposable);
goog.addSingletonGetter(pb.CollaboratorStorage);


/**
 * Manages a map of all collaborators past and present. Collaborators are keyed
 * by userId.
 *
 * @param {gapi.drive.realtime.CollaborativeMap} collaboratorsMap Map of all
 *     document collaborators past and present.
 * @param {gapi.drive.realtime.Document} doc The realtime document.
 */
pb.CollaboratorStorage.prototype.init = function(collaboratorsMap, doc) {
  this.doc_ = doc;
  this.collaboratorsMap_ = collaboratorsMap;

  // Get the current collaborators and add them the map.
  this.initCollaborators_(this.doc_.getCollaborators());

  // Listen for new collaborators.
  this.doc_.addEventListener(
      gapi.drive.realtime.EventType.COLLABORATOR_JOINED,
      goog.bind(this.setActive_, this, true));

  // Listen for collaborators leaving.
  this.doc_.addEventListener(
      gapi.drive.realtime.EventType.COLLABORATOR_LEFT,
      goog.bind(this.setActive_, this, false));

};


/**
 * @param {Array.<gapi.drive.realtime.Collaborator>} collaborators Array of
 *     collaborators currently in the document.
 */
pb.CollaboratorStorage.prototype.initCollaborators_ = function(collaborators) {
  for (var i=0, collaborator; collaborator = collaborators[i]; i++) {
    var existingCollaborator = this.collaboratorsMap_.get(
        collaborator.userId);

    if (!existingCollaborator) {
      var map = this.doc_.getModel().createMap();
      map.set('active', true);
      map.set('timestamp', new Date());
      map.set('photoUrl', collaborator.photoUrl);
      map.set('displayName', collaborator.displayName);
      this.collaboratorsMap_.set(collaborator.userId, map);
    } else if (!existingCollaborator.get('active')) {
      existingCollaborator.set('active', true);
    }
  }
};


/**
 * Updates the 'active' property of a collaborator when they join or leave the
 * doc. Note: This is not very efficient because every time a user joins or
 * leaves, all active users will report the change in state.
 *
 * @param {boolean} newActiveState State to set on collaborator.
 * @param {gapi.drive.realtime.CollaboratorJoinedEvent|
 *     gapi.drive.realtime.CollaboratorLeftEvent} e The event.
 */
pb.CollaboratorStorage.prototype.setActive_ = function(newActiveState, e) {
  var userId = e.collaborator.userId;
  var collaborator = this.collaboratorsMap_.get(userId);

  // If the user is leaving, make sure they don't have another session before
  // marking them as not active.
  if (newActiveState === false && this.userHasActiveSession_(userId)) {
    return;
  }

  if (collaborator.get('active') !== newActiveState) {
    collaborator.set('active', newActiveState);
  }
};


/**
 * Checks if a given userId is currently an active collaborator. This is used
 * to ensure that collaborators aren't marked as inactive when close one of
 * potentially several sessions.
 *
 * @param {string} userId The userId to check.
 * @return {boolean}
 */
pb.CollaboratorStorage.prototype.userHasActiveSession_ = function(userId) {
  var active = false;
  var collaborators = this.doc_.getCollaborators();
  for (var i=0, collaborator; collaborator = collaborators[i]; i++) {
    if (userId === collaborator.userId) {
      active = true;
      break;
    }
  }
  return active;
}


/** Override */
pb.CollaboratorStorage.prototype.disposeInternal = function() {

  // TODO(jonlesser): I don't think it's right to remove with a new bind.
  this.doc_.removeEventListener(
      gapi.drive.realtime.EventType.COLLABORATOR_JOINED,
      goog.bind(this.setActive_, this, true));

  this.doc_.removeEventListener(
      gapi.drive.realtime.EventType.COLLABORATOR_LEFT,
      goog.bind(this.setActive_, this, false));

  this.doc_ = null;
  this.collaboratorsMap_ = null;
  goog.base(this, 'disposeInternal');
};
