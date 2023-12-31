import json

import cv2
import requests
import time
from getmac import get_mac_address as gma
import tkinter as tk
from PIL import Image, ImageTk

# api url
api = 'http://localhost:5000'

# On récupère l'adresse mac de la machine
mac = gma()

# On créé la caméra a partir de la première caméra trouvée
cap = cv2.VideoCapture(0)

# On instance le lecteur de QRCOde
detector = cv2.QRCodeDetector()

# Création de l'interface utilisateur
root = tk.Tk()
root.attributes('-fullscreen', True)

# Charger l'image
image = Image.open("mns-fulllogo.png")
photo = ImageTk.PhotoImage(image)

# Créer un label pour l'image
image_label = tk.Label(root, image=photo)
image_label.pack()

# Créer les labels pour le texte
label = tk.Label(root, text="Démarrage de l'application", fg="black", font=("Helvetica", 36))
label.pack()

sublabel = tk.Label(root, text="", fg="black", font=("Helvetica", 36))
sublabel.pack()

root.update_idletasks()
root.update()

# On fait le première appel API pour récupérer la config de la machine
state = "get_config"
last_try = 0

# Déclarations de variables ésentielles
last_scanned = None
last_scanned_time = 0

while True:
    if state == "get_config":
        if time.time() - last_try > 60:
            try:
                response = requests.get(api + "/access/config/" + mac)
                response.raise_for_status()
                config = response.json()
                label.config(text='Bonjour, veuillez passer votre QR Code')
                state = "read_qr"
            except requests.exceptions.RequestException as e:
                print(f"Error: {e}")
                print("Retrying in 1 minute...")
                label.config(text='Erreur lors de la récupération de la configuration')
                sublabel.config(text='Appel api fait a : ' + api + "/access/config/" + mac)
                last_try = time.time()

    elif state == "read_qr":
        _, img = cap.read()
        data, bbox, _ = detector.detectAndDecode(img)

        if data:
            if last_scanned == data:
                if time.time() - last_scanned_time < 10:
                    continue

            last_scanned = data
            last_scanned_time = time.time()

            label.config(text=data)
            print(data)

        if time.time() - last_scanned_time > 5:
            label.config(text='Bonjour, veuillez passer votre QR Code')

    root.update_idletasks()
    root.update()
