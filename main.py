import jinja2
import os
import webapp2

from controllers.index import IndexHandler
from controllers.hunt_list import HuntListHandler
from controllers.hunt_dashboard import HuntDashboardHandler

debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')
app = webapp2.WSGIApplication([
  webapp2.Route(r'/', IndexHandler, name='index'),
  webapp2.Route(r'/hunts', HuntListHandler, name='hunt_list'),
  webapp2.Route(r'/<hurl:[a-zA-Z1-9]{4,32}>', HuntDashboardHandler),
], debug=debug)
