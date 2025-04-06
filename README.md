
# 🧾 ExpenseWise Explorer

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-v0.72-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2049-black.svg)](https://expo.dev/)

A sleek and intuitive React Native Expo app for effortlessly tracking and splitting expenses with friends.

![ExpenseWise Explorer App](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

- **Group Management**: Create and manage expense groups for different occasions
- **Easy Expense Tracking**: Add expenses with detailed information in seconds
- **Smart Splitting**: Split expenses equally or with custom amounts
- **Balance Tracking**: Keep track of who owes whom at a glance
- **Intuitive UI**: User-friendly interface with modern design patterns
- **Persistent Storage**: Never lose your expense data

## 📱 Screenshots

<div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400&auto=format&fit=crop" alt="Home Screen" width="300"/>
  <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=400&auto=format&fit=crop" alt="Group Details" width="300"/>
  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop" alt="Add Expense" width="300"/>
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
  ```bash
  npm install -g expo-cli
  ```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/expensewise-explorer.git
   cd expensewise-explorer
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   expo start
   ```

4. Follow the instructions in the terminal to open the app on your device or simulator

## 📱 Building the APK

### Using EAS Build (Recommended)

1. Install EAS CLI
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account
   ```bash
   eas login
   ```

3. Configure the build
   ```bash
   eas build:configure
   ```

4. Build for Android
   ```bash
   eas build -p android --profile preview
   ```

5. After the build completes, download the APK from the provided URL in the Expo dashboard

### Using Expo Build (Legacy)

```bash
expo build:android -t apk
```

## 🔄 Usage Flow

1. **Create a Group**: Start by creating an expense group (e.g., "Weekend Trip")
2. **Add Members**: Invite friends to join your expense group
3. **Add Expenses**: Record expenses as they occur with details like amount, payer, and split method
4. **Track Balances**: See who owes what at any time
5. **Settle Up**: Mark expenses as settled when payments are made

## 🧩 Technologies Used

- React Native
- Expo
- TailwindCSS for styling
- React Navigation for routing
- Zustand for state management
- React Query for data fetching
- Shadcn UI for component library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📬 Contact

For any questions or suggestions, please open an issue or contact [your-subratgangwar03@gmail.com](mailto:subratgangwar03@gmail.com).

---

Made with ❤️ by Subrat

