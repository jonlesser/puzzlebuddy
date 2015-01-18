import httplib2
import jinja2
import json
import logging
import os
import re
import webapp2

from googleapiclient import discovery
from google.appengine.api import users
from models.models import Hunts
from oauth2client.client import SignedJwtAssertionCredentials

class HuntDashboardHandler(webapp2.RequestHandler):
  def CheckHunterInHunt(self, user, hunt):
    hunter_found = False
    for hunter in hunt.hunters:
      if user.user_id() == hunter.user_id():
        hunter_found = True
        break
    return hunter_found

  def post(self, hurl=None):
    user = users.get_current_user()
    hunt = Hunts.query(Hunts.hurl == hurl).get()
    title = self.request.get('title', None)

    if not hunt:
      logging.error('Hunt not found')
      self.response(400)
      return

    # User must be in the current hunt to create docs.
    if not self.CheckHunterInHunt(user, hunt):
      logging.error('User not in hunt.')
      self.error(403)
      return

    # Validate title
    if re.match(r'^[\w\s]{1,128}$', title) == None:
      logging.error('Invalid doc title')
      self.error(400)
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
    with open('../puzzlebuddy-b7c415ad8eaf.pem') as f:
      private_key = f.read()
    credentials = SignedJwtAssertionCredentials(client_email, private_key, scopes)

    if credentials is None or credentials.invalid:
      logging.error('Puzbud credentials failed to load or were invalid')
    http = Http()
    credentials.authorize(http)
    service = discovery.build('drive', 'v2', http=http)

    # Create a new doc.
    body = {
      'title': title,
      'mimeType': 'application/vnd.google-apps.spreadsheet',
      'parents': [{'id': hunt.shared_folder_id}],
    }
    # TODO(jonlesser): Catch AccessTokenRefreshError exceptions when executing.
    doc = service.files().insert(body=body).execute()

    resp = {'file_id': doc['id']}
    self.response.out.write(json.dumps(resp))

  def get(self, hurl=None):
    user = users.get_current_user()
    hunt = Hunts.query(Hunts.hurl == hurl).get()

    # Make sure we have a hunt.
    if not hunt:
      self.error(404)
      self.response.out.write('Hunt not found')
      return

    if not self.CheckHunterInHunt(user, hunt):
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
      with open('../puzzlebuddy-b7c415ad8eaf.pem') as f:
        private_key = f.read()
      credentials = SignedJwtAssertionCredentials(client_email, private_key, scopes)

      if credentials is None or credentials.invalid:
        logging.error('Puzbud credentials failed to load or were invalid')
      http = Http()
      credentials.authorize(http)
      service = discovery.build('drive', 'v2', http=http)
      body = {
        'value': user.email(),
        'type': 'user',
        'role': 'writer',
      }
      service.permissions().insert(fileId=hunt.shared_folder_id,
                                   sendNotificationEmails=False,
                                   body=body).execute()

      # Add user to hunt model.
      hunt.hunters.append(user)
      hunt.put()

    debug = os.environ["SERVER_SOFTWARE"].startswith('Development')
    if self.request.get('nodebug'):
      debug = False

    templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
    template = templates.get_template('hunt_dashboard.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': debug,
      'hunt': hunt,
      'hurl': hunt.hurl,
      'name': hunt.name,
      'rt_file_id': hunt.rt_file_id,
      'shared_folder_id': hunt.shared_folder_id,
    }))
