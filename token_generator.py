"""Script to generate refresh tokens.

Puzzle Buddy creates Realtime Documents with a regular Google account. This
script goes through the OAuth2 authorization flow to generate credentials for
whatever Google account completes the flow. Execute as follows:

$ python token_generator.py --noauth_local_webserver
"""
import argparse
import os
import sys

from apiclient import discovery
from oauth2client import client
from oauth2client import file
from oauth2client import tools

SCOPES = [
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

CRED_FILE = 'credentials.dat'

def main(argv):
  parser = argparse.ArgumentParser(parents=[tools.argparser])
  flags = parser.parse_args(argv[1:])
  secrets = os.path.join(os.path.dirname(__file__), 'client_secrets.json')
  flow = client.flow_from_clientsecrets(secrets, scope=SCOPES)
  storage = file.Storage(CRED_FILE)
  credentials = tools.run_flow(flow, storage, flags)

if __name__ == '__main__':
  main(sys.argv)
