import jinja2
import logging
import os
import re
import webapp2

templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

class IndexHandler(webapp2.RequestHandler):
  def get(self, error=False):
    template = templates.get_template('index.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
      'form_action': self.url_for('index')
    }))

  def post(self):
    hurl = self.request.get('hurl', '')
    if re.match(r'^[a-zA-Z0-9]{4,32}$', hurl) == None:
      logging.warning('Invalid hurl submitted. JS validation must have failed.')
      self.redirect_to('index')
      return

    self.redirect_to('hunt_dashboard', hurl=hurl)
