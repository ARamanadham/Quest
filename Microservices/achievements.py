import zmq
import json

def calculate_achievements(quests):
    total_quests = len(quests)
    completed_quests = sum(1 for quest in quests if quest.get('completed', False))
    high_priority_completed = sum(1 for quest in quests if quest.get('completed', False) and quest.get('priority') == 'high')

    achievements = [
        {
            "name": "First Quest",
            "description": "Complete your first quest",
            "progress": completed_quests,
            "target": 1
        },
        {
            "name": "Quest Beginner",
            "description": "Complete 10 quests",
            "progress": completed_quests,
            "target": 10
        },
        {
            "name": "Quest Intermediate",
            "description": "Complete 50 quests",
            "progress": completed_quests,
            "target": 50
        },
        {
            "name": "High Priority Hero",
            "description": "Complete 20 high priority quests",
            "progress": high_priority_completed,
            "target": 20
        },
        {
            "name": "Professional Quest Planner",
            "description": "Create 100 quests",
            "progress": total_quests,
            "target": 100
        },
        {
            "name": "Quest Master",
            "description": "Complete 100 quests",
            "progress": completed_quests,
            "target": 100
        }
    ]
    return achievements

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://127.0.0.1:5603")

print("Achievement service started...")

while True:
    message = socket.recv_json()
    if message['action'] == 'getAchievements':
        achievements = calculate_achievements(message['quests'])
        socket.send_json({"achievements": achievements})