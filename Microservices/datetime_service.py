import zmq
import json
from datetime import datetime

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://127.0.0.1:5602")

print("DateTime service started...")

while True:
    message = socket.recv_json()
    if message['action'] == 'getCurrentDateTime':
        current_datetime = datetime.now().isoformat()
        socket.send_json({"datetime": current_datetime})