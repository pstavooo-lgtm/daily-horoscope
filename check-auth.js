// دالة فتح صفحة حالات وصور من الصفحة الرئيسية
function goToCasesAndPhotos() {
  const localAuth = localStorage.getItem("isLoggedIn");
  if (localAuth === "true" || (firebase.auth().currentUser)) {
    window.location.href = "cases-photos.html";
  } else {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "cases-photos.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }
}

// دالة حماية صفحة حالات وصور
function protectCasesPage() {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user && localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "login.html";
    } else if (user) {
      localStorage.setItem("isLoggedIn", "true");
    }
  });
}
