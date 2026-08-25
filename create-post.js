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
let selectedImageBase64 = "";

// مراقبة الدخول والتحديث السلس للواجهة بدون رمشة
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

    if (typeof loadPostsFeed === 'function') loadPostsFeed();
  } else {
    currentUser = null;
    if (authScreen) authScreen.style.display = 'block';
    if (appContent) appContent.style.display = 'none';
  }
});

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

function logoutGoogle() {
  auth.signOut().then(() => {
    location.reload();
  });
}

function openPostModal() { document.getElementById('post-modal').style.display = 'flex'; }
function closePostModal() {
  document.getElementById('post-modal').style.display = 'none';
  document.getElementById('modal-text-input').value = "";
  removeSelectedImage();
  updateCharCount();
}

function updateCharCount() {
  const input = document.getElementById('modal-text-input');
  const counter = document.getElementById('char-counter');
  if (!input || !counter) return;
  const remaining = 300 - input.value.length;
  counter.innerText = `متبقي ${remaining} حرف`;
  counter.style.color = remaining < 30 ? "#c62828" : "#777";
}

function handleImagePreview(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    selectedImageBase64 = e.target.result;
    document.getElementById('modal-img-preview').src = selectedImageBase64;
    document.getElementById('img-preview-box').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeSelectedImage() {
  selectedImageBase64 = "";
  const fileInput = document.getElementById('modal-file-input');
  const previewBox = document.getElementById('img-preview-box');
  const imgPreview = document.getElementById('modal-img-preview');
  if (fileInput) fileInput.value = "";
  if (previewBox) previewBox.style.display = 'none';
  if (imgPreview) imgPreview.src = "";
}

function submitNewPost() {
  if (!currentUser) { alert("يرجى تسجيل الدخول أولاً!"); return; }

  const text = document.getElementById('modal-text-input').value.trim();
  if (!text && !selectedImageBase64) { alert("يرجى كتابة نص أو اختيار صورة!"); return; }

  const userId = currentUser.uid;
  const lastPostTime = localStorage.getItem('last_post_time_' + userId);
  const now = Date.now();

  if (lastPostTime && (now - lastPostTime < 10 * 60 * 1000)) {
    const minutesLeft = Math.ceil((10 * 60 * 1000 - (now - lastPostTime)) / (1000 * 60));
    alert(`عذراً، يمكنك النشر مجدداً بعد ${minutesLeft} دقائق.`);
    return;
  }

  const submitBtn = document.getElementById('submit-post-btn');
  submitBtn.disabled = true;
  submitBtn.innerText = "جاري النشر...";

  db.ref('posts').push({
    uid: userId,
    author: currentUser.displayName || "مستخدم",
    avatar: currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    text: text,
    image: selectedImageBase64,
    timestamp: now
  }).then(() => {
    localStorage.setItem('last_post_time_' + userId, now);
    submitBtn.disabled = false;
    submitBtn.innerText = "نشر الآن 🚀";
    closePostModal();
  }).catch(err => {
    alert("خطأ أثناء النشر: " + err.message);
    submitBtn.disabled = false;
    submitBtn.innerText = "نشر الآن 🚀";
  });
}
