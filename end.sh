#!/bin/sh
kill $(lsof -t -i :8080)
kill $(lsof -t -i :3000)
