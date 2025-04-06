
# ExpenseWise Explorer

A React Native Expo app for tracking and splitting expenses with friends.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
npm install
# or
yarn install
```

### Running the app

```bash
expo start
```

### Building APK

To build an APK for Android, you'll need to use EAS Build (the recommended approach) or expo build (deprecated):

#### Using EAS Build (Recommended):

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Configure the build:
```bash
eas build:configure
```

4. Build the APK:
```bash
eas build -p android --profile preview
```

5. Once the build is complete, you can download the APK from the Expo website or use the provided URL.

#### Using expo build (Deprecated):

```bash
expo build:android -t apk
```

### Uploading to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Click on "+ New" and select "File upload"
3. Select your APK file from the build output directory
4. Wait for the upload to complete
5. Right-click on the file and select "Get link"
6. Make sure to set the permissions to "Anyone with the link can view"
7. Copy the link to share your APK with others

## Features

- Create and manage expense groups
- Add expenses with detailed information
- Split expenses equally or with custom amounts
- Track balances between group members
- Persistent data storage

