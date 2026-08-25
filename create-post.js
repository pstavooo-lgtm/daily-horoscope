let selectedImageBase64 = "";

function openPostModal() {
  document.getElementById('post-modal').style.display = 'flex';
}

function closePostModal() {
  document.getElementById('post-modal').style.display = 'none';
  document.getElementById('modal-text-input').value = "";
  removeSelectedImage();
  updateCharCount();
}

function updateCharCount() {
  const input = document.getElementById('modal-text-input');
  const counter = document.getElementById('char-counter');
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
  document.getElementById('modal-file-input').value = "";
  document.getElementById('img-preview-box').style.display = 'none';
  document.getElementById('modal-img-preview').src = "";
}

function submitNewPost() {
  if (!currentUser) {
    alert("يرجى تسجيل الدخول أولاً!");
    return;
  }

  const text = document.getElementById('modal-text-input').value.trim();
  if (!text && !selectedImageBase64) {
    alert("يرجى كتابة نص أو اختيار صورة للنشر!");
    return;
  }

  // التحقق من حد الـ 10 دقائق
  const lastPostTime = localStorage.getItem('last_post_time_' + currentUser.uid);
  const now = Date.now();

  if (lastPostTime && (now - lastPostTime < 10 * 60 * 1000)) {
    const minutesLeft = Math.ceil((10 * 60 * 1000 - (now - lastPostTime)) / (1000 * 60));
    alert(`عذراً، لحماية المنصة من النشر المتكرر يمكنك النشر مجدداً بعد ${minutesLeft} دقائق.`);
    return;
  }

  const submitBtn = document.getElementById('submit-post-btn');
  submitBtn.disabled = true;
  submitBtn.innerText = "جاري النشر...";

  db.ref('users/' + currentUser.uid).once('value', (snap) => {
    const userData = snap.val() || {};
    const authorName = userData.name || currentUser.displayName || "مستخدم";
    const authorPhoto = userData.photo || currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    db.ref('posts').push({
      uid: currentUser.uid,
      author: authorName,
      avatar: authorPhoto,
      text: text,
      image: selectedImageBase64,
      timestamp: Date.now(),
      likes: 0
    }).then(() => {
      localStorage.setItem('last_post_time_' + currentUser.uid, Date.now());
      submitBtn.disabled = false;
      submitBtn.innerText = "نشر الآن 🚀";
      closePostModal();
    }).catch(err => {
      alert("حدث خطأ أثناء النشر: " + err.message);
      submitBtn.disabled = false;
      submitBtn.innerText = "نشر الآن 🚀";
    });
  });
}
