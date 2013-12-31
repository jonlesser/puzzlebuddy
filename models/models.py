from google.appengine.ext import ndb

class Hunters(ndb.Model):
  created = ndb.DateTimeProperty(auto_now_add=True)
  hunts = ndb.KeyProperty(kind='Hunts', repeated=True)
  modified = ndb.DateTimeProperty(auto_now=True)
  user = ndb.UserProperty(auto_current_user_add=True)

class Hunts(ndb.Model):
  created = ndb.DateTimeProperty(auto_now_add=True)
  creator = ndb.UserProperty(auto_current_user_add=True)
  hurl = ndb.StringProperty(required=True)
  modified = ndb.DateTimeProperty(auto_now=True)
  modifier = ndb.UserProperty(auto_current_user=True)
  name = ndb.StringProperty(required=True)
  rt_file_id = ndb.StringProperty(required=True)
  shared_folder_id = ndb.StringProperty(required=True)

class Puzzles(ndb.Model):
  created = ndb.DateTimeProperty(auto_now_add=True)
  creator = ndb.UserProperty(auto_current_user_add=True)
  doc_id = ndb.StringProperty(repeated=True)
  modified = ndb.DateTimeProperty(auto_now=True)
  modifier = ndb.UserProperty(auto_current_user=True)
  name = ndb.StringProperty(required=True)
  url = ndb.StringProperty()
