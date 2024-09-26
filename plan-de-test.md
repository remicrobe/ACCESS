# 📝 Plan de Test

### 🛠️ **Back-End Tests**  

| **Nom du Test (Route)**                | **Description**                                                       | **Réalisé par** | **Date**        | **État**          |
|----------------------------------------|-----------------------------------------------------------------------|----------------|----------------|------------------|
| `/absence/my/export`                   | Tester l'exportation des absences sous contrôle en fichier Excel.      | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/absence/my/{page}/{itemsParPage}`     | Tester la récupération des absences paginées sous contrôle.            | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/absence/mesAbsences`                 | Tester la récupération de mes absences.                                | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/absence/creerUneAbsence/{idcollab}`   | Tester la création d'une absence pour un collaborateur.                | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/modifierAbsence/{absenceId}`          | Tester la modification d'une absence.                                  | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/access/creerAccess`                  | Tester la création d'un nouveau point d'accès.                         | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/access/listeAccess`                  | Tester la récupération de la liste des points d'accès.                 | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/collab/creerCollab`                  | Tester la création d'un nouveau collaborateur.                         | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/collab/infoCollab`                   | Tester la récupération des informations du collaborateur connecté.     | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/historique/me`                       | Tester la récupération de l'historique personnel du collaborateur.     | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/incident/{id}`                       | Tester la récupération d'un incident par ID.                           | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/presence/mesPresences`               | Tester la récupération des présences du collaborateur.                 | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/service/creerService`                | Tester la création d'un service.                                       | Rémi W         | 2024-09-26      | ✅ Succès          |
| `/token/genererCarteQrCode/{collabId}` | Tester la génération d'un QR Code pour un collaborateur.               | Rémi W         | 2024-09-26      | ✅ Succès          |

### 💻 **Front-End Tests**  

| **Nom du Test (Action Utilisateur)**   | **Description**                                                   | **Réalisé par** | **Date**        | **État**         |
|----------------------------------------|-------------------------------------------------------------------|----------------|----------------|-----------------|
| **Test Export Absence**                | Vérifier que l'utilisateur peut exporter la liste des absences.    | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Connexion Collaborateur**            | Tester la connexion à l'application avec email et mot de passe.    | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Modifier Absence**                   | Tester la modification d'une absence via l'interface.              | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Création Point d'accès**             | Vérifier que l'utilisateur peut créer un point d'accès.            | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Générer QR Code**                    | Tester la génération du QR code d'un collaborateur.                | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Ajouter Message Incident**           | Tester l'ajout d'un message à un incident depuis l'interface.      | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Récupérer Liste Services**           | Vérifier la récupération de la liste de services dans l'interface. | Rémi W         | 2024-09-26      | ✅ Succès         |
| **Visualiser Historique**              | Vérifier que l'historique est bien affiché pour l'utilisateur.     | Rémi W         | 2024-09-26      | ✅ Succès         |
