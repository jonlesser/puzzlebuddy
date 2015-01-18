import httplib2
import jinja2
import logging
import os
import re
import webapp2

from googleapiclient import discovery
from google.appengine.api import users
from httplib2 import Http
from models.models import Hunts
from oauth2client.client import SignedJwtAssertionCredentials


class HuntListHandler(webapp2.RequestHandler):
  def get(self):
    templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
    template = templates.get_template('hunt_list.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
      'form_action': self.url_for('hunt_list')
    }))

  def post(self):
    user = users.get_current_user()
    name = self.request.get('name', '')
    hurl = self.request.get('hurl', '')

    # Serverside validation of form fields.
    if re.match(r'^[a-zA-Z0-9]{4,32}$', hurl) == None:
      logging.warning('Invalid hurl submitted. JS validation must have failed.')
      self.redirect_to('hunt_list')
      return

    if re.match(r'^[\w\s]{1,64}$', name) == None:
      logging.warning('Invalid name submitted. JS validation must have failed.')
      self.redirect_to('hunt_list')
      return

    # Make sure there isn't already a hunt with this hurl.
    existing = Hunts.query(Hunts.hurl == hurl).count(limit=1, keys_only=True)
    if existing > 0:
      logging.warning('Attempting to create a hunt with existing hurl')
      self.redirect_to('hunt_list')
      return

    # Setup a service object to talk to the Drive API.
    scopes = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.scripts',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ]

    client_email = '803173721883-jropsa1ir9p79tdemgot99qqh77clbmg@developer.gserviceaccount.com'
    with open('puzzlebuddy-b7c415ad8eaf.pem') as f:
      private_key = f.read()
    credentials = SignedJwtAssertionCredentials(client_email, private_key, scopes)

    if credentials is None or credentials.invalid:
      logging.error('Puzbud credentials failed to load or were invalid')
    http = Http()
    credentials.authorize(http)
    service = discovery.build('drive', 'v2', http=http)

    # Create a folder to be shared by the team and contain all docs.
    body = {
      'title': hurl,
      'mimeType': 'application/vnd.google-apps.folder',
    }
    # TODO(jonlesser): Catch AccessTokenRefreshError exceptions when executing.
    doc = service.files().insert(body=body).execute()
    folder_id = doc['id']

    # Create a new Realtime Doc.
    body = {
      'title': '__%s' % hurl,
      'mimeType': 'application/vnd.google-apps.drive-sdk',
      'parents': [{'id': folder_id}],
    }
    doc = service.files().insert(body=body).execute()
    file_id = doc['id']

    # Share new folder with creator.
    body = {
      'value': user.email(),
      'type': 'user',
      'role': 'writer',
    }
    service.permissions().insert(fileId=folder_id,
                                 sendNotificationEmails=False,
                                 body=body).execute()

    # Create a new model with the Realtime Doc id.
    hunt_model = Hunts()
    hunt_model.hurl = hurl
    hunt_model.name = name
    hunt_model.rt_file_id = file_id
    hunt_model.shared_folder_id = folder_id
    hunt_model.hunters = [user]
    hunt_model.put()

    # Direct the user the hunt dashboard
    self.redirect_to('hunt_dashboard', hurl=hurl)

