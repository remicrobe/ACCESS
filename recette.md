### 1. **Plan de Test**

#### 1.1. **Objectifs du plan de test**
Le plan de test vise à s'assurer que l'application ACCESS (comprenant les parties front-end, back-end, et balises) fonctionne conformément aux exigences fonctionnelles et techniques définies. Il doit vérifier que le système répond aux besoins de sécurité, de gestion des accès et du temps de travail tout en garantissant une bonne expérience utilisateur.

#### 1.2. **Périmètre des tests**
- **Tests fonctionnels** : S'assurer que toutes les fonctionnalités clés de l'application sont opérationnelles.
- **Tests de sécurité** : Vérifier que toutes les mesures de sécurité (authentification, chiffrement, journalisation) sont bien en place.
- **Tests de performance** : Vérifier les temps de réponse du système, la robustesse sous charge, et l'efficacité du code.
- **Tests de compatibilité** : S'assurer que l'application fonctionne sur les différentes plateformes (mobile iOS/Android, site web) et navigateurs.
- **Tests API** : Vérifier l'intégrité et le bon fonctionnement des points d’API entre les différentes parties de l'application.

#### 1.3. **Stratégie de test**
Les tests seront divisés en plusieurs phases :
- **Tests unitaires** : Chaque composant du front-end, back-end, et des balises sera testé individuellement.
- **Tests d'intégration** : S'assurer que les différents modules communiquent correctement entre eux (notamment via l'API).
- **Tests de bout en bout** : Simuler des scénarios d'utilisation complets, du login utilisateur à l'enregistrement des accès.
- **Tests de charge** : Tester la réponse du système sous un grand nombre de requêtes simultanées.

#### 1.4. **Scénarios de test (exemples)**
- **Connexion utilisateur** : Tester les scénarios de login pour les différents types d’utilisateurs (collaborateur, RH, admin).
- **Gestion des absences** : Soumettre et gérer des demandes d'absences sur mobile et web, vérifier les validations et les emails de notifications.
- **Génération de QR code** : Vérifier que les QR codes générés permettent l’accès aux zones définies.
- **Incident et historique des accès** : Tester la gestion des incidents d'accès et la visualisation des historiques.

#### 1.5. **Outils et environnements de test**
- Outil de test unitaire : **Testim** (enregistrant les scénarios de test).
- Outils de vérification du code : **SonarCloud** et **ESLint**.
- Environnement : **Serveur Heroku**, **MySQL sur AWS**, **mobile React Native** pour les tests mobiles.

### 2. **Cahier de Recette**

#### 2.1. **Objectif de la recette**
La recette vise à valider la conformité de l’application ACCESS en fonction des exigences fonctionnelles et techniques avant sa mise en production. Elle valide également la qualité globale du système.

#### 2.2. **Critères d'acceptation**
Chaque fonctionnalité sera validée en fonction des critères suivants :
- Fonctionnalité : La fonctionnalité doit être pleinement opérationnelle.
- Performance : Les performances du système (temps de réponse, stabilité sous charge) doivent être dans les limites acceptables.
- Sécurité : Toutes les failles de sécurité doivent être corrigées avant la mise en production.
- Compatibilité : L’application doit être compatible sur toutes les plateformes et navigateurs définis.

#### 2.3. **Détail des tests de recette (exemples)**

| Fonctionnalité                        | Description                           | Résultat attendu                                      | Testeur | Statut |
|---------------------------------------|---------------------------------------|------------------------------------------------------|---------|--------|
| Connexion utilisateur                 | Tester la connexion pour chaque type de rôle utilisateur (admin, RH, collaborateur) | Connexion réussie, accès aux droits spécifiques | Tess F.  | À tester |
| Soumission et gestion d'absences      | Soumettre une demande d'absence, l’approuver ou la refuser | L’absence est soumise et notifiée par email | Rémi W. | À tester |
| Génération de QR Code                 | Générer un QR code pour un accès rapide à une zone | QR code généré et valide pendant une durée limitée | Tess F.  | À tester |
| Affichage des incidents et historique | Visualiser les incidents et historiques d’accès | Liste complète et correcte des incidents et des accès | Rémi W. | À tester |
| Sécurisation API                      | Test des points d’API pour les échanges de données | Accès sécurisé avec JWT, protection contre CORS | Tess F.  | À tester |
