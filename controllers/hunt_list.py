import jinja2
import os
import logging
import webapp2

from google.appengine.api import users
from models.models import Hunts
from models.models import Hunters

templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

class HuntListHandler(webapp2.RequestHandler):
  def get(self):
    # Get a list of hunts associated with this user.
    user = users.get_current_user()

    template = templates.get_template('hunt_list.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
    }))

  def post(self):
    pass
