import React, { useEffect } from "react";

function App() {

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");

    socket.onopen = () => {
      console.log("WebSocket connection opened.");
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              event.data.arrayBuffer()
                .then((buffer) => {
                  console.log(`Sending ${buffer.byteLength} bytes of data`);
                  socket.send(buffer);
                })
                .catch((error) => {
                  console.error("Error reading data as ArrayBuffer:", error);
                });
            }
          };

          mediaRecorder.start(1000);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Recording audio...</h1>
    </div>
  );
}

export default App;
