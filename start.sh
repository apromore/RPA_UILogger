#!/bin/sh
npm install --prefix Excel_Addin
npm install --prefix append_http
(npm start --prefix Excel_Addin & npm start --prefix append_http)
