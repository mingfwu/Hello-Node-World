WARNING: This is a quick/dirty/hack experimental code!
------------------------------------------------------

Description
-----------
The code counts the selected interactions from a Datasift stream and presents them in a simple bar chart format, updating in real-time.

For example, you may wish to plot the "source" or "gender" of each tweet against the volume.

Uses the Datasift Node.js consumer, jQuery, socket.io and includes an option to save each interaction to MongoDB.

Setup
-----
1. Using npm, install the datasift Node.js consumer, along with the other required libs (socket.io, path and fss - see example.js)
2. Setup your DataSift username and api key in example.js.
3. Amend the stream id as required in example.js
4. Start example.js using node
5. Access index.html. Recommend WebSocket enabled browser e.g. Chrome.


![Screenshot](https://raw.github.com/haganbt/Datasift-Interaction-Counter/master/screen-shot.png)