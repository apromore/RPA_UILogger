#!/bin/sh
npm install --prefix Excel_Addin

(npm start --prefix Excel_Addin & npm start --prefix append_http)
