import asyncio
import time
import websockets
import json
import sched
import threading

time_offset = 2
scheduler = sched.scheduler(time.time, time.sleep)


async def send_message(websocket, topic, payload):
    data = {
        "topic": topic,
        "payload": payload,
        }
    await websocket.send(json.dumps(data))

def send_alarm(websocket,alarm):
    now = time.time()
    data = {
        "alarm": alarm,
        "timestamp": now 
    }
    asyncio.run(send_message(websocket, "alarm", data))


async def handler(websocket, path):
    while True:
        listener_task = asyncio.ensure_future(websocket.recv())
        producer_task = asyncio.ensure_future(asyncio.sleep(1))
        done, pending = await asyncio.wait(
            [listener_task, producer_task],
            return_when=asyncio.FIRST_COMPLETED)


        if listener_task in done:
            message = listener_task.result()
            message_json = json.loads(message)
            topic = message_json["topic"]
            if topic == "alarm":
                new_alarm = message_json["payload"]["alarm"]
                alarm_timestamp_with_offset = new_alarm["timestamp"] + (new_alarm["timezoneOffset"] - time_offset)*60*60
                scheduler.enterabs(alarm_timestamp_with_offset, 1, send_alarm,(websocket, new_alarm,))

                t = threading.Thread(target=scheduler.run)
                t.start()
        else:
            listener_task.cancel()


        if producer_task in done:
            now = time.time()
            await send_message(websocket,"timestamp", now)
        else:
            producer_task.cancel()

      



start_server = websockets.serve(handler, "127.0.0.1", 8888)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()