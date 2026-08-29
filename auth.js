const firebaseConfig = {
  apiKey: "AIzaSyBO2BN1GKnCEavALSt87PooM0eG9YC9oxY",
  authDomain: "horoscope-app-c1226.firebaseapp.com",
  databaseURL: "https://horoscope-app-c1226-default-rtdb.firebaseio.com",
  projectId: "horoscope-app-c1226",
  storageBucket: "horoscope-app-c1226.firebasestorage.app",
  messagingSenderId: "147456145049",
  appId: "1:147456145049:web:3ea1e96783ea730828ea08"
};

// 1. تهيئة Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

var currentUser = null;

// 2. معالجة نتيجة التوجيه فور التحميل
auth.getRedirectResult().then((result) => {
  if (result && result.user) {
    console.log("تم تسجل الدخول بنجاح");
  }
}).catch((error) => {
  console.error("خطأ في التوجيه:", error);
});

// 3. مراقبة حالة الدخول وإظهار الواجهة المناسبة
auth.onAuthStateChanged((user) => {
  const authScreen = document.getElementById('auth-screen');
  const appContent = document.getElementById('app-content');

  if (user) {
    currentUser = user;
    if (authScreen) authScreen.style.display = 'none';
    if (appContent) appContent.style.display = 'block';

    const userImg = document.getElementById('user-profile-img');
    const userName = document.getElementById('user-profile-name');
    const userEmail = document.getElementById('user-profile-email');

    if (userImg) userImg.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    if (userName) userName.innerText = user.displayName || 'مستخدم';
    if (userEmail) userEmail.innerText = user.email || '';

    if (typeof loadPostsFeed === 'function') {
      loadPostsFeed();
    }
  } else {
    currentUser = null;
    if (authScreen) authScreen.style.display = 'block';
    if (appContent) appContent.style.display = 'none';
  }
});

// 4. دالة تسجيل الدخول
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

// 5. دالة تسجيل الخروج
function logoutGoogle() {
  auth.signOut().then(() => {
    window.location.reload();
  });
}
