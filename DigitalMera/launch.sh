#!/bin/bash

echo 'Activating miniconda environment'
source ~/miniconda3/bin/activate
echo 'Initializing all virtual envs'
conda init -all
echo ''
echo 'Starting up local (python) http test server'
python3 -m http.server
