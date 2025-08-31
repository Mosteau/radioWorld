#!/usr/bin/env node

/**
 * Script de nettoyage pour supprimer les éléments de test et debug
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Fichiers et dossiers à nettoyer
const itemsToClean = [
  // Logs et fichiers temporaires
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  '.DS_Store',
  'Thumbs.db',
  
  // Fichiers de test
  '**/*.test.js',
  '**/*.spec.js',
  'test/',
  '__tests__/',
  
  // Fichiers de développement
  '.vscode/settings.json',
  '.idea/',
  
  // Cache et builds temporaires
  '.cache/',
  'dist/',
  'build/',
  'node_modules/.cache/',
];

// Patterns de code à nettoyer dans les fichiers
const codePatterns = [
  // Console logs
  /console\.(log|debug|info|warn|error)\([^)]*\);?\s*\n?/g,
  
  // Commentaires de debug
  /\/\/ TODO:.*\n/g,
  /\/\/ FIXME:.*\n/g,
  /\/\/ DEBUG:.*\n/g,
  
  // Lignes vides multiples
  /\n\s*\n\s*\n/g,
];

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Appliquer les patterns de nettoyage
    codePatterns.forEach(pattern => {
      if (pattern === /\n\s*\n\s*\n/g) {
        content = content.replace(pattern, '\n\n');
      } else {
        content = content.replace(pattern, '');
      }
    });
    
    // Sauvegarder seulement si le contenu a changé
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Nettoyé: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors du nettoyage de ${filePath}:`, error.message);
    return false;
  }
}

function cleanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    let cleanedFiles = 0;
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Ignorer node_modules et .git
        if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
          cleanedFiles += cleanDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        // Nettoyer les fichiers JS, JSX, TS, TSX
        if (/\.(js|jsx|ts|tsx)$/.test(item)) {
          if (cleanFile(itemPath)) {
            cleanedFiles++;
          }
        }
      }
    });
    
    return cleanedFiles;
  } catch (error) {
    console.error(`❌ Erreur lors du nettoyage du dossier ${dirPath}:`, error.message);
    return 0;
  }
}

function removeTestFiles() {
  const srcPath = path.join(projectRoot, 'src');
  let removedFiles = 0;
  
  function scanAndRemove(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanAndRemove(itemPath);
        } else if (stat.isFile()) {
          // Supprimer les fichiers de test
          if (/\.(test|spec)\.(js|jsx|ts|tsx)$/.test(item)) {
            fs.unlinkSync(itemPath);
            console.log(`🗑️  Supprimé: ${itemPath}`);
            removedFiles++;
          }
        }
      });
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression dans ${dirPath}:`, error.message);
    }
  }
  
  if (fs.existsSync(srcPath)) {
    scanAndRemove(srcPath);
  }
  
  return removedFiles;
}

function cleanPackageJson() {
  const packagePath = path.join(projectRoot, 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Supprimer les dépendances de développement non nécessaires en production
    const devDepsToRemove = [
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@testing-library/user-event',
      'jest',
      'vitest'
    ];
    
    let removed = 0;
    if (packageJson.devDependencies) {
      devDepsToRemove.forEach(dep => {
        if (packageJson.devDependencies[dep]) {
          delete packageJson.devDependencies[dep];
          removed++;
        }
      });
    }
    
    if (removed > 0) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log(`📦 Package.json nettoyé: ${removed} dépendances supprimées`);
    }
    
    return removed;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de package.json:', error.message);
    return 0;
  }
}

// Exécution du nettoyage
console.log('🧹 Début du nettoyage du projet...\n');

const srcPath = path.join(projectRoot, 'src');
const cleanedFiles = cleanDirectory(srcPath);
const removedTestFiles = removeTestFiles();
const cleanedPackage = cleanPackageJson();

console.log('\n📊 Résumé du nettoyage:');
console.log(`   - Fichiers nettoyés: ${cleanedFiles}`);
console.log(`   - Fichiers de test supprimés: ${removedTestFiles}`);
console.log(`   - Dépendances supprimées: ${cleanedPackage}`);

console.log('\n✨ Nettoyage terminé avec succès!');
console.log('\n💡 Recommandations:');
console.log('   - Exécutez "npm run build" pour vérifier que tout fonctionne');
console.log('   - Testez l\'application en mode production');
console.log('   - Vérifiez les performances avec les DevTools');