const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 必要なディレクトリを作成
const directories = [
  'src',
  'src/components',
  'src/screens',
  'src/utils',
  'src/assets',
  'android/app/src/main/res/drawable',
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// 依存関係をインストール
console.log('Installing dependencies...');
const dependencies = [
  'react-native-safe-area-context',
  '@react-navigation/native',
  '@react-navigation/stack',
  'react-native-screens',
  'react-native-gesture-handler',
  '@react-native-async-storage/async-storage',
  'react-native-vector-icons'
];

const devDependencies = [
  '@babel/core',
  '@babel/runtime',
  '@react-native/eslint-config',
  '@react-native/metro-config',
  '@types/react',
  '@types/react-native',
  'typescript',
  '@types/react-native-vector-icons',
  'babel-plugin-module-resolver'
];

try {
  execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
  execSync(`npm install -D ${devDependencies.join(' ')}`, { stdio: 'inherit' });
  console.log('Dependencies installed successfully');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// Androidのセットアップ
console.log('Setting up Android project...');
try {
  execSync('cd android && ./gradlew clean', { stdio: 'inherit' });
  console.log('Android setup completed');
} catch (error) {
  console.error('Error setting up Android project:', error);
  process.exit(1);
}

console.log('\nSetup completed successfully!');
console.log('\nNext steps:');
console.log('1. Start Metro: npm start');
console.log('2. Run Android: npm run android');
console.log('3. Run iOS: cd ios && pod install && cd .. && npm run ios');