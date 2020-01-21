# Meraki-Teams-Hooks

This web service will interpret webhooks from Meraki Dashboard and post them to a Webex Teams space.

How to use:

- Go to https://apphub.webex.com/teams/applications/incoming-webhooks-cisco-systems 
- Activate the app and create a webhook tied to the space where you want the alerts.
- Clone this repository and cd into the root directory.
- Fill in the Teams hooks URL, a secret key, and your Meraki Org ID in api/routes/index.js.
- Run 'docker build . -t merakiteams'
- Run 'docker-compose up -d' to start the containers daemonized.
- Use Nginx or Traefik (or some other proxy) to create an SSL frontend.
- On the Meraki Dashboard, setup a Webhooks HTTP server using the URL to your proxy. (https://your.url/api/hooks)
- Enter the key that you used in the api/routes/index.js file.
- Test the connection. If successful, save.
- Add the webhooks server to any alerts that you want to recieve. Save.
