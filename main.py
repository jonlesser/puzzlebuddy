import jinja2
import os
import webapp2

from controllers.credentials import CredentialsHandler
from controllers.index import IndexHandler
from controllers.hunt_list import HuntListHandler
from controllers.hunt_dashboard import HuntDashboardHandler
from oauth2client.appengine import OAuth2DecoratorFromClientSecrets

decorator = OAuth2DecoratorFromClientSecrets(
    os.path.join(os.path.dirname(__file__), 'client_secrets.json'), '')

debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')
app = webapp2.WSGIApplication([
  webapp2.Route(r'/', IndexHandler, name='index'),
  webapp2.Route(r'/hunts', HuntListHandler, name='hunt_list'),
  webapp2.Route(r'/credentials', CredentialsHandler, name='credentials'),
  webapp2.Route(decorator.callback_path, decorator.callback_handler()),
  webapp2.Route(r'/<hurl:[a-zA-Z0-9]{4,32}>', HuntDashboardHandler,
      name="hunt_dashboard"),
], debug=debug)
