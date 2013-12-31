import jinja2
import logging
import os
import webapp2

from google.appengine.api import users
from models.models import CredentialsModel
from oauth2client.appengine import OAuth2DecoratorFromClientSecrets
from oauth2client.appengine import StorageByKeyName


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

decorator = OAuth2DecoratorFromClientSecrets('client_secrets.json', scopes)

class CredentialsHandler(webapp2.RequestHandler):
  @decorator.oauth_aware
  def get(self):
    templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
    template = templates.get_template('credentials.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
      'form_action': self.url_for('credentials'),
      'has_credentials': decorator.has_credentials(),
      'authorize_url': decorator.authorize_url(),
    }))

  @decorator.oauth_required
  def post(self):
    user = users.get_current_user()
    storage = StorageByKeyName(CredentialsModel, 'cred_key', 'credentials')
    storage.put(decorator.credentials)
    self.redirect_to('credentials')
