#!/bin/bash
export NODE_ENV=development

if [ $NODE_ENV == production ]
  then node index
  else nodemon
fi