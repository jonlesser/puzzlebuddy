goog.provide('pb.Messages');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');



/**
 * @param {gapi.drive.realtime.CollaborativeList} messageList Messages list.
 * @param {gapi.drive.realtime.Document} doc The realtime document.
 * @constructor
 */
pb.Messages = function(messageList, doc) {
  goog.base(this);
  /**
   * @private {gapi.drive.realtime.CollaborativeList} messageList Messages list.
   */
  this.messageList_ = messageList;

  /**
   * @private {gapi.drive.realtime.Document} doc The realtime document.
   */
  this.doc_ = doc;
};
goog.inherits(pb.Messages, goog.ui.Component);


/**
 * CSS classes used by this module.
 *
 * @enum {string}
 * @private
 */
pb.Messages.Class_ = {
  FORM: 'message-form',
  COMPOSED_INPUT: 'message-compose',
  LIST: 'message-list'
};


/** @override */
pb.Messages.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Create message els for each existing message.
  if (this.messageList_.length > 0) {
    this.addMessageEl_(this.messageList_.asArray(), 0);
  }

  // Listen for new messages.
  this.messageList_.addEventListener(
      gapi.drive.realtime.EventType.VALUES_ADDED,
      goog.bind(this.valueAddedHandler_, this));

  // Create new messages on form submission.
  this.getHandler().listen(
      this.getElementByClass(pb.Messages.Class_.FORM),
      goog.events.EventType.SUBMIT,
      goog.bind(this.composeMessageHandler_, this));
};


/**
 * Handler for new messages. Inserts new message element in to DOM.
 *
 * @param {gapi.drive.realtime.ValuesAddedEvent} e Values added event.
 * @private
 */
pb.Messages.prototype.valueAddedHandler_ = function(e) {
  this.addMessageEl_(e.values, e.index);
};


/**
 * Inserts a new message element into the dom.
 *
 * @param {Array.<!Object>} messages An array of message objects.
 * @param {number} index The index of the first message.
 * @private
 */
pb.Messages.prototype.addMessageEl_ = function(messages, index) {
  var msgsEl = this.getElementByClass(pb.Messages.Class_.LIST);
  for (var i=0, msg; msg = messages[i]; i++) {
    var el = goog.dom.createDom('div');
    goog.dom.setTextContent(el, [
        msg['message'],
        msg['timestamp'],
        msg['userId']].join('*'));
    goog.dom.insertChildAt(msgsEl, el, index + i)
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
};


/**
 * Creates a new message from on form submission.
 *
 * @param {goog.events.Event} e The submission event.
 * @private
 */
pb.Messages.prototype.composeMessageHandler_ = function(e) {
  e.preventDefault();

  var composedInput = this.getElementByClass(pb.Messages.Class_.COMPOSED_INPUT);
  var msg = {
    'message': composedInput.value,
    'timestamp': new Date(),
    // TODO(jonlesser): Set actual userId.
    'userId': 123
  };

  this.messageList_.push(msg);

  composedInput.value = '';
};


/** Override */
pb.Messages.prototype.disposeInternal = function() {
  this.messageList_.removeEventListener(
      gapi.drive.realtime.EventType.VALUES_ADDED,
      goog.bind(this.valueAddedHandler_, this));

  this.doc_ = null;
  this.messageList_ = null;
  goog.base(this, 'disposeInternal');
};
