export function buildPrivacyPolicyPage(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Politique de confidentialité | DropOne</title>
  <style>
    :root {
      --text: #0c0d10;
      --muted: #5b616e;
      --light: #9aa0ac;
      --bg: #ffffff;
      --accent: #0a6bff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f5f5f7;
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
    }
    main {
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 20px 64px;
    }
    .card {
      background: var(--bg);
      border-radius: 20px;
      padding: 32px 28px;
      box-shadow: 0 8px 32px rgba(12, 13, 16, 0.06);
    }
    .brand {
      margin: 0 0 12px;
      color: var(--light);
      font-size: 14px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 28px;
      line-height: 1.25;
    }
    .updated {
      margin: 0 0 28px;
      color: var(--light);
      font-size: 14px;
    }
    h2 {
      margin: 28px 0 10px;
      font-size: 20px;
    }
    h3 {
      margin: 18px 0 8px;
      font-size: 16px;
    }
    p { margin: 0 0 12px; color: var(--muted); }
    ul {
      margin: 0 0 12px;
      padding-left: 20px;
      color: var(--muted);
    }
    li { margin-bottom: 6px; }
    a { color: var(--accent); word-break: break-word; }
    hr {
      border: none;
      border-top: 1px solid #e5e5ea;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <main>
    <article class="card">
      <p class="brand">DropOne</p>
      <h1>Politique de confidentialité - DropOne</h1>
      <p class="updated"><strong>Dernière mise à jour : 21 juillet 2026</strong></p>

      <h2>1. Introduction</h2>
      <p>La présente Politique de confidentialité décrit la manière dont <strong>MEGA - SN</strong> (« nous », « notre » ou « nos ») collecte, utilise, stocke et protège les données personnelles des utilisateurs de l'application <strong>DropOne</strong>.</p>
      <p>En utilisant DropOne, vous acceptez les pratiques décrites dans cette politique.</p>
      <hr />

      <h2>2. Responsable du traitement</h2>
      <p><strong>MEGA - SN</strong></p>
      <p>Site web : <a href="https://mega-sn.com">https://mega-sn.com</a></p>
      <p>E-mail : <a href="mailto:contact@mega-sn.com">contact@mega-sn.com</a></p>
      <hr />

      <h2>3. Données collectées</h2>
      <p>Selon votre utilisation de l'application, nous pouvons collecter les informations suivantes :</p>

      <h3>Informations de compte</h3>
      <ul>
        <li>Nom et prénom</li>
        <li>Adresse e-mail</li>
        <li>Numéro de téléphone</li>
        <li>Photo de profil</li>
      </ul>

      <h3>Informations professionnelles</h3>
      <ul>
        <li>Fonction ou poste</li>
        <li>Nom de l'entreprise</li>
        <li>Informations de l'équipe (pour les comptes Entreprise)</li>
      </ul>

      <h3>Informations de profil (facultatives)</h3>
      <ul>
        <li>Réseaux sociaux</li>
        <li>Portfolio</li>
        <li>Site web</li>
        <li>Informations de présentation</li>
      </ul>

      <h3>Authentification</h3>
      <p>Lorsque vous choisissez de vous connecter avec Google ou Apple, nous recevons uniquement les informations nécessaires à votre authentification conformément aux autorisations accordées.</p>

      <h3>Notifications</h3>
      <p>Nous utilisons les notifications push afin de vous informer notamment des nouvelles demandes, des mises à jour et des événements liés à votre compte.</p>
      <p>Vous pouvez désactiver ces notifications à tout moment depuis les paramètres de votre appareil.</p>

      <h3>Paiements</h3>
      <p>Pour les abonnements et achats, les paiements peuvent être réalisés via des prestataires tiers tels que Wave et Orange Money.</p>
      <p>Les informations bancaires ou de paiement ne sont jamais stockées par DropOne.</p>
      <hr />

      <h2>4. Utilisation des données</h2>
      <p>Vos données sont utilisées afin de :</p>
      <ul>
        <li>créer et gérer votre compte ;</li>
        <li>générer votre carte de visite numérique ;</li>
        <li>partager votre profil via QR Code, NFC ou lien ;</li>
        <li>gérer les équipes et entreprises ;</li>
        <li>permettre l'authentification sécurisée ;</li>
        <li>envoyer des notifications importantes ;</li>
        <li>traiter les abonnements et paiements ;</li>
        <li>améliorer les performances et la sécurité de l'application ;</li>
        <li>fournir une assistance utilisateur.</li>
      </ul>
      <hr />

      <h2>5. Partage des données</h2>
      <p>Nous ne vendons jamais vos données personnelles.</p>
      <p>Vos informations peuvent uniquement être partagées :</p>
      <ul>
        <li>avec les prestataires techniques nécessaires au fonctionnement de l'application ;</li>
        <li>avec les services d'authentification (Google ou Apple) lorsque vous utilisez ces modes de connexion ;</li>
        <li>avec les prestataires de paiement (Wave ou Orange Money) lors des transactions ;</li>
        <li>lorsque la loi l'exige.</li>
      </ul>
      <hr />

      <h2>6. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles destinées à protéger vos données contre tout accès non autorisé, toute perte, modification ou divulgation.</p>
      <p>Cependant, aucun système informatique ne peut garantir une sécurité absolue.</p>
      <hr />

      <h2>7. Conservation des données</h2>
      <p>Vos données sont conservées aussi longtemps que votre compte est actif ou aussi longtemps que nécessaire pour fournir les services proposés.</p>
      <p>Vous pouvez demander la suppression de votre compte à tout moment.</p>
      <hr />

      <h2>8. Vos droits</h2>
      <p>Vous pouvez à tout moment :</p>
      <ul>
        <li>consulter vos informations ;</li>
        <li>modifier votre profil ;</li>
        <li>demander la suppression de votre compte ;</li>
        <li>demander la suppression de vos données personnelles ;</li>
        <li>retirer votre consentement lorsque celui-ci est applicable.</li>
      </ul>
      <p>Pour toute demande, contactez-nous à : <a href="mailto:contact@mega-sn.com">contact@mega-sn.com</a></p>
      <hr />

      <h2>9. Services tiers</h2>
      <p>DropOne peut utiliser les services suivants :</p>
      <ul>
        <li>Google Sign-In</li>
        <li>Sign in with Apple</li>
        <li>Firebase Cloud Messaging (notifications push)</li>
        <li>Wave</li>
        <li>Orange Money</li>
      </ul>
      <p>Ces services disposent de leurs propres politiques de confidentialité.</p>
      <hr />

      <h2>10. Protection des enfants</h2>
      <p>DropOne n'est pas destiné aux enfants de moins de 13 ans.</p>
      <p>Nous ne collectons pas sciemment de données personnelles concernant des mineurs sans autorisation parentale lorsque celle-ci est requise.</p>
      <hr />

      <h2>11. Modifications</h2>
      <p>Nous pouvons modifier la présente Politique de confidentialité afin de tenir compte des évolutions légales, techniques ou fonctionnelles.</p>
      <p>La date de dernière mise à jour figurera toujours en haut de cette page.</p>
      <hr />

      <h2>12. Contact</h2>
      <p>Pour toute question relative à cette Politique de confidentialité ou à vos données personnelles, vous pouvez nous contacter :</p>
      <p><strong>MEGA - SN</strong></p>
      <p>Site : <a href="https://mega-sn.com">https://mega-sn.com</a></p>
      <p>E-mail : <a href="mailto:contact@mega-sn.com">contact@mega-sn.com</a></p>
    </article>
  </main>
</body>
</html>`;
}
