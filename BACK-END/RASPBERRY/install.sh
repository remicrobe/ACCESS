#!/bin/bash

sudo apt-get update

sudo apt-get install python3-opencv

sudo apt-get install libqt4-test python3-sip python3-pyqt5 libqtgui4 libjasper-dev libatlas-base-dev -y

pip3 install opencv-contrib-python==4.1.0.25

sudo modprobe bcm2835-v4l2

pip install requests getmac tk pillow opencv-python

# Chemin absolu du script AccessLink_SCRIPT.py
SCRIPT_PATH=$(pwd)/launch.sh

# Ajout du script au fichier rc.local pour qu'il soit exécuté au démarrage
echo "sh $SCRIPT_PATH" >> /etc/rc.local

# Redémarrage du Raspberry Pi
sudo reboot
# Redémarrage du Raspberry Pi
sudo reboot
