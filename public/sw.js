/* Service Worker do Forjando Guerreiros — recebe push e abre o app no clique */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { title: '⚔ Forjando Guerreiros', body: event.data ? event.data.text() : '' }; }
  const title = data.title || '⚔ Forjando Guerreiros';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || '',
      tag: data.tag || 'fg',
      badge: '/icon-badge.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) { if ('focus' in client) return client.focus(); }
      return clients.openWindow('/app');
    })
  );
});
