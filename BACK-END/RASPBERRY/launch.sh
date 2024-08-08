#!/bin/bash

# Obtenir le répertoire où se trouve ce script
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Exécuter le script Python dans ce même répertoire
python3 "$SCRIPT_DIR/AccessLink_SCRIPT.py"
