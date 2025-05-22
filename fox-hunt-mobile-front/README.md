To install the application on your android device<br>
Download app-release.apk file from<br>
fox-hunt-mobile-front\android\app\build\outputs\apk\release<br>

For creating apk use "./gradlew app:assembleRelease" from fox-hunt-mobile-front\android
To make a release build/deployment use "react-native run-android --variant release" from fox-hunt-mobile-front

Emulator setup:

1. In fox-hunt-mobile-front/local.properties add:
   sdk.dir=C:\\Users\\{USER.NAME}\\AppData\\Local\\Android\\Sdk
   (SDK goes with Android Studio standart instalation)
2. java v11.0.8+ 10-win-x64 (add JAVA_HOME + PATH variables)
3. change PORT in fox-hunt-mobile-front/.env (for example port of deployed API Gateway service
   or some proxy service port, used to connect your localhost with internet)
4. ./gradlew app:assembleRelease in fox-hunt-mobile-front\android folder
5. fox-hunt-mobile-front\android\app\build\outputs\apk\release\app-release.apk - your apk
6. Start your emulator => put apk in filesystem => run apk in emulator

Local dev configurations:
To configure environment for Foxhunt app, follow the instructions in the documentation: https://reactnative.dev/docs/0.63/environment-setup. <br>
Configure the JAVA_HOME environment variable: JAVA_HOME as “Variable name” and the path to your Java JDK directory under “Variable value”(C:\Program Files\Java\jdk-17.0.1).

In the Android SDK:<br>
(open \fox-hunt-mobile-front\android\.gradle folder in Android Studio)
- 'File → Project Structure → Project' and change 'Gradle Version' to 6.0;<br> 
- 'File → Project Structure → Project' and change 'Android Gradle Plugin Version' to 3.5.3;<br>
- 'File → Settings → Build, Execution, Deployment → Build Tools → Gradle' and change 'Gradle JDK' version to 11;<br>
- 'Tools → AVD Manager → Create Virtual Device' and choose any phone, then click the 'Next' button and choose 'Q' release name and click the 'Finish' button;<br>
- In the AVD Manager launch the selected phone;<br>

For dev start the android emulator <br>
Add to .env file static or dynamic IP address BASE_URL=IP (for server requests) if needed,
By default there http://10.0.2.2 - connector from SDK to localhost

In the code editor, go to the 'fox-hunt-mobile-front' directory in the terminal: <br>
- Run 'npm start';<br>
- In another terminal in the same directory(fox-hunt-mobile-front), run 'npx react-native run-android';<br>

If 'npx react-native run-android' doesn't work, then go to Android SDK: 'Run → Run...'<br>

Possible errors:
Time out after 300seconds waiting for emulator to come online - during launching of the emulator
Duplicate device on Device Manager of Android Studio, set Graphics option on the Android Virtual Device to Software instead of Automatic or Hardware

Geolocation configuration to test competitions:
1. Open settings on the phone, choose Location, enable location for foxhunt application
2. Choose '...' on the android sdk phone menu, on location tab you can change mock location
