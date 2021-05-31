<script>
  import { FirebaseApp } from 'sveltefire';
  import Main from './Main.svelte';

  // Import the Firebase Services you want bundled and call initializeApp
  import firebase from 'firebase/app';
  import 'firebase/analytics';

  const config = decodeURIComponent(process.env.FIREBASE_CONFIG);
  const firebaseConfig = JSON.parse(config);

  console.log(firebaseConfig);

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>

<FirebaseApp {firebase}>
  <Main />
</FirebaseApp>
