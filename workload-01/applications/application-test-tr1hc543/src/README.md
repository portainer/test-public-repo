# Notes

A simple note-taking web app in a single `index.html` file. Notes are saved in the browser's local storage, so they stay on the device and browser you use.

The container listens on port 8081 and is published on host port 8081.

## Run it in a container

With Docker Compose:

    docker compose up -d --build

Or with plain Docker:

    docker build -t notes-app .
    docker run -d -p 8081:8081 --name notes-app notes-app

Then visit http://localhost:8081.

If an older notes-app container is still running on 8080, remove it first:

    docker rm -f notes-app

## Run it without Docker

    python3 -m http.server 8081        # then visit http://localhost:8081
