let ver= "1260931"
let cacheData = "1b02a97512be7e6beaf23790026d01f8.png,1daaeb5f502df5f3cc8ea6028e3ef59f.png,2dc78e422b02262904c9820e11ac6f1a.svg,37987f05162644d5659dd6db880bfdf3.png,3cb34382fa6c2d76f208f76544361647.png,542bc4086c322ae75d59f632514bdd30.png,5d1eb75b276b287613fe17287721a087.m4a,5ff2e6bbd42a75fbef236c58f912e49c.eot,63fbf4276b3e9e762db5f9ae985abcab.png,7419fd71c247dfa418527ad7d032977a.m4a,7b1233706b5cf0f249386e65b1f37082.png,7da71a78953861a70385725d8f78dc7f.woff,833fd749922b4a590f4d6b878c97d739.png,86cc8f528c3b9535d26a0e28a1a99e2c.png,903155fb65c056dc290b3db2f07dd2a7.png,999dc187999b55a2456f7e63421a2f39.png,9ae0ac4016406da64fd1de6c20d95251.png,9d18e8c25070413751687b81180fcede.png,a1aebebe861b0dff207e53938cd4efe3.png,b86cbac685b76b01cbda9c5e14afe821.png,be44741717c0e78e71af054e7c93c95c.png,bf9835a87e8a9f65521f76ccc3efcae1.png,d04ded86af3bf074f2692b5c887c9f79.png,d10f1a99f7f5af4b62c5d852aad8fff2.png,df8c4faece47c55694ec51ff6546adb3.png,e031f23598f80724fc5993bbc565a6ad.jpg,e3e4e347a07f0b7fee184b2d6ae3e9ea.ttf,ee1e79ab50964608c28580d94a1ba43f.png,f716511f0f8852cce4e8fd5f20844f8a.jpg,fe988edbad4e40a2238f7d1131c01f08.png".split(",").map(d=>"assets/"+d)
let cName = "cache-"+ver

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cName)
      .then((cache) => {
        return cache.addAll(cacheData);
      })
  );
});
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cName];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 重要：レスポンスを clone する。レスポンスは Stream で
            // ブラウザ用とキャッシュ用の2回必要。なので clone して
            // 2つの Stream があるようにする
            let responseToCache = response.clone();

            caches.open(cacheName)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
