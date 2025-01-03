from pprint import pprint
import time
import json
import zmq
from get_username import get_username
from get_password import get_password


def main():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://127.0.0.1:5600")
    print("Server started, waiting for requests...", flush=True)
    try:
        while True:
            if socket.poll(1000):
                print("Received a request...", flush=True)
                response = socket.recv().decode('utf-8')
                time.sleep(1)
                data = json.loads(response)
                pprint(f"Decoded JSON: {data}")
                username = ''
                password = {}
                if 'username' in data and data['username']:
                    print('Generating a username...')
                    username = get_username()
                if 'password' in data and isinstance(data['password'], dict):
                    if data['password']['generatePassword']:
                        pw = data['password']
                        print('Generating a password')
                        password = get_password(
                            pw['length'], pw['uppercase'], pw['lowercase'], pw['special'], pw['numbers'])

                result = {
                    "username": username,
                    "password": password
                }

                result_json = json.dumps(result)
                socket.send(result_json.encode('utf-8'))
                print("Response sent...", flush=True)

    except KeyboardInterrupt:
        print("Generator is shutting down")
    finally:
        socket.close()
        print("Socket Closed")


if __name__ == "__main__":
    main()
