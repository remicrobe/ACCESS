import json
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

# On créé la caméra à partir de la première caméra trouvée
cap = cv2.VideoCapture(0)

# On instancie le lecteur de QRCode
detector = cv2.QRCodeDetector()

# Création de l'interface utilisateur principale
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

# Création d'une nouvelle fenêtre pour afficher la vidéo
video_window = tk.Toplevel(root)
video_window.title("Camera Feed")
video_label = tk.Label(video_window)
video_label.pack()

def update_video():
    _, frame = cap.read()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame)
    imgtk = ImageTk.PhotoImage(image=img)
    video_label.imgtk = imgtk
    video_label.configure(image=imgtk)
    video_window.after(10, update_video)  # Mise à jour toutes les 10 ms

# Démarrer la mise à jour de la vidéo
update_video()

# On fait le premier appel API pour récupérer la config de la machine
state = "get_config"
last_try = 0

# Déclarations de variables essentielles
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
                sublabel.config(text='Appel API fait à : ' + api + "/access/config/" + mac)
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

            # Requête API pour vérifier si le collaborateur est autorisé à accéder au point
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
                        sublabel.config(text='Votre carte d\'accès n\'est pas reconnue par le système')
                else:
                    print(f"Error: {e}")
                    label.config(text='Mode hors ligne ...')
                    for collab in collabAutorise:
                        idCollab = int(parse_data['idCollab'])
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
