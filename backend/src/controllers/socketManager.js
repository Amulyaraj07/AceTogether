// import { Server } from "socket.io";

// let connections = {};
// let messages = {};
// let timeOnLine = {};

// export const connectToSocket = (server) => {
//   const io = new Server(server, {
//     //to remove cors error
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["*"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     //callback when a new client connects

//     console.log("SOMETHING CONNECTED");
//     socket.on("join-call", (path) => {
//       if (connections[path] === undefined) {
//         connections[path] = [];
//       }
//       connections[path].push(socket.id);
//       timeOnLine[socket.id] = Date.now();

//       connections[path].forEach((elem) => {
//         io.to(elem);
//       });

//       for (let a = 0; a < connections[path].length; a++) {
//         io.to(connections[path][a]).emit(
//           "user-joined",
//           socket.id,
//           connections[path]
//         );
//       }
//     });

//     socket.on("signal", (toId, message) => {
//       io.to(toId).emit("signal", socket.id, message);
//     });

//     socket.on("chat-message", (data, sender) => {
//       const [matchingRoom, found] = Object.entries(connections).reduce(
//         ([room, isFound], [roomKey, roomValue]) => {
//           if (!isFound && roomValue.includes(socket.id)) {
//             return [roomKey, true];
//           }
//           return [room, isFound];
//         },
//         ["", false]
//       );

//       if (found === true) {
//         if (messages[matchingRoom] === undefined) {
//           messages[matchingRoom] = [];
//         }
//         messages[matchingRoom].push({
//           sender: sender,
//           message: data,
//           "socket-id-sender": socket.id,
//         });
//         console.log("message", key, ":", sender, data);

//         connections[matchingRoom].forEach((elem) => {
//           io.to(elem).emit("chat-message", data, sender, socket.id);
//         });
//       }
//     });

//     socket.on("disconnect", () => {
//       var diffTime = Math.abs(timeOnLine[socket.id] - new Date());

//       var key;
//       //k->matching room , v-> kitne room
//       for (const [k, v] of JSON.parse.stringify(Object.entries(connections))) {
//         for (let a = 0; a < v.length; ++a) {
//           if (v[a] === socket.id) {
//             //any user is leaving the session
//             key = k;

//             for (let a = 0; a < connections[key].length; ++a) {
//               io.to(connections[key][a]).emit("user-left", socket.id); //emit user-left
//             }

//             var index = connections[key].indexOf(socket.id); //curr room

//             connections[key].splice(index, 1);

//             if (connections[key].length === 0) {
//               //curr room is empty
//               delete connections[key];
//             }
//           }
//         }
//       }
//     });
//   });

//   return io;
// };

import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnLine = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED");

    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnLine[socket.id] = Date.now();

      connections[path].forEach((elem) => {
        io.to(elem);
      });

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );

      if (found) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          message: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnLine[socket.id] - new Date());
      var key;

      for (const [k, v] of Object.entries(connections)) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let b = 0; b < connections[key].length; ++b) {
              io.to(connections[key][b]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);
            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
            break;
          }
        }
      }
    });
  });

  return io;
};
