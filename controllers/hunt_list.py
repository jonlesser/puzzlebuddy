import jinja2
import os
import webapp2

templates = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

class HuntListHandler(webapp2.RequestHandler):
  def get(self):
    template = templates.get_template('hunt_list.html')
    self.response.headers.add('X-UA-Compatible', 'IE=edge')
    self.response.out.write(template.render({
      'dev': os.environ["SERVER_SOFTWARE"].startswith('Development'),
    }))
