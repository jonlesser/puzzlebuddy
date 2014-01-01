import jinja2
import httplib2
import json
import logging
import os
import webapp2

from models.models import Hunts
from google.appengine.api import users
from apiclient import discovery

class HuntDashboardHandler(webapp2.RequestHandler):
  def get(self, hurl=None):
    user = users.get_current_user()
    hunt = Hunts.query(Hunts.hurl == hurl).get()

    # Make sure we have a hunt.
    if not hunt:
      self.error(404)
      self.response.out.write('Hunt not found')
      return

    # Check if the current user is in the hunters property. Add if not.
    hunter_found = False
    for hunter in hunt.hunters:
      if user.user_id() == hunter.user_id():
        hunter_found = True
        break

    if not hunter_found:
      hunt.hunters.append(user)
      hunt.put()

    templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
    template = templates.get_template('hunt_dashboard.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
      'hunt': hunt,
      'hurl': hunt.hurl,
      'name': hunt.name,
      'rt_file_id': hunt.rt_file_id,
      'shared_folder_id': hunt.shared_folder_id,
    }))
