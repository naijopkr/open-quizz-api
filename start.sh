#!/bin/bash
if [ $NODE_ENV == production ]
  then node index
  else nodemon
fi