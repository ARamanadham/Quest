const zmq = require("zeromq")
const WebSocket = require('ws')

async function run() {
    const zmqSocketGen = new zmq.Request()
    await zmqSocketGen.connect("tcp://127.0.0.1:5600")

    const zmqSocketStats = new zmq.Request()
    await zmqSocketStats.connect("tcp://127.0.0.1:5601")

    const zmqSocketDateTime = new zmq.Request()
    await zmqSocketDateTime.connect("tcp://127.0.0.1:5602")

    const zmqSocketAchievements = new zmq.Request()
    await zmqSocketAchievements.connect("tcp://127.0.0.1:5603")

    const wss = new WebSocket.Server({ port: 8080 })

    wss.on('connection', function connection(ws) {
        ws.on('message', async function incoming(message) {
            try {
                const data = JSON.parse(message)
                let result;
                // Microservice B
                if (data.action === 'getStats') {
                    await zmqSocketStats.send(JSON.stringify(data))
                    result = await zmqSocketStats.receive()
                } 
                // Microservice C
                else if (data.action === 'getCurrentDateTime') {
                    await zmqSocketDateTime.send(JSON.stringify(data))
                    result = await zmqSocketDateTime.receive()
                } 
                // Microservice D
                else if (data.action === 'getAchievements'){
                    await zmqSocketAchievements.send(JSON.stringify(data))
                    result = await zmqSocketAchievements.receive()
                } else {
                    await zmqSocketGen.send(message)
                    result = await zmqSocketGen.receive()
                }
                ws.send(result.toString())
            } catch (error) {
                console.error('Error:', error)
                ws.send(JSON.stringify({ error: 'An error occurred' }))
            }
        })
    })

    console.log("Bridge server running on ws://localhost:8080")
}

run()