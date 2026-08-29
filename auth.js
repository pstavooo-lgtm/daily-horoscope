const firebaseConfig = {
  apiKey: "AIzaSyBO2BN1GKnCEavALSt87PooM0eG9YC9oxY",
  authDomain: "horoscope-app-c1226.firebaseapp.com",
  databaseURL: "https://horoscope-app-c1226-default-rtdb.firebaseio.com",
  projectId: "horoscope-app-c1226",
  storageBucket: "horoscope-app-c1226.firebasestorage.app",
  messagingSenderId: "147456145049",
  appId: "1:147456145049:web:3ea1e96783ea730828ea08"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

// دالة تسجيل الدخول النافذة المنبثقة
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      // بعد الدخول بنجاح التحويل التلقائي لصفحة حالات وصور
      window.location.href = "cases-photos.html";
    })
    .catch((error) => {
      console.error("خطأ في تسجيل الدخول:", error);
      alert("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.");
    });
}

function logoutGoogle() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
