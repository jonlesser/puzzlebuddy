import jinja2
import os
import webapp2

from controllers.hunt_dashboard import HuntDashboardHandler
from controllers.hunt_list import HuntListHandler
from controllers.index import IndexHandler

debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')
app = webapp2.WSGIApplication([
  webapp2.Route(r'/', IndexHandler, name='index'),
  webapp2.Route(r'/hunts', HuntListHandler, name='hunt_list'),
  webapp2.Route(r'/<hurl:[a-zA-Z0-9]{4,32}>', HuntDashboardHandler,
      name="hunt_dashboard"),
], debug=debug)
