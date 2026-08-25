function loadPostsFeed() {
  if (typeof db === 'undefined') return;
  
  db.ref('posts').on('value', (snapshot) => {
    const container = document.getElementById('posts-feed-container');
    if (!container) return;
    
    container.innerHTML = "";
    const data = snapshot.val();
    
    if (!data) {
      container.innerHTML = `<div style="text-align:center; color:white; padding:20px;">لا توجد منشورات حالياً.</div>`;
      return;
    }

    Object.entries(data).reverse().forEach(([key, post]) => {
      const card = document.createElement('div');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-header">
          <img src="${post.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" class="post-avatar">
          <div>
            <div class="post-author">${post.author || 'مستخدم'}</div>
            <div class="post-time">${new Date(post.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</div>
          </div>
        </div>
        ${post.text ? `<div class="post-text">${post.text}</div>` : ''}
        ${post.image ? `<img src="${post.image}" class="post-img">` : ''}
      `;
      container.appendChild(card);
    });
  });
}

function filterMyPosts() {
  if (typeof db === 'undefined') return;
  const userId = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : "anonymous_user";

  db.ref('posts').once('value', (snapshot) => {
    const container = document.getElementById('posts-feed-container');
    if (!container) return;
    
    container.innerHTML = "";
    const data = snapshot.val() || {};

    Object.entries(data).reverse().forEach(([key, post]) => {
      if (post.uid === userId) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
          <div class="post-header">
            <img src="${post.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" class="post-avatar">
            <div>
              <div class="post-author">${post.author || 'مستخدم'}</div>
              <div class="post-time">${new Date(post.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</div>
            </div>
          </div>
          ${post.text ? `<div class="post-text">${post.text}</div>` : ''}
          ${post.image ? `<img src="${post.image}" class="post-img">` : ''}
        `;
        container.appendChild(card);
      }
    });
  });
}

// تشغيل جلب المنشورات تلقائياً عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  loadPostsFeed();
});
