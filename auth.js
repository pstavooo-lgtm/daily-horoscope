// تهيئة Firebase والحسابات
const firebaseConfig = {
  apiKey: "AIzaSyBO2BN1GKnCEavALSt87PooM0eG9YC9oxY",
  authDomain: "horoscope-app-c1226.firebaseapp.com",
  databaseURL: "https://horoscope-app-c1226-default-rtdb.firebaseio.com",
  projectId: "horoscope-app-c1226",
  storageBucket: "horoscope-app-c1226.firebasestorage.app",
  messagingSenderId: "147456145049",
  appId: "1:147456145049:web:3ea1e96783ea730828ea08"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

// مراقبة حالة تسجيل الدخول
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

    // استدعاء عرض المنشورات بعد التأكد من وجود الحساب
    if (typeof loadPostsFeed === 'function') loadPostsFeed();
  } else {
    currentUser = null;
    if (authScreen) authScreen.style.display = 'block';
    if (appContent) appContent.style.display = 'none';
  }
});

// تسجيل الدخول بواسطة Google
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

// تسجيل الخروج مع تحديث الصفحة تلقائياً
function logoutGoogle() {
  auth.signOut().then(() => {
    window.location.reload();
  });
}
