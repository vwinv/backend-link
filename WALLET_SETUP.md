# Configuration Wallet — Link

Ce guide décrit ce que **vous** devez faire pour activer l’ajout de carte dans **Apple Wallet** (iOS) et **Google Wallet** (Android).

Le code est déjà en place côté app et API. Sans ces prérequis, le bouton « Ajouter au Wallet » renverra une erreur de configuration.

---

## 1. Prérequis communs

### URL publique des cartes

Dans `backend-link/.env` :

```env
APP_PUBLIC_URL=https://votre-domaine.com
```

Cette URL est encodée dans le **QR code** du pass (ex. `https://votre-domaine.com/cards/mon-slug`).

### Images du pass Apple

Les fichiers suivants sont utilisés pour signer le `.pkpass` :

- `backend-link/wallet-assets/icon.png` (29×29 minimum recommandé)
- `backend-link/wallet-assets/logo.png`

Des icônes Link y sont déjà copiées ; remplacez-les par vos assets finaux si besoin.

### Dossier des certificats (ne pas committer)

```bash
mkdir -p backend-link/certs
```

Ajoutez `certs/` à `.gitignore` si ce n’est pas déjà fait.

---

## 2. Apple Wallet (iOS)

### Compte développeur

- Compte **Apple Developer Program** (99 €/an)
- Accès à [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources)

### Étapes Apple

1. **Créer un Pass Type ID**
   - Identifiers → **Pass Type IDs** → `+`
   - Exemple : `pass.com.megasn.link`
   - Notez cet identifiant → `APPLE_PASS_TYPE_ID`

2. **Récupérer votre Team ID**
   - Membership → **Team ID** (10 caractères) → `APPLE_TEAM_ID`

3. **Créer un certificat Pass Type ID**
   - Certificates → `+` → **Pass Type ID Certificate**
   - Sélectionnez votre Pass Type ID
   - Suivez l’assistant CSR (Keychain Access → Certificate Assistant → Request a Certificate)
   - Téléchargez le certificat `.cer`, double-cliquez pour l’importer dans Keychain

4. **Exporter les fichiers PEM**

   Sur macOS, le Trousseau **n’affiche pas toujours « .pem »** dans le menu Exporter. C’est normal : on exporte en `.cer` / `.p12`, puis on convertit avec `openssl`.

   **A. Trouver le bon certificat dans le Trousseau**
   - Ouvrir **Trousseau d’accès** (Keychain Access)
   - À gauche : trousseau **session** (login), pas « Système »
   - Catégorie : **Mes certificats**
   - Chercher une ligne du type : `Pass Type ID: pass.com.mega.dropone`
   - Cliquer sur le **triangle** à gauche : une **clé privée** doit apparaître en dessous  
     → Si pas de clé privée : le CSR a été fait sur un autre Mac ou la clé est perdue → refaire un certificat Pass depuis un nouveau CSR sur **ce** Mac.

   **B. Certificat Pass → `pass_certificate.pem`**

   Méthode simple (depuis le `.cer` Apple que vous avez déjà) :
   ```bash
   mkdir -p backend-link/certs
   openssl x509 -inform der -in ~/Downloads/pass.cer -out backend-link/certs/pass_certificate.pem
   ```
   Remplacez `~/Downloads/pass.cer` par le chemin réel de votre fichier `.cer` téléchargé depuis Apple Developer.

   **C. Clé privée → `pass_private_key.pem`**

   1. Dans le Trousseau : sous le certificat Pass, clic droit sur la **clé privée** → **Exporter « … »**
   2. Format proposé : **Personal Information Exchange (.p12)** — enregistrez `pass_key.p12` (mot de passe optionnel)
   3. Convertir en PEM :
   ```bash
   openssl pkcs12 -in pass_key.p12 -nocerts -out backend-link/certs/pass_private_key.pem -nodes
   ```
   Si vous aviez mis un mot de passe sur le `.p12`, `openssl` le demandera ; sinon appuyez sur Entrée.

   **D. Certificat Apple WWDR G4 → `AppleWWDRCAG4.pem`**

   Télécharger : https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer  
   (Le double-clic l’ajoute au Trousseau — c’est bien, mais le backend a besoin du fichier **PEM** sur disque.)
   ```bash
   openssl x509 -inform der -in AppleWWDRCAG4.cer -out backend-link/certs/AppleWWDRCAG4.pem
   ```

   **Vérification rapide**
   ```bash
   ls -la backend-link/certs/
   # attendu : pass_certificate.pem, pass_private_key.pem, AppleWWDRCAG4.pem
   ```

   **Vérification approfondie (fortement recommandée)** — détecte le piège classique où le mauvais fichier a été exporté :
   ```bash
   cd backend-link/certs
   # 1) Le cert Pass doit avoir "Pass Type ID: pass.xxx" comme sujet
   openssl x509 -in pass_certificate.pem -noout -subject
   # 2) Le WWDR doit avoir "Apple Worldwide Developer Relations..." comme sujet
   #    (PAS "Pass Type ID" — sinon vous avez exporté le mauvais fichier)
   openssl x509 -in AppleWWDRCAG4.pem -noout -subject
   # 3) Le cert et la clé doivent avoir le MÊME hash de modulus
   openssl x509 -in pass_certificate.pem -noout -modulus | openssl md5
   openssl rsa  -in pass_private_key.pem -noout -modulus | openssl md5
   ```
   Si `AppleWWDRCAG4.pem` affiche « Pass Type ID », re-téléchargez le vrai WWDR :
   ```bash
   curl -sSL -o AppleWWDRCAG4.cer https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer
   openssl x509 -inform der -in AppleWWDRCAG4.cer -out AppleWWDRCAG4.pem
   ```

5. **Variables `.env` backend**

```env
APPLE_TEAM_ID=ABCDE12345
APPLE_PASS_TYPE_ID=pass.com.megasn.link
APPLE_WWDR_CERT_PATH=./certs/AppleWWDRCAG4.pem
APPLE_PASS_SIGNER_CERT_PATH=./certs/pass_certificate.pem
APPLE_PASS_SIGNER_KEY_PATH=./certs/pass_private_key.pem
APPLE_PASS_SIGNER_KEY_PASSPHRASE=
```

6. **Déploiement Render (production)**

   Render ne versionne pas le dossier `certs/`. Il faut uploader les PEM en **Secret Files** et pointer les chemins vers `/etc/secrets/`.

   - Dashboard Render → service backend → **Environment** → **Secret Files** :
     - `pass_certificate.pem` (contenu de `certs/pass_certificate.pem`)
     - `pass_private_key.pem`
     - `AppleWWDRCAG4.pem`
     - `dropone-xxxx.json` (service account Google, si Google Wallet)
   - **Environment Variables** :
   ```env
   APPLE_TEAM_ID=3G878MZ2JV
   APPLE_PASS_TYPE_ID=pass.com.mega.dropone
   APPLE_WWDR_CERT_PATH=/etc/secrets/AppleWWDRCAG4.pem
   APPLE_PASS_SIGNER_CERT_PATH=/etc/secrets/pass_certificate.pem
   APPLE_PASS_SIGNER_KEY_PATH=/etc/secrets/pass_private_key.pem
   APPLE_PASS_SIGNER_KEY_PASSPHRASE=
   GOOGLE_WALLET_ISSUER_ID=<issuer id>
   GOOGLE_WALLET_SERVICE_ACCOUNT_PATH=/etc/secrets/dropone-xxxx.json
   GOOGLE_WALLET_ORIGINS=https://dropone.pro
   ```
   - **Save Changes** → Render redéploie automatiquement.

### Configuration Xcode (app Flutter iOS)

1. Ouvrir `link/ios/Runner.xcworkspace` dans Xcode
2. Cible **Runner** → **Signing & Capabilities**
3. **+ Capability** → **Wallet**
4. Cocher votre **Pass Type ID** (`pass.com.megasn.link`)
5. Builder et tester sur un **iPhone physique** (le simulateur ne gère pas toujours PassKit correctement)

### Test iOS

- Backend démarré avec les variables Apple renseignées
- App sur iPhone → créer une carte → **Ajouter au Wallet**
- Le sheet natif Apple Wallet doit s’ouvrir

---

## 3. Google Wallet (Android)

### Compte Google

- Compte [Google Pay & Wallet Console](https://pay.google.com/business/console)
- Demander l’accès **Google Wallet API** (mode test disponible pour le développement)

### Étapes Google

1. **Créer un émetteur (Issuer)**
   - Console → **Google Wallet API**
   - Notez l’**Issuer ID** (nombre long) → `GOOGLE_WALLET_ISSUER_ID`

2. **Classe Generic — créée automatiquement**
   - Aucune action manuelle : le backend inclut la définition de la classe **inline** dans le JWT « Save to Wallet ». Google la crée/insère à la volée au premier enregistrement.
   - Le backend utilise par défaut le suffixe `link_business_card`
   - Class ID final : `{ISSUER_ID}.link_business_card`
   - Vous pouvez changer le suffixe avec `GOOGLE_WALLET_CLASS_SUFFIX`

3. **Compte de service**
   - Google Cloud Console → **IAM & Admin** → **Service Accounts**
   - Créez un compte de service
   - Accordez le rôle **Google Wallet API Admin** (ou éditeur Wallet selon la doc Google)
   - Créez une clé **JSON** et enregistrez-la :
     `backend-link/certs/google-wallet-service-account.json`

4. **Lier le compte de service à la console Wallet**
   - Google Pay & Wallet Console → utilisateurs / accès API
   - Ajoutez l’email du compte de service (`...@....iam.gserviceaccount.com`) avec les droits d’édition

5. **Variables `.env` backend**

```env
GOOGLE_WALLET_ISSUER_ID=3388000000000000000
GOOGLE_WALLET_CLASS_SUFFIX=link_business_card
GOOGLE_WALLET_SERVICE_ACCOUNT_PATH=./certs/google-wallet-service-account.json
GOOGLE_WALLET_ORIGINS=https://link.app
```

### Test Android

- Backend configuré
- App sur appareil Android avec **Google Wallet** installé
- Créer une carte → **Ajouter au Wallet**
- Le navigateur / Google Wallet s’ouvre avec l’écran « Enregistrer »

---

## 4. API utilisée par l’app

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/v1/wallet/cards/:cardId/add` | Génère le pass (JWT auth) |
| `GET` | `/api/v1/wallet` | Liste les cartes enregistrées |
| `DELETE` | `/api/v1/wallet/:id` | Supprime l’entrée historique |

Body pour l’ajout :

```json
{
  "walletType": "APPLE_WALLET"
}
```

ou `"GOOGLE_WALLET"`. L’app choisit automatiquement selon la plateforme.

Réponse iOS :

```json
{
  "walletType": "APPLE_WALLET",
  "savedCardId": "...",
  "passBase64": "..."
}
```

Réponse Android :

```json
{
  "walletType": "GOOGLE_WALLET",
  "savedCardId": "...",
  "saveUrl": "https://pay.google.com/gp/v/save/..."
}
```

---

## 5. Dépannage

| Problème | Piste |
|----------|--------|
| « Apple Wallet n’est pas configuré » | Vérifier les chemins PEM dans `.env` et redémarrer le backend |
| Pass iOS refusé | Pass Type ID / Team ID / certificats incohérents ; capability Wallet absente dans Xcode |
| Google « save URL » ne s’ouvre pas | Google Wallet installé ? `queries` Android OK ? Issuer ID + service account |
| QR code incorrect | Mettre à jour `APP_PUBLIC_URL` |
| Simulateur iOS | Tester sur **appareil réel** |

---

## 6. Sécurité

- Ne **jamais** committer `certs/`, clés `.pem`, ni le JSON du compte de service Google
- En production, stocker les secrets dans un gestionnaire (Vault, AWS Secrets Manager, etc.)
- Restreindre `GOOGLE_WALLET_ORIGINS` à vos domaines réels
