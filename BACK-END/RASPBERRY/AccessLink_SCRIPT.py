import json
import os

import cv2
import requests
import time
from getmac import get_mac_address as gma
import tkinter as tk
from PIL import Image, ImageTk

# api url
api = 'https://api.access-link.tech'

# On récupère l'adresse mac de la machine
mac = gma()

# On créé la caméra a partir de la première caméra trouvée
cap = cv2.VideoCapture(0)

# On instance le lecteur de QRCOde
detector = cv2.QRCodeDetector()

# Création de l'interface utilisateur
root = tk.Tk()
root.attributes('-fullscreen', True)

# Obtenir le chemin du répertoire où se trouve le script
script_dir = os.path.dirname(os.path.realpath(__file__))

# Charger l'image en utilisant un chemin absolu basé sur le répertoire du script
image_path = os.path.join(script_dir, "mns-fulllogo.png")
image = Image.open(image_path)
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
                servicesAutorise = config['serviceAutorise']
                collabAutorise = config['collabAutorise']
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

            elements = data.split(";")
            print(elements)

            parse_data = {}
            for element in elements:
                key, value = element.split(":")
                parse_data[key] = value

            # Ici on va faire une requête API pour vérifier si le collaborateur est autorisé a accéder au point
            try:
                response = requests.get(api + "/access/check/" + parse_data['token'] + "/" + mac)
                response.raise_for_status()
                collabInfo = response.json()
                nom = collabInfo.get('nom')
                prenom = collabInfo.get('prenom')
                label.config(text=f'Bienvenue {prenom} {nom}!')
            except requests.exceptions.RequestException as e:
                if e.response is not None:
                    if 404 == e.response.status_code:
                        label.config(text='Erreur ...')
                        sublabel.config(text='Votre carte d\'accès n\'est pas reconue par le système')
                else:
                    print(f"Error: {e}")
                    label.config(text='Mode hors ligne ...')
                    for collab in collabAutorise:
                        idCollab = int(parse_data['idCollab'])
                        print("collab['id']:", collab['id'], type(collab['id']))
                        print("parse_data['idCollab']:", idCollab, type(idCollab))

                        if collab['id'] == idCollab:
                            sublabel.config(text='Accès autorisé')
                            break
                        else:
                            sublabel.config(text='Accès non autorisé')
                    
                last_try = time.time()

            print(data)

        if time.time() - last_scanned_time > 5:
            label.config(text='Bonjour, veuillez passer votre QR Code')

    root.update_idletasks()
    root.update()
