function loadPostsFeed() {
  if (typeof db === 'undefined') return;
  
  db.ref('posts').on('value', (snapshot) => {
    const container = document.getElementById('posts-feed-container');
    if (!container) return;
    
    container.innerHTML = "";
    const data = snapshot.val();
    
    if (!data) {
      container.innerHTML = `<div style="text-align:center; color:white; padding:20px;">لا توجد منشورات حالياً. كن أول من ينشر!</div>`;
      return;
    }

    Object.entries(data).reverse().forEach(([key, post]) => {
      const card = createPostCardElement(key, post);
      container.appendChild(card);
    });
  });
}

function filterMyPosts() {
  if (typeof db === 'undefined' || !currentUser) return;

  db.ref('posts').once('value', (snapshot) => {
    const container = document.getElementById('posts-feed-container');
    if (!container) return;
    
    container.innerHTML = "";
    const data = snapshot.val() || {};

    Object.entries(data).reverse().forEach(([key, post]) => {
      if (post.uid === currentUser.uid) {
        const card = createPostCardElement(key, post);
        container.appendChild(card);
      }
    });
  });
}

function createPostCardElement(postId, post) {
  const card = document.createElement('div');
  card.className = 'post-card';
  
  card.innerHTML = `
    <div class="post-header">
      <div class="post-user-info">
        <img src="${post.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" class="post-avatar">
        <div>
          <div class="post-author">${post.author || 'مستخدم'}</div>
          <div class="post-time">${new Date(post.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</div>
        </div>
      </div>
      <button class="post-menu-btn" onclick="openPostMenu('${postId}', '${post.uid}')">⋮</button>
    </div>
    
    ${post.text ? `<div class="post-text">${post.text}</div>` : ''}
    ${post.image ? `<img src="${post.image}" class="post-img">` : ''}
    
    <div class="post-actions-bar">
      <button class="action-btn" onclick="toggleLike('${postId}')">❤️ إعجاب</button>
      <button class="action-btn" onclick="openComments('${postId}')">💬 تعليق</button>
      <button class="action-btn" onclick="sharePost('${postId}')">🔗 مشاركة</button>
    </div>
  `;
  return card;
}

// ==========================================
// استدعاءات جاهزة للمستقبل (Future Callbacks)
// ==========================================

function toggleLike(postId) {
  console.log("استدعاء الإعجاب للمنشور:", postId);
  alert("ميزة الإعجاب مجهزة للمستقبل!");
}

function openComments(postId) {
  console.log("استدعاء التعليقات للمنشور:", postId);
  alert("ميزة التعليقات مجهزة للمستقبل!");
}

function sharePost(postId) {
  console.log("استدعاء المشاركة للمنشور:", postId);
  if (navigator.share) {
    navigator.share({ title: 'منشور جديد', url: window.location.href });
  } else {
    alert("تم نسخ رابط الصفحة!");
  }
}

function openPostMenu(postId, authorUid) {
  console.log("فتح قائمة الخيارات للمنشور:", postId);
  const isMyPost = (typeof currentUser !== 'undefined' && currentUser && currentUser.uid === authorUid);
  
  if (isMyPost) {
    if (confirm("هل تريد حذف هذا المنشور؟")) {
      deletePost(postId);
    }
  } else {
    alert("خيارات المنشور: الإبلاغ / نسخ الرابط");
  }
}

function deletePost(postId) {
  if (typeof db !== 'undefined') {
    db.ref('posts/' + postId).remove().then(() => {
      alert("تم حذف المنشور بنجاح!");
    });
  }
}
