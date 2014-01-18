goog.provide('pb.Puzzles');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');



/**
 * @param {gapi.drive.realtime.CollaborativeList} messageList Messages list.
 * @param {gapi.drive.realtime.Document} doc The realtime document.
 * @constructor
 */
pb.Puzzles = function(puzzleList, doc) {
  goog.base(this);
  /**
   * @private {gapi.drive.realtime.CollaborativeList} messageList Messages list.
   */
  this.puzzleList_ = puzzleList;

  /**
   * @private {gapi.drive.realtime.Document} doc The realtime document.
   */
  this.doc_ = doc;
};
goog.inherits(pb.Puzzles, goog.ui.Component);


/**
 * CSS classes used by this module.
 *
 * @enum {string}
 * @private
 */
pb.Puzzles.Class_ = {
  ADD: 'puzzle-add',
  LIST: 'puzzle-list'
};


/** @override */
pb.Puzzles.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Render any existing puzzles.
  for (var i=0; i < this.puzzleList_.length; i++) {
    this.addPuzzleEl_(this.puzzleList_.get(i), i);
  }

  // Listen for new puzzles.
  this.puzzleList_.addEventListener(
      gapi.drive.realtime.EventType.VALUES_ADDED,
      goog.bind(this.valueAddedHandler_, this));

  // Listen for clicks on the "add puzzle" button.
  this.getHandler().listen(
      this.getElementByClass(pb.Puzzles.Class_.ADD),
      goog.events.EventType.CLICK,
      goog.bind(this.addPuzzleHander_, this));
};


/**
 * Handler for new messages. Inserts new message element in to DOM.
 *
 * @param {gapi.drive.realtime.ValuesAddedEvent} e Values added event.
 * @private
 */
pb.Puzzles.prototype.valueAddedHandler_ = function(e) {
  for (var i=0, puzzle; puzzleMap = e.values[i]; i++) {
    this.addPuzzleEl_(puzzleMap, e.index + i);
  }
};


/**
 * Creates DOM for a puzzle, attaches listeners, and inserts it the index.
 *
 * @param {gapi.drive.realtime.CollaborativeMap} puzzleMap The puzzle map.
 * @param {number} index The index where the puzzle will be inserted.
 * @private
 */
pb.Puzzles.prototype.addPuzzleEl_ = function(puzzleMap, index) {
  var listEl = this.getElementByClass(pb.Puzzles.Class_.LIST);
  var el = goog.dom.createDom('div');
  // TODO(jonlesser): Lots of dom to create here...
  goog.dom.insertChildAt(listEl, el, index)

  listEl.scrollTop = listEl.scrollHeight;
};


/**
 * Handles clicks on the add puzzle button.
 *
 * @param {goog.events.Event} e The click event.
 * @private
 */
pb.Puzzles.prototype.addPuzzleHander_ = function(e) {
  var puzzleMap = this.createNewPuzzleMap_();
  this.puzzleList_.push(puzzleMap);
};


/**
 * Creates a new puzzleMap with default values set.
 *
 * @return {gapi.drive.realtime.CollaborativeMap}
 * @private
 */
pb.Puzzles.prototype.createNewPuzzleMap_ = function() {
  var map = this.doc_.getModel().createMap();
  map.set('answer', this.doc_.getModel().createString());
  map.set('created', new Date());
  map.set('deleted', false);
  map.set('docs', this.doc_.getModel().createList());
  map.set('hunters', this.doc_.getModel().createList());
  map.set('modified', new Date());
  map.set('name', this.doc_.getModel().createString());
  map.set('needsHelp', false);
  map.set('notes', this.doc_.getModel().createString());
  map.set('solved', false);
  map.set('url', this.doc_.getModel().createString());

  return map;
}


/** Override */
pb.Puzzles.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
