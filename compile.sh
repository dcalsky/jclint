#!/bin/bash

jison src/jcl.jison
cp src/jcl.js dist/
npm run test
