#!/bin/sh
npm install --prefix Excel_Addin

echo "Please provide your user ID:"

read userID

echo "Starting action logger with userID: $userID"

(npm start --prefix Excel_Addin & npm start $userID --prefix append_http)
