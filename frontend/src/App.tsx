import React, { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Container, Stack, Typography } from "@mui/material";
import { ConnectionState } from "./components/websocket/ConnectionState";
import { ClockScreen } from "./ClockScreen";
import { batch, useDispatch } from "react-redux";
import { clockActions } from "./store/clock.slice";

const socketUrl = "ws://127.0.0.1:8888";

export const App = () => {
  const dispatch = useDispatch();

  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const newData = lastMessage.data;
      try {
        const json = JSON.parse(newData);
        if (json["topic"] && json["payload"]) {
          if (json["topic"] === "timestamp") {
            dispatch(clockActions.setTimestamp(json["payload"]));
          }
          if (json["topic"] === "alarm") {
            batch(() => {
              dispatch(clockActions.addAlarm(json["payload"]["alarm"]));
              dispatch(clockActions.setTimestamp(json["payload"]["timestamp"]));
            });
          }
        }
      } catch (error) {
        throw Error("data can not be parse");
      }
    }
  }, [lastMessage]);

  const sendFormattedMessage = (topic: string, payload: Record<string, unknown>) =>
    sendMessage(JSON.stringify({ topic, payload }));

  return (
    <Container>
      <Stack alignItems="center" gap={2}>
        <Typography variant="h3">Volta medical clock</Typography>
        <ConnectionState state={readyState} />

        {readyState === ReadyState.OPEN && <ClockScreen sendMessage={sendFormattedMessage} />}
      </Stack>
    </Container>
  );
};
