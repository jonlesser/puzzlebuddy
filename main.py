import jinja2
import json
import os
import webapp2

from datetime import datetime, timedelta

templates = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainHandler(webapp2.RequestHandler):
  def get(self):
    template = templates.get_template('main.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
    }))

debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')
app = webapp2.WSGIApplication([
  webapp2.Route(r'/', MainHandler, name='main'),
], debug=debug)
