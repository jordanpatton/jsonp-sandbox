# JSONP Sandbox

### Installation (requires [node](https://nodejs.org))

```bash
# install the sandbox
git clone https://github.com/jordanpatton/jsonp-sandbox.git
cd jsonp-sandbox
npm install

# start the server
node server.js

# start the client (in new terminal session)
node client.js
```

### Usage

1. Open the [client](http://localhost:3001).
2. Open your browser console and inspect your network traffic.
3. Click the `Request` button.

### Expected Results

The following things will happen _very_ quickly when you click `Request`:

1. Browser adds a `script` node to the DOM.
2. Browser requests a cross-origin file from the [server](http://localhost:3000/dynamic.js).
3. Server generates the script dynamically.
4. Browser loads the generated script.
5. Browser parses the generated script and invokes the embedded callback.
6. Browser inserts the result in the lower `textarea`.
7. Browser removes the `script` node from the DOM.

It's likely this will happen so quickly that you won't even see the DOM transform.

### Questions

**Q:** Why would I ever use this?

**A:** JSONP provides a viable alternative to cross-origin resource sharing.
