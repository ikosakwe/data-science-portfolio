global.fetch = require("node-fetch");

const tf = require('@tensorflow/tfjs-node');

const d3 = require("d3")

const http = require('http');
const socketio = require('socket.io');

const PORT = 8001;

async function run() {
  const port = process.env.PORT || PORT;
  const server = http.createServer();
  const io = socketio(server);
  let order = ['G', 'MPG', 'RB', 'PPG', 'BLK', 'AST', 'STL', 'FG.', 'FT.',
    'FTr', 'WP', 'CWP', '1', '2', '3', '4', '5', '6', 'C', 'PF', 'PG', 'SF', 'SG',
  ];
  let format = d3.format(",.1%")


  server.listen(port, () => {
    console.log(`  > Running socket on port: ${port}`);
  });

  io.on('connection', async (socket) => {
    try {
      // load model
      const handler = tf.io.fileSystem('model.json');
      const model = await tf.loadLayersModel(handler);
      socket.on('test_data', async (value) => {
        // extract values in the right order for the model
        d = order.map((el) => value[el])
        // change data to tensor
        data = tf.tensor2d(d, [1, d.length])

        if (model) {
          if (data) {
            prob = await model.predict(data)

            prob = JSON.stringify(prob.asScalar().toString()).split(" ")

            prob = parseFloat(prob[prob.length - 1])
            console.log(prob);

            io.emit('prob', format(prob));
          }

        }

      })
    } catch (error) {
      console.log(error)
    }
  });




}

run();
