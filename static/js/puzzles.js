goog.provide('pb.Puzzles');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
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
  ANSWER: 'answer',
  COLLAPSE: 'puzzle--collapse',
  LIST: 'puzzle-list',
  NAME: 'name',
  NOTES: 'notes',
  PUZZLE: 'puzzle',
  STATUS: 'status'
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
  var el = this.createPuzzleDom_();

  // Listen for clicks on the section and expand on click.
  this.getHandler().listen(
      goog.dom.getFirstElementChild(el),
      goog.events.EventType.CLICK,
      goog.bind(this.expandPuzzleHandler_, this, el));

  // Bind realtime strings.
  gapi.drive.realtime.databinding.bindString(
      puzzleMap.get('name'),
      goog.dom.getElementByClass(pb.Puzzles.Class_.NAME, el));
  gapi.drive.realtime.databinding.bindString(
      puzzleMap.get('answer'),
      goog.dom.getElementByClass(pb.Puzzles.Class_.ANSWER, el));
  gapi.drive.realtime.databinding.bindString(
      puzzleMap.get('notes'),
      goog.dom.getElementByClass(pb.Puzzles.Class_.NOTES, el));

  // Insert timestamp

  // Listen for clicks on the delete button.

  // Listen for status changes.


  // Insert the puzzle and scroll to the top.
  goog.dom.insertChildAt(listEl, el, index);
  listEl.scrollTop = 0;
};


/**
 * Handles clicks on the puzzle element header.
 *
 * @param {Node} el The element.
 * @param {goog.events.Event} e The click event.
 * @private
 */
pb.Puzzles.prototype.expandPuzzleHandler_ = function(el, e) {
  // Set up classes.
  var open = this.getElementsByClass(pb.Puzzles.Class_.PUZZLE);
  for (var i=0, puzzle; puzzle = open[i]; i++) {
    goog.dom.classlist.add(puzzle, pb.Puzzles.Class_.COLLAPSE);
    var status = goog.dom.getElementByClass(pb.Puzzles.Class_.STATUS, puzzle);
    var name = goog.dom.getElementByClass(pb.Puzzles.Class_.NAME, puzzle);
    status.disabled = true;
    status.disabled = true;
  }
  
  // Enable fields.
  goog.dom.classlist.remove(el, pb.Puzzles.Class_.COLLAPSE);
  var status = goog.dom.getElementByClass(pb.Puzzles.Class_.STATUS, el);
  var name = goog.dom.getElementByClass(pb.Puzzles.Class_.NAME, el);
  status.disabled = false;
  name.disabled = false;
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
  map.set('name', this.doc_.getModel().createString());
  map.set('answer', this.doc_.getModel().createString());
  map.set('notes', this.doc_.getModel().createString());
  map.set('links', this.doc_.getModel().createList());
  map.set('hunters', this.doc_.getModel().createList());
  map.set('status', 0);
  map.set('deleted', false);
  map.set('created', new Date());

  return map;
}


/**
 * Produces a document fragment for a new puzzle.
 *
 * @return {!Node}
 * @private
 */
pb.Puzzles.prototype.createPuzzleDom_ = function() {
  var html = '';
  html += '<section class="puzzle puzzle--collapse">';
  html += '  <header>';
  html += '    <input type="text" class="name"';
  html += '           placeholder="Puzzle Name..." maxlength="128" disabled>';
  html += '    <select class="status" disabled>';
  html += '      <option value="0">New</option>';
  html += '      <option value="1">Underway</option>';
  html += '      <option value="2">Needs Help</option>';
  html += '      <option value="3">Solved</option>';
  html += '    </select>';
  html += '    <span class="status-icon"></span>';
  html += '  </header>';
  html += '  <section>';
  html += '    <input type="text" class="answer" placeholder="Answer...">';
  html += '    <textarea class="notes" placeholder="Notes..."></textarea>';
  html += '    <ul class="links"></ul>';
  html += '    <button class="add-link">Add link</button>';
  html += '    <ul class="hunters"></ul>';
  html += '    <button class="add-hunter">I am working on this</button>';
  html += '    <div class="timestamp"><a href="#">Delete Puzzle</a></div>';
  html += '  </section>';
  html += '</section>';

  return goog.dom.htmlToDocumentFragment(html);
};


/** Override */
pb.Puzzles.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
