import zmq
import json
from datetime import datetime

def calculate_stats(quests):
    if not quests:
        return {"avgQuestPerDay": 0, "avgTimePerQuest": 0}

    total_quests = len(quests)
    total_time = sum(quest.get('timeTaken', 0) for quest in quests)
    
    # Calculate date range
    dates = [datetime.strptime(quest.get('completedDate', ''), '%m/%d/%Y') for quest in quests if quest.get('completedDate')]
    if dates:
        date_range = (max(dates) - min(dates)).days + 1
    else:
        date_range = 1

    avg_quests_per_day = total_quests / date_range
    avg_time_per_quest = total_time / total_quests if total_quests > 0 else 0

    return {
        "avgQuestPerDay": avg_quests_per_day,
        "avgTimePerQuest": avg_time_per_quest
    }

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://127.0.0.1:5601")

print("Statistics service started...")

while True:
    message = socket.recv_json()
    if message['action'] == 'getStats':
        stats = calculate_stats(message['quests'])
        socket.send_json(stats)