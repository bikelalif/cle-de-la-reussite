// Script de déploiement automatique de la base de données Supabase (CommonJS)
// Ce script installe pg, se connecte à votre base de données Supabase et exécute schema.sql.

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// 1. Installation automatique de la dépendance pg si nécessaire
try {
  require.resolve('pg');
} catch (e) {
  console.log("🔌 Installation du client de base de données PostgreSQL (pg)...");
  execSync('npm install pg', { stdio: 'inherit' });
}

const { Client } = require('pg');

// 2. Lecture des informations Supabase depuis le fichier .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error("❌ Fichier .env introuvable. Veuillez d'abord configurer vos clés Supabase.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=https:\/\/([a-z0-9]+)\.supabase\.co/);

if (!urlMatch) {
  console.error("❌ Impossible de trouver la référence du projet Supabase dans le fichier .env.");
  process.exit(1);
}

const projectRef = urlMatch[1];
const defaultHost = `db.${projectRef}.supabase.co`;

console.log(`📡 Projet Supabase détecté : ${projectRef}`);

// 3. Demande de la Connection String ou du mot de passe
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n💡 Supabase utilise l'IPv6 par défaut pour les connexions directes.");
console.log("Si votre connexion internet ne supporte pas l'IPv6 (erreur ENETUNREACH),");
console.log("veuillez copier la chaîne de connexion (Connection String) en mode 'Transaction' ou 'Session' depuis Supabase.");
console.log("Cette chaîne utilise un pooler IPv4 compatible.\n");

rl.question('🔗 Collez votre Connection String (URI postgresql://...) OU entrez simplement votre mot de passe : ', (input) => {
  rl.close();
  
  if (!input) {
    console.error("❌ Entrée vide.");
    process.exit(1);
  }

  if (input.startsWith('postgresql://') || input.startsWith('postgres://')) {
    runMigrationWithConnectionString(input);
  } else {
    runMigrationWithPassword(input);
  }
});

// 4a. Exécution via Connection String directe (recommandé pour IPv4)
async function runMigrationWithConnectionString(connectionString) {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Fichier schema.sql introuvable.");
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("\n⚡ Connexion à PostgreSQL via Connection String...");
    await client.connect();
    console.log("✅ Connexion établie avec succès !");

    console.log("⚙️ Exécution des requêtes SQL de schema.sql...");
    await client.query(sql);
    console.log("🎉 Migration terminée avec succès ! Toutes les tables sont créées et la sécurité RLS est désactivée.");

  } catch (error) {
    console.error("\n❌ Erreur lors de l'exécution SQL :");
    console.error(error.message);
  } finally {
    await client.end();
  }
}

// 4b. Exécution via Hôte par défaut + Mot de passe (IPv6 direct)
async function runMigrationWithPassword(dbPassword) {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Fichier schema.sql introuvable.");
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = new Client({
    host: defaultHost,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log(`\n⚡ Connexion à PostgreSQL en cours sur ${defaultHost} (IPv6)...`);
    await client.connect();
    console.log("✅ Connexion établie avec succès !");

    console.log("⚙️ Exécution des requêtes SQL de schema.sql...");
    await client.query(sql);
    console.log("🎉 Migration terminée avec succès ! Toutes les tables sont créées et la sécurité RLS est désactivée.");

  } catch (error) {
    console.error("\n❌ Erreur de connexion ou d'exécution SQL :");
    console.error(error.message);
    if (error.message.includes('ENETUNREACH')) {
      console.log("\n💡 Conseil : Votre réseau ne supporte pas l'IPv6. Veuillez relancer ce script et coller votre 'Connection String' de Supabase (qui utilise un hôte IPv4).");
    }
  } finally {
    await client.end();
  }
}
