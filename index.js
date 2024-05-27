const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Almacena la preferencia de idioma para cada cliente
const clients = new Map();

wss.on("connection", (ws, req) => {
  const urlParams = new URLSearchParams(req.url.slice(1)); // Eliminar la primera barra "/"
  const language = urlParams.get("lang") === "es" ? "es" : "en"; // Ejemplo usando URL query

  // Almacenar el WebSocket con su idioma preferido
  clients.set(ws, language);

  ws.on("message", (message) => {
    // Asegurarnos de que el mensaje es una cadena
    let msg = message;
    if (typeof message !== "string") {
      msg = message.toString();
    }
    console.log(`Received: ${msg}`);

    // Enviar el mensaje a todos los clientes conectados en su idioma preferido
    clients.forEach((lang, client) => {
      if (client.readyState === WebSocket.OPEN) {
        const translatedMessage = translateMessage(msg, lang);
        client.send(translatedMessage);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

const translateMessage = (message, lang) => {
  // Implementar la lógica de traducción
  const translations = {
    hola: { en: "hi", es: "hola" },
    hello: { en: "hello", es: "hola" },
    hi: { en: "hi", es: "hola" },
    // Añade más traducciones según sea necesario
  };

  const lowerMessage = message.toLowerCase();
  const translatedMessage = translations[lowerMessage]
    ? translations[lowerMessage][lang]
    : message;
  return translatedMessage;
};

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
