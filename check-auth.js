// 1. دالة يفحص بها الزر قبل فتح حالات وصور
function goToCasesAndPhotos() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      window.location.href = "cases-photos.html";
    } else {
      window.location.href = "login.html";
    }
  });
}

// 2. دالة لحماية صفحة حالات وصور من الدخول المباشر
function protectCasesPage() {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}
