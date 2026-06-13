export interface ScriptField {
  key: string;
  label: string;
  placeholder: string;
  type: "url" | "text" | "textarea" | "color";
  description?: string;
}

export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ScriptField[];
  template: string;
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: "sale-badge",
    name: "[Trang sản phẩm] Sale badge & nhãn sản phẩm",
    description: "Tự động gắn nhãn sale event và nhãn trạng thái (Cháy hàng, ế! Xả Kho, Hàng còn ít, Yêu thích nhất) ngẫu nhiên lên TẤT CẢ URL sản phẩm có dạng _p trên trang",
    category: "Trang sản phẩm",
    fields: [],
    template: `<style>
.jj-sale-badge{position:absolute;bottom:0;left:0;z-index:10;display:flex;align-items:stretch;border-radius:0 6px 0 0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.28);pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;line-height:1;}
.jj-b-red{background:#e31c23;color:#fff;font-size:15px;font-weight:900;padding:4px 7px 4px 5px;display:flex;align-items:center;position:relative;}
.jj-b-red::after{content:"";position:absolute;right:-6px;top:0;bottom:0;width:12px;background:#e31c23;clip-path:polygon(0 0,60% 0,100% 50%,60% 100%,0 100%);z-index:1;}
.jj-b-yellow{background:#ffd000;font-size:8px;font-weight:900;padding:3px 6px 3px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-transform:uppercase;}
.jj-b-yellow span:first-child{font-size:8.5px;color:#333;}
.jj-b-yellow span:last-child{background:#e31c23;color:#fff;padding:1px 3px;border-radius:2px;font-size:7.5px;margin-top:1px;font-weight:900;}
.jj-top-badge{position:absolute;top:0;left:0;z-index:10;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;font-size:11px;font-weight:700;padding:4px 10px 4px 7px;border-radius:0 0 10px 0;pointer-events:none;display:flex;align-items:center;gap:4px;box-shadow:0 2px 8px rgba(0,0,0,0.22);}
.jj-ch{background:linear-gradient(135deg,#e31c23,#c0001a);}
.jj-ek{background:linear-gradient(135deg,#f97316,#ea580c);}
.jj-xk{background:linear-gradient(135deg,#0284c7,#0369a1);}
.jj-yt{background:linear-gradient(135deg,#db2777,#be185d);}
</style>
<script>
(function(){
{{DOMAIN_LOCK_LINE}}
var BADGE_META=[
  {k:"chayHang",cls:"jj-ch",ic:"\\uD83D\\uDD25",lb:"Ch\\xe1y h\\xe0ng"},
  {k:"eXaKho",cls:"jj-ek",ic:"\\uD83D\\uDE05",lb:"X\\u1EA3 Kho"},
  {k:"xaKho",cls:"jj-xk",ic:"\\uD83D\\uDCE6",lb:"H\\u00E0ng c\\u00F2n \\u00EDt"},
  {k:"yeuThich",cls:"jj-yt",ic:"\\u2764\\uFE0F",lb:"Y\\xEAu th\\xEDch nh\\u1EA5t"}
];
function getSaleLabel(){var now=new Date();var m=now.getMonth()+1;var d=now.getDate();var raw=[1,m,15,20,25].sort(function(a,b){return a-b;});var days=[];for(var i=0;i<raw.length;i++){if(days.indexOf(raw[i])===-1)days.push(raw[i]);}for(var i=0;i<days.length;i++){if(days[i]>=d)return days[i]+'.'+m;}var nm=m===12?1:m+1;return '1.'+nm;}
function hashPid(s){var h=0;for(var i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return Math.abs(h);}
function getDetailWrap(pid){var imgs=document.querySelectorAll("img[src*='p-"+pid+"/']");return imgs.length?imgs[0].parentElement:null;}
function addSale(w){if(!w||w.getAttribute("data-jjs"))return;w.setAttribute("data-jjs","1");w.style.position="relative";var lbl=getSaleLabel();var b=document.createElement("div");b.className="jj-sale-badge";b.innerHTML='<div class="jj-b-red">'+lbl+'</div><div class="jj-b-yellow"><span>SI\\u00CAU</span><span>SALE</span></div>';w.appendChild(b);}
function addTop(w,m){if(!w||w.getAttribute("data-jjt"))return;w.setAttribute("data-jjt",m.k);w.style.position="relative";var b=document.createElement("div");b.className="jj-top-badge "+m.cls;b.textContent=m.ic+" "+m.lb;w.appendChild(b);}
function applyBadge(w,pid){if(!w)return;addSale(w);addTop(w,BADGE_META[hashPid(pid)%BADGE_META.length]);}
function scan(){
  var dm=window.location.pathname.match(/_p(\\d+)/);
  if(dm){var dw=getDetailWrap(dm[1]);if(dw)applyBadge(dw,dm[1]);}
  var links=document.querySelectorAll("a[href*='_p']");
  for(var i=0;i<links.length;i++){
    var href=links[i].getAttribute("href")||"";
    var pm=href.match(/_p(\\d+)/);
    if(!pm)continue;
    var img=links[i].querySelector("img[class*='aspect-square']");
    if(img&&img.parentElement)applyBadge(img.parentElement,pm[1]);
  }
}
scan();
new MutationObserver(function(ml){for(var i=0;i<ml.length;i++){if(ml[i].addedNodes.length){scan();break;}}}).observe(document.body,{childList:true,subtree:true});
var op=history.pushState;history.pushState=function(){op.apply(this,arguments);setTimeout(scan,400);};
window.addEventListener("popstate",function(){setTimeout(scan,400);});
})();
<\/script>`
  },
  {
    id: "video-avatar",
    name: "[Trang sản phẩm] Video avatar (YouTube thay ảnh)",
    description: "Thay thế ảnh sản phẩm bằng video YouTube tự động phát, ánh xạ timestamp ảnh → YouTube ID",
    category: "Trang sản phẩm",
    fields: [
      {
        key: "IMG_HOST",
        label: "Domain CDN ảnh sản phẩm",
        placeholder: "r6i.pen.dropbuy.vn",
        type: "text",
        description: "Domain server ảnh để nhận diện đúng ảnh cần thay thế, VD: r6i.pen.dropbuy.vn"
      },
      {
        key: "VIDEO_MAP_ENTRIES",
        label: "Danh sách cặp ảnh–video",
        placeholder: "'1773120431464': 'Pe837ti67S0',",
        type: "textarea",
        description: "Các cặp timestamp–YouTube ID — được quản lý qua giao diện bên dưới, không cần sửa tay"
      }
    ],
    template: `<script>
(function(){
  var VIDEO_MAP = {
    {{VIDEO_MAP_ENTRIES}}
  };
  var DONE_ATTR='data-jj-vid-done';
  function getImgKey(src){var m=src.match(/\\/p-\\d+\\/(\\d+)-/);return m?m[1]:null;}
  function isTargetImg(src){return src&&src.indexOf('{{IMG_HOST}}')!==-1;}
  function replaceImg(img){
    if(img.getAttribute(DONE_ATTR))return;
    var src=img.getAttribute('src')||img.getAttribute('data-src')||'';
    if(!isTargetImg(src))return;
    var key=getImgKey(src);
    if(!key||!VIDEO_MAP[key])return;
    var videoId=VIDEO_MAP[key];
    var w=img.offsetWidth||img.naturalWidth||img.width||300;
    var h=img.offsetHeight||img.naturalHeight||img.height||300;
    if(w<10)w=300;if(h<10)h=w;
    img.setAttribute(DONE_ATTR,'1');
    var wrap=document.createElement('div');
    wrap.style.cssText='display:inline-block;width:'+w+'px;height:'+h+'px;position:relative;overflow:hidden;border-radius:inherit;flex-shrink:0;';
    var iframe=document.createElement('iframe');
    iframe.src='https://www.youtube.com/embed/'+videoId+'?autoplay=1&mute=1&loop=1&playlist='+videoId+'&controls=0&rel=0&modestbranding=1&playsinline=1';
    iframe.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;border:0;pointer-events:none;';
    iframe.setAttribute('allow','autoplay; encrypted-media');
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('loading','lazy');
    wrap.appendChild(iframe);
    var overlay=document.createElement('div');
    overlay.style.cssText='position:absolute;inset:0;z-index:1;cursor:pointer;';
    overlay.onclick=function(e){e.stopPropagation();var p=img.closest?img.closest('a'):null;if(p)p.click();};
    wrap.appendChild(overlay);
    img.parentNode.insertBefore(wrap,img);
    img.style.display='none';
  }
  function scanAll(){var imgs=document.querySelectorAll('img:not(['+DONE_ATTR+'])');for(var i=0;i<imgs.length;i++)replaceImg(imgs[i]);}
  function tryScan(){setTimeout(scanAll,100);setTimeout(scanAll,500);setTimeout(scanAll,1200);}
  new MutationObserver(function(ml){
    var f=false;
    for(var m=0;m<ml.length;m++){var ns=ml[m].addedNodes;for(var n=0;n<ns.length;n++){if(ns[n].nodeType===1){f=true;break;}}if(f)break;}
    if(f)setTimeout(scanAll,150);
  }).observe(document.body,{childList:true,subtree:true});
  if(!window.__jjVidHooked){
    window.__jjVidHooked=true;
    var _oP=history.pushState,_oR=history.replaceState;
    history.pushState=function(){_oP.apply(history,arguments);tryScan();};
    history.replaceState=function(){_oR.apply(history,arguments);tryScan();};
    window.addEventListener('popstate',tryScan);
  }
  tryScan();
})();
<\/script>`
  },
  {
    id: "sale-price",
    name: "[Trang sản phẩm] Hiển thị giá ưu đãi ngoài website",
    description: "Tự động thay giá hiển thị theo % giảm cấu hình cho từng sản phẩm — chỉ áp dụng cho khách chưa đăng nhập",
    category: "Trang sản phẩm",
    fields: [
      {
        key: "CAU_HINH_ENTRIES",
        label: "Danh sách sản phẩm & % giảm",
        placeholder: "{ slug: 'p126785', phanTram: 0.32 },",
        type: "textarea",
        description: "Danh sách cấu hình — được quản lý qua giao diện bên dưới, không cần sửa tay"
      }
    ],
    template: `<script>
(function(){
  var CAU_HINH=[
    {{CAU_HINH_ENTRIES}}
  ];

  function layCauHinh(){
    var href=window.location.href;
    for(var i=0;i<CAU_HINH.length;i++){
      if(href.indexOf(CAU_HINH[i].slug)!==-1)return CAU_HINH[i];
    }
    return null;
  }

  var DONE={};

  function apDungGiam(el,cfg){
    if(DONE[cfg.slug])return;
    if(el.getAttribute('data-da-giam'))return;
    if(el.className&&el.className.indexOf('line-through')!==-1)return;
    var text=(el.innerText||el.textContent||'').replace(/[\\s\\u00a0\\u20ab,\\.]/g,'');
    var soTien=parseInt(text,10);
    if(!isNaN(soTien)&&soTien>10000){
      if(cfg.giaGoc>0&&soTien<=Math.round(cfg.giaGoc*cfg.phanTram))return;
      var giaMoi=Math.round(soTien*cfg.phanTram);
      el.innerHTML=giaMoi.toLocaleString('vi-VN')+'&nbsp;\\u20ab';
      el.setAttribute('data-da-giam','1');
      DONE[cfg.slug]=true;
    }
  }

  var SELECTORS=[
    'div.text-3xl.font-semibold.text-red-500',
    'span.text-3xl.font-semibold.text-red-500',
    '.text-3xl.text-red-500',
    '.text-2xl.text-red-500',
    '.font-semibold.text-red-500'
  ];

  function quetGia(){
    var cfg=layCauHinh();
    if(cfg===null)return;
    for(var s=0;s<SELECTORS.length;s++){
      var els=document.querySelectorAll(SELECTORS[s]);
      for(var i=0;i<els.length;i++)apDungGiam(els[i],cfg);
    }
  }

  function khoiDong(){
    quetGia();
    setTimeout(quetGia,500);
    setTimeout(quetGia,1500);
    setTimeout(quetGia,3000);
    new MutationObserver(function(){quetGia();}).observe(document.body,{childList:true,subtree:true});
    var lastUrl=location.href;
    setInterval(function(){
      if(location.href!==lastUrl){
        lastUrl=location.href;
        DONE={};
        setTimeout(quetGia,400);
        setTimeout(quetGia,1200);
      }
    },300);
  }

  fetch('/api/auth/session',{credentials:'include'})
    .then(function(r){return r.ok?r.json():null;})
    .then(function(sess){
      var daDangNhap=!!(sess&&sess.user);
      if(!daDangNhap)khoiDong();
    })
    .catch(function(){
      khoiDong();
    });

})();
<\/script>`
  },
  {
    id: "warehouse-contact",
    name: "[Trang Chủ] Trang trí trang chủ, popup",
    description: "4 script tổng hợp: thay địa chỉ bảo hành trên trang sản phẩm, nút Zalo/gọi cố định, footer thông tin liên hệ và popup đăng nhập trang chủ",
    category: "Trang Chủ",
    fields: [
      {
        key: "BRAND_NAME",
        label: "Tên thương hiệu",
        placeholder: "PhanPhan",
        type: "text",
        description: "Hiển thị trên badge footer, logo footer và popup"
      },
      {
        key: "PHONE",
        label: "Số điện thoại",
        placeholder: "0784848484",
        type: "text",
        description: "Số điện thoại dùng cho nút Zalo, gọi và footer"
      },
      {
        key: "ADDRESS",
        label: "Địa chỉ",
        placeholder: "348 Quang Trung, Hà Đông, Hà Nội",
        type: "text",
        description: "Địa chỉ kho/văn phòng — hiển thị ở trang sản phẩm và footer"
      },
      {
        key: "IMAGE_URL",
        label: "URL ảnh",
        placeholder: "https://example.com/banner.jpg",
        type: "url",
        description: "URL ảnh banner footer và ảnh avatar trong popup"
      },
      {
        key: "PERSON_NAME",
        label: "Nhãn người dùng (popup)",
        placeholder: "Khách hàng thân thiết PhanPhan",
        type: "text",
        description: "Nhãn hiển thị trên ảnh avatar trong popup đăng nhập"
      },
      {
        key: "MAP_URL",
        label: "URL Google Maps",
        placeholder: "https://maps.app.goo.gl/...",
        type: "url",
        description: "Link Google Maps địa chỉ bảo hành trên trang sản phẩm"
      },
      {
        key: "WEBSITE_URL",
        label: "URL website",
        placeholder: "https://phanphan.vn",
        type: "url",
        description: "URL gốc website, không có dấu / ở cuối"
      },
      {
        key: "PRIMARY_COLOR",
        label: "Màu thương hiệu (tùy chọn)",
        placeholder: "Ví dụ: #66ba32 — bỏ trống = xanh lá mặc định",
        type: "color",
        description: "Mã hex màu chủ đạo — VD: #ee4d2d (đỏ), #2563eb (xanh dương), #66ba32 (xanh lá). Màu đậm hơn sẽ tự tính."
      }
    ],
    template: `<script>
(function(){
  /* ── MÀU THƯƠNG HIỆU ── */
  var C1 = '{{PRIMARY_COLOR}}' || '#66ba32';
  var C2 = (function(h){
    if (!h || h.length < 7) return '#4f9823';
    var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);
    var d=function(v){return ('0'+Math.round(v*0.80).toString(16)).slice(-2);};
    return '#'+d(r)+d(g)+d(b);
  })(C1);
  if (!document.getElementById('jj-brand-vars')) {
    var bv=document.createElement('style');
    bv.id='jj-brand-vars';
    bv.textContent=':root{--jj-c1:'+C1+';--jj-c2:'+C2+';}';
    (document.head||document.documentElement).appendChild(bv);
  }
  /* ── 1. THAY ĐỊA CHỈ BẢO HÀNH ── */
  var DONE_ATTR = 'data-jj-bh-done';
  var MAP_URL   = '{{MAP_URL}}';

  function replaceWarehouseField() {
    var items = document.querySelectorAll('td.ant-descriptions-item');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.getAttribute(DONE_ATTR)) continue;
      var label   = item.querySelector('.ant-descriptions-item-label');
      var content = item.querySelector('.ant-descriptions-item-content');
      if (label && label.textContent.trim() === 'S\u1ea3n ph\u1ea9m thu\u1ed9c') {
        label.textContent = '\u0110\u1ecba ch\u1ec9 b\u1ea3o h\u00e0nh';
        if (content) {
          content.innerHTML =
            '<a href="' + MAP_URL + '" target="_blank" rel="noopener" '
            + 'style="color:#16a34a;font-weight:600;text-decoration:underline;text-underline-offset:3px;">'
            + '{{ADDRESS}}'
            + '</a>';
        }
        item.setAttribute(DONE_ATTR, '1');
      }
    }
  }

  function tryReplace() {
    replaceWarehouseField();
    var tries = 0;
    var t = setInterval(function() {
      replaceWarehouseField();
      if (++tries > 20) clearInterval(t);
    }, 300);
  }

  var observer = new MutationObserver(function() { replaceWarehouseField(); });
  observer.observe(document.body, { childList: true, subtree: true });

  if (!window.__jjBhHooked) {
    window.__jjBhHooked = true;
    var _oP = history.pushState;
    var _oR = history.replaceState;
    history.pushState = function() { _oP.apply(history, arguments); setTimeout(tryReplace, 400); };
    history.replaceState = function() { _oR.apply(history, arguments); setTimeout(tryReplace, 400); };
    window.addEventListener('popstate', function() { setTimeout(tryReplace, 400); });
  }
  tryReplace();

  /* ── 2. GATE: CHỈ TIẾP TỤC NẾU DOMAIN HỢP LỆ ── */
  /* Nếu bạn dán lock code ở đầu script này, nó đã return sớm rồi. */
  /* Dòng dưới set cờ để các script sau biết domain đã được xác nhận. */
  window._jjGate = true;

  /* ── 3. DOCK ZALO/GỌI — CSS ── */
  if (!document.getElementById('jj-dock-style')) {
    var dockCss = document.createElement('style');
    dockCss.id = 'jj-dock-style';
    dockCss.textContent =
      '#jj-contact-dock{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:999999;display:flex;flex-direction:column;gap:10px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}' +
      '.jj-dock-btn{width:56px;height:56px;border:none;border-radius:18px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;position:relative;box-shadow:0 12px 30px rgba(15,23,42,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:transform .2s ease,box-shadow .2s ease;}' +
      '.jj-dock-btn:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(15,23,42,.24);}' +
      '.jj-dock-btn:active{transform:scale(.98);}' +
      '.jj-dock-zalo{background:linear-gradient(135deg,#0ea5e9,#2563eb);}' +
      '.jj-dock-call{background:linear-gradient(135deg,var(--jj-c1),var(--jj-c2));}' +
      '.jj-dock-icon{font-size:23px;line-height:1;}' +
      '.jj-dock-zalo-text{color:#fff;font-size:16px;font-weight:800;letter-spacing:.02em;}' +
      '.jj-dock-tooltip{position:absolute;right:68px;top:50%;transform:translateY(-50%);background:rgba(17,24,39,.94);color:#fff;font-size:12px;font-weight:600;padding:9px 11px;border-radius:999px;white-space:nowrap;opacity:0;pointer-events:none;transition:all .2s ease;box-shadow:0 8px 24px rgba(0,0,0,.18);}' +
      '.jj-dock-btn:hover .jj-dock-tooltip{opacity:1;right:72px;}' +
      '.jj-dock-call::after{content:"";position:absolute;inset:-5px;border:2px solid color-mix(in srgb,var(--jj-c1) 22%,transparent);border-radius:22px;animation:jjDockRing 1.8s infinite;pointer-events:none;}' +
      '@keyframes jjDockRing{0%{transform:scale(.95);opacity:.75;}100%{transform:scale(1.15);opacity:0;}}' +
      '@media(max-width:768px){#jj-contact-dock{top:auto;bottom:300px;transform:none;right:10px;gap:8px;}.jj-dock-btn{width:52px;height:52px;border-radius:16px;}.jj-dock-icon{font-size:21px;}.jj-dock-tooltip{display:none;}}';
    document.head.appendChild(dockCss);
  }

  /* ── 4. DOCK ZALO/GỌI — HTML ── */
  if (!document.getElementById('jj-contact-dock')) {
    var dock = document.createElement('div');
    dock.id = 'jj-contact-dock';
    dock.innerHTML =
      '<a href="https://zalo.me/{{PHONE}}" target="_blank" rel="noopener" id="jj-dock-zalo" class="jj-dock-btn jj-dock-zalo" aria-label="Chat Zalo">' +
        '<span class="jj-dock-zalo-text">Zalo</span>' +
        '<span class="jj-dock-tooltip">Chat Zalo</span>' +
      '</a>' +
      '<a href="tel:{{PHONE}}" id="jj-dock-call" class="jj-dock-btn jj-dock-call" aria-label="G\u1ecdi {{PHONE}}">' +
        '<span class="jj-dock-icon" style="color:#fff;">&#x1F4DE;</span>' +
        '<span class="jj-dock-tooltip">G\u1ecdi {{PHONE}}</span>' +
      '</a>';
    document.body.appendChild(dock);
  }

  /* ── 5. DOCK — EVENT LISTENERS ── */
  if (!window.__jjContactDockLoaded) {
    window.__jjContactDockLoaded = true;
    var pushDockEvent = function(name, extra){
      window.dataLayer = window.dataLayer || [];
      var payload = { event: name, page_url: location.href, page_title: document.title };
      if (extra) { for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) { payload[k] = extra[k]; } } }
      window.dataLayer.push(payload);
    };
    var zaloBtn = document.getElementById('jj-dock-zalo');
    var callBtn = document.getElementById('jj-dock-call');
    if (zaloBtn) { zaloBtn.addEventListener('click', function(){ pushDockEvent('jj_dock_zalo_click', { phone: '{{PHONE}}' }); }); }
    if (callBtn) { callBtn.addEventListener('click', function(){ pushDockEvent('jj_dock_call_click', { phone: '{{PHONE}}' }); }); }
  }
})();
</script>

<script>
(function() {
  if (!window._jjGate) return;
  if (document.getElementById('jj-custom-footer')) return;

  var footerHTML =
    '<div id="jj-custom-footer">' +
      '<div class="phanphan-footer-wrap">' +
        '<div class="phanphan-footer-top">' +
          '<div class="phanphan-footer-badge">\uD83D\uDED2 {{BRAND_NAME}}</div>' +
          '<h2 class="phanphan-footer-title">Th\u00f4ng tin li\u00ean h\u1ec7 & h\u1ed7 tr\u1ee3 kh\u00e1ch h\u00e0ng</h2>' +
          '<div class="phanphan-footer-note"><span class="phanphan-note-icon">\uD83D\uDCA1</span>' +
          '<div>Li\u00ean h\u1ec7 nhanh qua \u0111i\u1ec7n tho\u1ea1i \u0111\u1ec3 \u0111\u01b0\u1ee3c h\u1ed7 tr\u1ee3 xem gi\u00e1 th\u00e0nh vi\u00ean, \u0111\u1eb7t h\u00e0ng, theo d\u00f5i \u0111\u01a1n v\u00e0 gi\u1ea3i \u0111\u00e1p c\u00e1c ch\u00ednh s\u00e1ch mua h\u00e0ng, b\u1ea3o h\u00e0nh, \u0111\u1ed5i tr\u1ea3.</div></div>' +
        '</div>' +
        '<div class="phanphan-footer-grid">' +
          '<div class="phanphan-footer-card">' +
            '<div class="phanphan-card-label green">Li\u00ean h\u1ec7 tr\u1ef1c ti\u1ebfp</div>' +
            '<ul class="phanphan-footer-list">' +
              '<li><strong>Hotline:</strong> <a href="tel:{{PHONE}}">{{PHONE}}</a></li>' +
              '<li><strong>Website:</strong> <a href="{{WEBSITE_URL}}" target="_blank" rel="noopener">{{BRAND_NAME}}</a></li>' +
              '<li><strong>H\u1ed7 tr\u1ee3:</strong> Xem gi\u00e1, \u0111\u1eb7t h\u00e0ng, b\u1ea3o h\u00e0nh, \u0111\u1ed5i tr\u1ea3 v\u00e0 h\u01b0\u1edbng d\u1eabn t\u00e0i kho\u1ea3n</li>' +
            '</ul>' +
            '<div class="phanphan-footer-actions">' +
              '<a class="phanphan-btn primary" href="tel:{{PHONE}}">\uD83D\uDCDE G\u1ecdi ngay</a>' +
              '<a class="phanphan-btn secondary" href="{{WEBSITE_URL}}/dang-nhap" target="_blank" rel="noopener">\u0110\u0103ng nh\u1eadp</a>' +
            '</div>' +
          '</div>' +
          '<div class="phanphan-footer-card">' +
            '<div class="phanphan-card-label blue">\u0110\u1ecba ch\u1ec9 & h\u1ed7 tr\u1ee3 \u0111\u01a1n h\u00e0ng</div>' +
            '<ul class="phanphan-footer-list">' +
              '<li><strong>\u0110\u1ecba ch\u1ec9:</strong> {{ADDRESS}}</li>' +
              '<li><strong>Gi\u1edd h\u1ed7 tr\u1ee3:</strong> 09:00 - 22:00 t\u1eeb th\u1ee9 2 \u0111\u1ebfn Ch\u1ee7 nh\u1eadt</li>' +
              '<li><strong>Ti\u1ebfp nh\u1eadn:</strong> T\u01b0 v\u1ea5n mua h\u00e0ng, ti\u1ebfp nh\u1eadn b\u1ea3o h\u00e0nh, h\u1ed7 tr\u1ee3 sau b\u00e1n</li>' +
              '<li><strong>L\u01b0u \u00fd:</strong> N\u00ean li\u00ean h\u1ec7 tr\u01b0\u1edbc khi qua tr\u1ef1c ti\u1ebfp ho\u1eb7c g\u1eedi h\u00e0ng c\u1ea7n h\u1ed7 tr\u1ee3</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="phanphan-footer-links">' +
          '<a href="{{WEBSITE_URL}}/gioi-thieu" target="_blank" rel="noopener">Gi\u1edbi thi\u1ec7u</a>' +
          '<a href="{{WEBSITE_URL}}/huong-dan-dang-nhap" target="_blank" rel="noopener">H\u01b0\u1edbng d\u1eabn \u0111\u0103ng nh\u1eadp</a>' +
          '<a href="{{WEBSITE_URL}}/chinh-sach" target="_blank" rel="noopener">Ch\u00ednh s\u00e1ch</a>' +
        '</div>' +
        '<div class="phanphan-footer-bottom">' +
          '<div class="phanphan-footer-image"><img src="{{IMAGE_URL}}" alt="{{BRAND_NAME}}" /></div>' +
          '<div class="phanphan-footer-meta"><h3>{{BRAND_NAME}}</h3>' +
          '<p>N\u1ec1n t\u1ea3ng mua s\u1eafm \u0111a ng\u00e0nh v\u00e0 c\u01a1 h\u1ed9i kinh doanh dropship, h\u1ed7 tr\u1ee3 kh\u00e1ch h\u00e0ng xem gi\u00e1 th\u00e0nh vi\u00ean, \u0111\u1eb7t h\u00e0ng nhanh v\u00e0 theo d\u00f5i \u0111\u01a1n tr\u1ef1c ti\u1ebfp tr\u00ean website.</p></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var css =
    '#jj-custom-footer{max-width:1313px;margin:28px auto;padding:0 14px;box-sizing:border-box;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;}' +
    '#jj-custom-footer *{box-sizing:border-box;}' +
    '.phanphan-footer-wrap{background:#ffffff;border:1px solid #dbe8d2;border-radius:22px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.05);}' +
    '.phanphan-footer-top{background:linear-gradient(135deg,var(--jj-c1) 0%,var(--jj-c2) 100%);border-radius:18px;padding:22px 22px 20px;color:#fff;margin-bottom:18px;box-shadow:0 10px 24px rgba(92,164,42,.22);}' +
    '.phanphan-footer-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;background:rgba(255,255,255,.16);padding:8px 12px;border-radius:999px;margin-bottom:12px;}' +
    '.phanphan-footer-title{margin:0 0 14px 0;font-size:30px;line-height:1.2;font-weight:800;}' +
    '.phanphan-footer-note{display:flex;align-items:flex-start;gap:12px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);padding:14px 16px;border-radius:14px;font-size:14px;line-height:1.65;}' +
    '.phanphan-note-icon{font-size:18px;line-height:1;flex:0 0 auto;margin-top:1px;}' +
    '.phanphan-footer-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}' +
    '.phanphan-footer-card{background:#fbfdf9;border:1px solid #dfead8;border-radius:18px;padding:18px;box-shadow:0 4px 12px rgba(0,0,0,.03);}' +
    '.phanphan-card-label{display:inline-block;font-size:14px;font-weight:800;margin-bottom:14px;}' +
    '.phanphan-card-label.green{color:var(--jj-c2);}.phanphan-card-label.blue{color:#2563eb;}' +
    '.phanphan-footer-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;}' +
    '.phanphan-footer-list li{font-size:15px;line-height:1.7;color:#404040;padding-bottom:10px;border-bottom:1px dashed #e5ece0;}' +
    '.phanphan-footer-list li:last-child{border-bottom:none;padding-bottom:0;}' +
    '.phanphan-footer-list strong{color:#1b1b1b;}.phanphan-footer-list a{color:var(--jj-c2);text-decoration:none;font-weight:700;}' +
    '.phanphan-footer-list a:hover{text-decoration:underline;}' +
    '.phanphan-footer-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;}' +
    '.phanphan-btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 16px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:700;transition:.2s ease;}' +
    '.phanphan-btn.primary{background:var(--jj-c1);color:#fff;box-shadow:0 8px 16px rgba(99,178,51,.22);}' +
    '.phanphan-btn.primary:hover{transform:translateY(-1px);opacity:.95;}' +
    '.phanphan-btn.secondary{background:#f2f7ee;color:var(--jj-c2);border:1px solid #cfe0c4;}' +
    '.phanphan-btn.secondary:hover{background:#ebf4e5;}' +
    '.phanphan-footer-links{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;}' +
    '.phanphan-footer-links a{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border-radius:999px;background:#f6fbf1;border:1px solid #dfead8;color:var(--jj-c2);text-decoration:none;font-size:13px;font-weight:700;}' +
    '.phanphan-footer-links a:hover{background:#eef8e6;}' +
    '.phanphan-footer-bottom{display:grid;grid-template-columns:320px 1fr;gap:18px;align-items:center;background:#f8fbf5;border:1px solid #dfead8;border-radius:18px;padding:16px;}' +
    '.phanphan-footer-image img{width:100%;display:block;border-radius:14px;object-fit:cover;box-shadow:0 6px 18px rgba(0,0,0,.08);}' +
    '.phanphan-footer-meta h3{margin:0 0 10px 0;font-size:22px;line-height:1.3;color:#1c1c1c;}' +
    '.phanphan-footer-meta p{margin:0;font-size:15px;line-height:1.75;color:#555;}' +
    '@media(max-width:860px){.phanphan-footer-grid{grid-template-columns:1fr;}.phanphan-footer-bottom{grid-template-columns:1fr;}.phanphan-footer-title{font-size:24px;}}' +
    '@media(max-width:640px){#jj-custom-footer{padding:0 10px;}.phanphan-footer-wrap{padding:16px;border-radius:18px;}.phanphan-footer-top{padding:18px 16px;}.phanphan-footer-title{font-size:22px;}.phanphan-footer-note{font-size:13px;padding:12px 13px;}.phanphan-footer-card{padding:15px;}.phanphan-footer-list li{font-size:14px;}.phanphan-footer-meta h3{font-size:20px;}.phanphan-footer-meta p{font-size:14px;}}';

  var styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  function inject() {
    if (document.getElementById('jj-custom-footer')) return true;
    var target = document.querySelector('footer');
    if (!target) {
      var headings = document.querySelectorAll('h4,h3,h2');
      for (var i = 0; i < headings.length; i++) {
        var text = headings[i].textContent.trim().toLowerCase();
        if (text === 'th\u00f4ng tin' || text === 'thong tin' || text === 'ch\u00ednh s\u00e1ch' || text === 'chinh sach') {
          var p = headings[i];
          while (p.parentElement && !p.parentElement.matches('body,main,#root')) { p = p.parentElement; }
          target = p; break;
        }
      }
    }
    if (target) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = footerHTML;
      target.parentNode.insertBefore(wrapper, target);
      return true;
    }
    return false;
  }

  if (!inject()) { setTimeout(inject, 800); setTimeout(inject, 2000); setTimeout(inject, 4000); }
})();
</script>

<script>
(function () {
  if (!window._jjGate) return;
  var LOGIN_URL  = '{{WEBSITE_URL}}/dang-nhap';
  var GUIDE_URL  = '{{WEBSITE_URL}}/bai-viet/lien-he/huong-dan-dang-nhap';
  var AVATAR_URL = '{{IMAGE_URL}}';
  var SESSION_KEY = 'jj_popup_shown';
  var PERSIST_KEY = 'jj_popup_done';

  if (localStorage.getItem(PERSIST_KEY)) return;
  if (sessionStorage.getItem(SESSION_KEY)) return;

  function isExcludedUrl() {
    var h = window.location.href;
    var blocked = ['dang-nhap','dang-ky','tai-khoan','don-hang','quan-tri','tn-dashboard','checkout','thanh-toan'];
    for (var i = 0; i < blocked.length; i++) {
      if (h.indexOf(blocked[i]) !== -1) return true;
    }
    return false;
  }

  function animateCount(el, target, duration) {
    var start = 0, step = target / (duration / 16);
    var timer = setInterval(function () {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start).toLocaleString('vi-VN');
    }, 16);
  }

  function buildPopup() {
    if (isExcludedUrl()) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (document.getElementById('pp-overlay')) return;

    sessionStorage.setItem(SESSION_KEY, '1');

    var gSVG = '<svg width="16" height="16" viewBox="0 0 48 48">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
    '</svg>';

    if (!document.getElementById('pp-style')) {
      var style = document.createElement('style');
      style.id = 'pp-style';
      style.textContent =
        '@keyframes ppIn{from{opacity:0;transform:translateY(32px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}' +
        '@keyframes ppPulse{0%,100%{box-shadow:0 0 0 0 rgba(102,186,50,.45)}70%{box-shadow:0 0 0 10px rgba(102,186,50,0)}}' +
        '@keyframes ppDot{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}' +
        '#pp-cta:hover{filter:brightness(1.08);transform:translateY(-1px)!important}' +
        '#pp-cta{transition:all .18s ease}';
      document.head.appendChild(style);
    }

    var card = document.createElement('div');
    card.innerHTML =
      '<button id="pp-close" style="position:absolute;top:12px;right:12px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.06);border:none;cursor:pointer;font-size:14px;color:#888;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0;">&#x2715;</button>' +

      '<div style="padding:28px 22px 20px;display:flex;gap:16px;align-items:flex-start;">' +
        '<div style="flex-shrink:0;text-align:center;">' +
          '<div style="position:relative;display:inline-block;">' +
            '<img src="' + AVATAR_URL + '" style="width:68px;height:68px;border-radius:50%;object-fit:cover;border:3px solid var(--jj-c1);display:block;box-shadow:0 4px 14px rgba(102,186,50,.30);">' +
            '<span style="position:absolute;bottom:3px;right:3px;width:14px;height:14px;border-radius:50%;background:var(--jj-c1);border:2.5px solid #fff;display:block;animation:ppPulse 2s infinite;"></span>' +
          '</div>' +
          '<div style="margin-top:6px;font-size:10.5px;font-weight:700;color:var(--jj-c2);background:rgba(102,186,50,.10);border:1px solid rgba(102,186,50,.20);border-radius:999px;padding:2px 8px;white-space:nowrap;">{{PERSON_NAME}}</div>' +
        '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:12px;font-weight:700;color:var(--jj-c2);letter-spacing:.04em;text-transform:uppercase;margin-bottom:5px;">{{BRAND_NAME}}</div>' +
          '<div style="background:#f3fdf0;border:1.5px solid rgba(102,186,50,.20);border-radius:0 14px 14px 14px;padding:12px 14px;">' +
            '<div style="font-size:13.5px;color:#1a1a1a;line-height:1.65;font-style:italic;">Ch\xe0o anh em! {{BRAND_NAME}} t\u1eaft hi\u1ec3n th\u1ecb gi\xe1 do quy \u0111\u1ecbnh gi\xe1 b\xe1n t\u1ed1i thi\u1ec3u, nh\u01b0ng anh em \u0111\u0103ng nh\u1eadp b\u1eb1ng Gmail s\u1ebd th\u1ea5y gi\xe1. Nhi\u1ec1u s\u1ea3n ph\u1ea9m gi\xe1 tr\xean {{BRAND_NAME}} lu\xf4n r\u1ebb h\u01a1n Shopee 20%!</div>' +
            '<div style="margin-top:8px;"><span style="color:#f59e0b;font-size:13px;">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div style="height:1px;background:linear-gradient(90deg,transparent,rgba(102,186,50,.18),transparent);margin:0 22px;"></div>' +

      '<div style="padding:14px 22px;display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(102,186,50,.04);">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="display:flex;">' +
            '<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#a8d87a,var(--jj-c1));border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;">&#x1F600;</div>' +
            '<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#84c552,var(--jj-c2));border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;margin-left:-8px;">&#x1F60A;</div>' +
            '<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--jj-c1),var(--jj-c2));border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;margin-left:-8px;">&#x1F609;</div>' +
          '</div>' +
          'Hi\u1ec7n t\u1ea1i c\u00f3 <div style="font-size:12.5px;color:#555;line-height:1.4;"><strong id="pp-count" style="color:var(--jj-c2);font-size:14px;">0</strong> anh em <br><span style="font-size:11px;">\u0111\u0103ng nh\u1eadp v\u00e0 mua h\u00e0ng.</span></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--jj-c2);font-weight:600;">' +
          '<div style="display:flex;gap:3px;align-items:center;">' +
            '<span style="width:5px;height:5px;border-radius:50%;background:var(--jj-c1);display:inline-block;animation:ppDot 1.4s .0s infinite ease-in-out;"></span>' +
            '<span style="width:5px;height:5px;border-radius:50%;background:var(--jj-c1);display:inline-block;animation:ppDot 1.4s .2s infinite ease-in-out;"></span>' +
            '<span style="width:5px;height:5px;border-radius:50%;background:var(--jj-c1);display:inline-block;animation:ppDot 1.4s .4s infinite ease-in-out;"></span>' +
          '</div>Live' +
        '</div>' +
      '</div>' +

      '<div style="height:1px;background:linear-gradient(90deg,transparent,rgba(102,186,50,.18),transparent);margin:0 22px;"></div>' +

      '<div style="padding:18px 22px 22px;">' +
        '<div style="text-align:center;margin-bottom:14px;">' +
          '<div style="font-size:17px;font-weight:900;color:#1a1a1a;line-height:1.3;margin-bottom:6px;">B\u1ea1n \u0111ang xem gi\xe1 <span style="color:#e53e3e;text-decoration:line-through;">cao h\u01a1n</span><br>gi\xe1 th\u1ef1c t\u1ebf c\u1ee7a th\xe0nh vi\xean &#x1F625;</div>' +
          '<div style="font-size:12.5px;color:#888;line-height:1.5;">\u0110\u0103ng nh\u1eadp mi\u1ec5n ph\xed \u2014 th\u1ea5y ngay gi\xe1 s\u1ec9 d\xe0nh ri\xeang cho b\u1ea1n</div>' +
        '</div>' +
        '<a id="pp-cta" href="' + LOGIN_URL + '" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;box-sizing:border-box;padding:16px;border-radius:16px;background:linear-gradient(135deg,var(--jj-c1) 0%,var(--jj-c2) 100%);color:#fff;font-size:15.5px;font-weight:900;text-decoration:none;box-shadow:0 8px 28px rgba(102,186,50,.40);margin-bottom:10px;text-align:center;line-height:1.3;">' +
          gSVG + '<span>&#x1F511; \u0110\u0103ng nh\u1eadp b\u1eb1ng Google \u2014 mi\u1ec5n ph\xed</span>' +
        '</a>' +
        '<a id="pp-guide" href="' + GUIDE_URL + '" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;width:100%;box-sizing:border-box;padding:11px;border-radius:12px;background:#fff;border:1.5px solid rgba(102,186,50,.25);color:var(--jj-c2);font-size:13px;font-weight:700;text-decoration:none;gap:6px;">&#x2139;&#xFE0F; Ch\u01b0a bi\u1ebft c\xe1ch? H\u01b0\u1edbng d\u1eabn 2 b\u01b0\u1edbc &#x1F449;</a>' +
        '<div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;">' +
          '<span style="font-size:11px;color:#aaa;">&#x1F512; An to\xe0n 100%</span>' +
          '<span style="color:#ddd;font-size:11px;">|</span>' +
          '<span style="font-size:11px;color:#aaa;">&#x1F4B3; Mi\u1ec5n ph\xed ho\xe0n to\xe0n</span>' +
          '<span style="color:#ddd;font-size:11px;">|</span>' +
          '<span style="font-size:11px;color:#aaa;">&#x274C; Kh\xf4ng spam</span>' +
        '</div>' +
      '</div>';

    card.style.cssText = 'background:#fff;border-radius:22px;max-width:440px;width:100%;box-shadow:0 28px 80px rgba(0,0,0,.22);overflow:hidden;position:relative;animation:ppIn .4s cubic-bezier(.34,1.1,.64,1) both;font-family:Inter,system-ui,-apple-system,sans-serif;';

    var overlay = document.createElement('div');
    overlay.id = 'pp-overlay';
    Object.assign(overlay.style, {
      display:'flex', position:'fixed', top:'0', left:'0', right:'0', bottom:'0',
      zIndex:'999999', background:'rgba(0,0,0,.55)',
      alignItems:'center', justifyContent:'center', padding:'16px', boxSizing:'border-box'
    });
    overlay.appendChild(card);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    document.getElementById('pp-close').addEventListener('click', function(){ overlay.remove(); });

    /* Khi user mở newtab (đăng nhập / xem hướng dẫn) → ko hiện popup nữa */
    function dismissForever(){
      try { localStorage.setItem(PERSIST_KEY, '1'); } catch(e) {}
      overlay.remove();
    }
    var ctaEl = document.getElementById('pp-cta');
    var guideEl = document.getElementById('pp-guide');
    if (ctaEl)   ctaEl.addEventListener('click', dismissForever);
    if (guideEl) guideEl.addEventListener('click', dismissForever);

    var countEl = document.getElementById('pp-count');
    var soNguoi = Math.floor(Math.random() * 1001) + 500;
    if (countEl) animateCount(countEl, soNguoi, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(buildPopup, 900); });
  } else {
    setTimeout(buildPopup, 900);
  }
})();
</script>
<script>
(function(){
  if(!window._jjGate)return;
  var COLLAPSED_HEIGHT = 300;
  var LABEL_MORE = 'Xem thêm';
  var LABEL_LESS = 'Thu gọn';

  function applyCollapse() {
  var wrapper = document.querySelector('.mb-6.mt-4.border-b.bg-white');
  if (!wrapper || wrapper.getAttribute('data-pp-collapsed')) return false;
  wrapper.setAttribute('data-pp-collapsed', '1');

  if (!document.getElementById('pp-desc-css')) {
  var s = document.createElement('style');
  s.id = 'pp-desc-css';
  s.textContent = [
  '@keyframes ppDescIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes ppShimmer{0%{background-position:200% center}100%{background-position:-200% center}}',
  '#pp-desc-shell{',
  'position:relative;',
  'border-radius:20px;',
  'padding:2px;',
  'background:linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(240,240,245,.6) 50%,rgba(255,255,255,.9) 100%);',
  'box-shadow:',
  '0 0 0 1px rgba(255,255,255,.8) inset,',
  '0 2px 20px rgba(0,0,0,.06),',
  '0 1px 3px rgba(0,0,0,.04);',
  'animation:ppDescIn .4s ease both;',
  'margin:-4px -4px 0;',
  '}',
  '#pp-desc-shell::before{',
  'content:"";',
  'position:absolute;inset:0;',
  'border-radius:20px;',
  'padding:1.5px;',
  'background:linear-gradient(135deg,rgba(255,255,255,1),rgba(200,200,220,.4),rgba(255,255,255,.9),rgba(180,180,210,.3));',
  'background-size:300% 300%;',
  '-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);',
  '-webkit-mask-composite:xor;',
  'mask-composite:exclude;',
  'animation:ppShimmer 6s linear infinite;',
  '}',
  '#pp-desc-inner{',
  'border-radius:18px;',
  'background:rgba(255,255,255,.92);',
  '-webkit-backdrop-filter:blur(24px) saturate(180%);',
  'backdrop-filter:blur(24px) saturate(180%);',
  'overflow:hidden;',
  'transition:max-height .5s cubic-bezier(.4,0,.2,1);',
  'position:relative;',
  '}',
  '#pp-desc-fade{',
  'position:absolute;bottom:0;left:0;right:0;height:52px;',
  'background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.98));',
  'pointer-events:none;',
  'transition:opacity .4s ease;',
  'border-radius:0 0 18px 18px;',
  '}',
  '#pp-desc-btn{',
  'display:flex;align-items:center;justify-content:center;gap:5px;',
  'width:100%;margin-top:10px;',
  'padding:11px 0;',
  'background:linear-gradient(135deg,rgba(255,255,255,.9),rgba(245,245,250,.8));',
  '-webkit-backdrop-filter:blur(12px);',
  'backdrop-filter:blur(12px);',
  'border:1px solid rgba(200,200,220,.5);',
  'border-radius:14px;',
  'font-size:14px;font-weight:600;',
  'color:#1d1d1f;',
  'letter-spacing:-.01em;',
  'cursor:pointer;',
  'transition:all .2s cubic-bezier(.4,0,.2,1);',
  'box-shadow:0 1px 6px rgba(0,0,0,.06),0 0 0 1px rgba(255,255,255,.8) inset;',
  'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif;',
  '}',
  '#pp-desc-btn:hover{',
  'background:linear-gradient(135deg,rgba(250,250,255,.95),rgba(240,240,250,.9));',
  'box-shadow:0 4px 16px rgba(0,0,0,.1),0 0 0 1px rgba(255,255,255,.9) inset;',
  'transform:translateY(-1px);',
  '}',
  '#pp-desc-btn:active{transform:scale(.98);opacity:.85}',
  '#pp-desc-btn svg{transition:transform .3s cubic-bezier(.4,0,.2,1)}',
  '#pp-desc-btn.expanded svg{transform:rotate(180deg)}',
  ].join('');
  document.head.appendChild(s);
  }

  var fullHeight;
  var shell = document.createElement('div');
  shell.id = 'pp-desc-shell';

  var innerDiv = document.createElement('div');
  innerDiv.id = 'pp-desc-inner';
  innerDiv.innerHTML = wrapper.innerHTML;
  innerDiv.style.maxHeight = COLLAPSED_HEIGHT + 'px';
  innerDiv.style.padding = '14px 16px 14px';

  var fade = document.createElement('div');
  fade.id = 'pp-desc-fade';
  innerDiv.appendChild(fade);

  shell.appendChild(innerDiv);
  wrapper.innerHTML = '';
  wrapper.style.border = 'none';
  wrapper.style.background = 'transparent';
  wrapper.style.padding = '4px';
  wrapper.appendChild(shell);

  fullHeight = innerDiv.scrollHeight + 40;

  var chevronSVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var btn = document.createElement('button');
  btn.id = 'pp-desc-btn';
  btn.innerHTML = '<span>' + LABEL_MORE + '</span>' + chevronSVG;

  var expanded = false;
  btn.addEventListener('click', function () {
  expanded = !expanded;
  if (expanded) {
  innerDiv.style.maxHeight = fullHeight + 'px';
  fade.style.opacity = '0';
  btn.innerHTML = '<span>' + LABEL_LESS + '</span>' + chevronSVG;
  btn.classList.add('expanded');
  } else {
  innerDiv.style.maxHeight = COLLAPSED_HEIGHT + 'px';
  fade.style.opacity = '1';
  btn.innerHTML = '<span>' + LABEL_MORE + '</span>' + chevronSVG;
  btn.classList.remove('expanded');
  }
  });

  wrapper.appendChild(btn);
  return true;
  }

  function tryApply() {
  var tries = 0;
  var t = setInterval(function () {
  if (applyCollapse() || ++tries > 25) clearInterval(t);
  }, 200);
  }

  var oP = history.pushState, oR = history.replaceState;
  history.pushState  = function () { oP.apply(history, arguments); setTimeout(tryApply, 400); };
  history.replaceState = function () { oR.apply(history, arguments); setTimeout(tryApply, 400); };
  window.addEventListener('popstate', function () { setTimeout(tryApply, 400); });

  tryApply();
})();
</script>

<script>
(function(){
  if(!window._jjGate)return;
  function seededRandom(seed, min, max) {
  var x = Math.sin(seed + 1) * 10000;
  var r = x - Math.floor(x);
  return Math.floor(r * (max - min + 1)) + min;
  }

  function getPageSeed() {
  var url = window.location.href;
  var hash = 0;
  for (var i = 0; i < url.length; i++) {
  hash = url.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
  }

  var seed = getPageSeed();

  function genBreakdown(total) {
  var p5 = seededRandom(seed + 10, 68, 80);
  var p4 = seededRandom(seed + 11, 12, 20);
  var five  = Math.floor(total * p5 / 100);
  var four  = Math.floor(total * p4 / 100);
  var three = total - five - four;
  if (three < 0) three = 0;
  return [five, four, three, 0, 0];
  }

  function fixBreakdownText(reviewCount) {
  var breakdown = genBreakdown(reviewCount);
  var all = document.querySelectorAll('*');
  for (var i = 0; i < all.length; i++) {
  var el = all[i];
  if (el.childNodes.length !== 1 || el.childNodes[0].nodeType !== 3) continue;
  var txt = el.textContent.trim();
  var mStar = txt.match(/^(\d)\s+Sao\s+\((\d+)\)$/i);
  if (mStar) {
  var star = parseInt(mStar[1], 10);
  var newCount = breakdown[5 - star] || 0;
  el.textContent = star + ' Sao (' + newCount + ')';
  continue;
  }
  var mAll = txt.match(/^Tất Cả\s+\((\d+)\)$/i);
  if (mAll) {
  el.textContent = 'Tất Cả (' + reviewCount + ')';
  continue;
  }
  }
  }

  function modifyRating() {
  var rateContainers = document.querySelectorAll('.flex.items-center.gap-2.text-sm');
  rateContainers.forEach(function(container) {
  if (container.getAttribute('data-gtm-modified')) return;
  var rateEl = container.querySelector('.ant-rate');
  if (!rateEl) return;

  var starInt  = seededRandom(seed,  40, 50);
  var starAvg  = (starInt / 10).toFixed(1);
  var buyCount  = seededRandom(seed + 2, 50, 400);
  var reviewPct   = seededRandom(seed + 1, 20, 70);
  var reviewCount = Math.floor(buyCount * reviewPct / 100);
  if (reviewCount < 5) reviewCount = 5;

  var starItems = rateEl.querySelectorAll('.ant-rate-star');
  var fullStars = Math.floor(starAvg);
  var hasHalf   = (starAvg - fullStars) >= 0.5;

  starItems.forEach(function(item, index) {
  item.classList.remove('ant-rate-star-full', 'ant-rate-star-half', 'ant-rate-star-zero');
  if (index < fullStars) {
  item.classList.add('ant-rate-star-full');
  } else if (index === fullStars && hasHalf) {
  item.classList.add('ant-rate-star-half');
  } else {
  item.classList.add('ant-rate-star-zero');
  }
  });

  var avgSpan = document.createElement('span');
  avgSpan.style.cssText = 'font-weight:700;color:#faad14;font-size:15px;margin-right:4px;';
  avgSpan.textContent = starAvg;

  var reviewSpan = document.createElement('span');
  reviewSpan.style.cssText = 'margin-left:8px;color:#555;font-size:13px;border-left:1px solid #ddd;padding-left:8px;';
  reviewSpan.textContent = reviewCount + ' Đánh Giá';

  var buySpan = document.createElement('span');
  buySpan.style.cssText = 'margin-left:8px;color:#555;font-size:13px;border-left:1px solid #ddd;padding-left:8px;';
  buySpan.innerHTML = '&#128722; ' + buyCount + ' Lượt mua';

  container.insertBefore(avgSpan, rateEl);
  container.appendChild(reviewSpan);
  container.appendChild(buySpan);
  container.setAttribute('data-gtm-modified', '1');

  setTimeout(function() { fixBreakdownText(reviewCount); }, 300);
  setTimeout(function() { fixBreakdownText(reviewCount); }, 1000);
  });
  }

  modifyRating();

  var observer = new MutationObserver(function(mutations) {
  for (var i = 0; i < mutations.length; i++) {
  if (mutations[i].addedNodes.length > 0) { modifyRating(); break; }
  }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(function() { observer.disconnect(); }, 15000);

  setTimeout(modifyRating, 1000);
  setTimeout(modifyRating, 3000);
  setTimeout(modifyRating, 6000);

  var lastUrl = location.href;
  setInterval(function() {
  if (location.href !== lastUrl) {
  lastUrl = location.href;
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(modifyRating, 500);
  setTimeout(modifyRating, 1500);
  setTimeout(function() { observer.disconnect(); }, 15000);
  }
  }, 1000);
})();
</script>

<script>
(function(){
  if(!window._jjGate)return;
  var DONE = false;

  function isLoginPage() {
  var h = window.location.href;
  return h.indexOf('dang-nhap') !== -1 || h.indexOf('login') !== -1;
  }

  function patch() {
  if (DONE) return;
  if (!isLoginPage()) return;

  var googleBtn = null;
  var allBtns = document.querySelectorAll('button, a, [role="button"]');
  for (var i = 0; i < allBtns.length; i++) {
  var t = (allBtns[i].textContent || '').trim();
  if (t.indexOf('Google') !== -1 || t.indexOf('google') !== -1) {
  googleBtn = allBtns[i];
  break;
  }
  }

  var form = document.querySelector('form.ant-form') ||
  document.querySelector('form') ||
  document.querySelector('.ant-form');

  if (!googleBtn || !form) return;
  if (document.getElementById('pp-google-wrap')) return;

  DONE = true;

  if (!document.getElementById('pp-ln-css')) {
  var st = document.createElement('style');
  st.id = 'pp-ln-css';
  st.textContent =
  '@keyframes ppGlow{0%,100%{box-shadow:0 0 0 0 rgba(102,186,50,.5),0 8px 32px rgba(102,186,50,.35)}50%{box-shadow:0 0 0 10px rgba(102,186,50,.0),0 8px 40px rgba(102,186,50,.55)}}' +
  '@keyframes ppShine{0%{left:-110%}100%{left:140%}}' +
  '@keyframes ppBadgePop{from{opacity:0;transform:scale(.7) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}' +
  '@keyframes ppOrb{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:.3}}' +
  '#pp-google-wrap{' +
  'margin-bottom:20px;' +
  '}' +
  '#pp-google-card{' +
  'position:relative;overflow:hidden;' +
  'background:linear-gradient(145deg,#1e7a34,#2ea043,#34c759);' +
  'border-radius:18px;padding:20px 18px 18px;' +
  'box-shadow:0 8px 32px rgba(52,199,89,.35);' +
  'animation:ppGlow 2.5s ease-in-out infinite;' +
  '}' +
  '#pp-google-card::before{' +
  'content:"";position:absolute;top:0;left:-110%;width:55%;height:100%;' +
  'background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);' +
  'animation:ppShine 3s 1s infinite;' +
  '}' +
  '.pp-orb{position:absolute;border-radius:50%;pointer-events:none;animation:ppOrb 5s ease-in-out infinite;}' +
  '#pp-google-label{' +
  'font-size:10.5px;font-weight:800;color:rgba(255,255,255,.8);' +
  'letter-spacing:.1em;text-transform:uppercase;' +
  'text-align:center;margin-bottom:10px;' +
  '}' +
  '#pp-google-btn-wrap{' +
  'background:#fff;border-radius:13px;padding:2px;' +
  'box-shadow:0 4px 16px rgba(0,0,0,.18);' +
  '}' +
  '#pp-google-btn-inner{' +
  'display:flex;align-items:center;justify-content:center;gap:10px;' +
  'width:100%;box-sizing:border-box;padding:13px 16px;' +
  'border-radius:11px;background:#fff;border:none;cursor:pointer;' +
  'font-size:15px;font-weight:800;color:#1a5c2a;' +
  'font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;' +
  'transition:background .15s;' +
  '}' +
  '#pp-google-btn-inner:hover{background:#f0fdf4;}' +
  '#pp-google-badge{' +
  'display:flex;align-items:center;justify-content:center;gap:6px;' +
  'margin-top:10px;animation:ppBadgePop .5s .3s both;' +
  '}' +
  '.pp-badge-item{' +
  'font-size:10.5px;font-weight:700;color:rgba(255,255,255,.85);' +
  'background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);' +
  'border-radius:999px;padding:3px 9px;' +
  '}' +
  '#pp-divider-wrap{' +
  'display:flex;align-items:center;gap:10px;margin:16px 0 4px;' +
  '}' +
  '#pp-divider-wrap hr{flex:1;border:none;border-top:1px solid #e5e7eb;margin:0;}' +
  '#pp-divider-wrap span{font-size:11.5px;color:#9ca3af;white-space:nowrap;font-weight:500;}' +
  '#pp-form-label{' +
  'font-size:13px;font-weight:700;color:#374151;' +
  'margin-bottom:8px;display:flex;align-items:center;gap:6px;' +
  '}';
  document.head.appendChild(st);
  }

  var wrap = document.createElement('div');
  wrap.id = 'pp-google-wrap';

  var card = document.createElement('div');
  card.id = 'pp-google-card';

  var orbs = [
  {w:100,h:100,top:'-30px',right:'-30px',bg:'rgba(255,255,255,.10)',delay:'0s'},
  {w:60, h:60, bottom:'-20px',left:'10px',bg:'rgba(255,255,255,.07)',delay:'-2.5s'}
  ];
  orbs.forEach(function(o) {
  var el = document.createElement('div');
  el.className = 'pp-orb';
  el.style.cssText = 'width:'+o.w+'px;height:'+o.h+'px;background:'+o.bg+';animation-delay:'+o.delay+';';
  if (o.top)  el.style.top  = o.top;
  if (o.right)  el.style.right  = o.right;
  if (o.bottom) el.style.bottom = o.bottom;
  if (o.left)   el.style.left   = o.left;
  card.appendChild(el);
  });

  var lbl = document.createElement('div');
  lbl.id = 'pp-google-label';
  lbl.innerHTML = '\u26a1 C\xE1ch nhanh nh\u1EA5t \u2014 1 click l\xe0 xong';
  card.appendChild(lbl);

  var btnWrap = document.createElement('div');
  btnWrap.id = 'pp-google-btn-wrap';

  var btnInner = document.createElement('button');
  btnInner.id = 'pp-google-btn-inner';
  btnInner.innerHTML =
  '<svg width="20" height="20" viewBox="0 0 48 48">' +
  '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
  '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
  '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
  '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
  '</svg>' +
  '<span>\u0110\u0103ng nh\u1EADp b\u1EB1ng Google</span>';

  btnInner.addEventListener('click', function () { googleBtn.click(); });
  btnWrap.appendChild(btnInner);
  card.appendChild(btnWrap);

  var badge = document.createElement('div');
  badge.id = 'pp-google-badge';
  badge.innerHTML =
  '<span class="pp-badge-item">&#x1F512; An to\xe0n</span>' +
  '<span class="pp-badge-item">&#x26A1; Si\xeau nhanh</span>' +
  '<span class="pp-badge-item">&#x1F381; Mi\u1EC5n ph\xed</span>';
  card.appendChild(badge);
  wrap.appendChild(card);

  var div = document.createElement('div');
  div.id = 'pp-divider-wrap';
  div.innerHTML = '<hr><span>ho\u1eb7c \u0111\u0103ng nh\u1eadp b\u1eb1ng t\xe0i kho\u1ea3n</span><hr>';
  wrap.appendChild(div);

  form.parentNode.insertBefore(wrap, form);

  var googleParent = googleBtn.closest('div') || googleBtn.parentNode;
  if (googleParent && googleParent !== form) {
  googleParent.style.display = 'none';
  }
  }

  function hookHistory() {
  var oP = history.pushState;
  var oR = history.replaceState;
  history.pushState  = function () { oP.apply(history, arguments); onNav(); };
  history.replaceState = function () { oR.apply(history, arguments); onNav(); };
  window.addEventListener('popstate', onNav);
  }

  function onNav() {
  DONE = false;
  var old = document.getElementById('pp-google-wrap');
  if (old) old.remove();
  setTimeout(patch, 400);
  setTimeout(patch, 1000);
  setTimeout(patch, 2200);
  }

  hookHistory();

  if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
  setTimeout(patch, 400);
  setTimeout(patch, 1000);
  setTimeout(patch, 2200);
  });
  } else {
  setTimeout(patch, 400);
  setTimeout(patch, 1000);
  setTimeout(patch, 2200);
  }
})();
</script>

<script>
(function(){
  if(!window._jjGate)return;
  var FLASH_URL = '/flash-sale';
  var applied = false;

  function isHomePage() {
  var p = window.location.pathname;
  return p === '/' || p === '' || p === '/index.html';
  }

  function getEndTime() {
  var end = new Date();
  end.setHours(23, 59, 59, 0);
  return end;
  }

  function formatTime(ms) {
  if (ms <= 0) return { h: '00', m: '00', s: '00' };
  var totalSec = Math.floor(ms / 1000);
  return {
  h: String(Math.floor(totalSec / 3600)).padStart(2, '0'),
  m: String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0'),
  s: String(totalSec % 60).padStart(2, '0')
  };
  }

  function hideCarousel() {
  var els = document.querySelectorAll('.home-categories-carousel_container__Uru3C');
  for (var i = 0; i < els.length; i++) {
  els[i].style.cssText = 'display:none!important;';
  }
  }

  function injectBanner() {
  if (!isHomePage()) return;
  hideCarousel();
  if (document.getElementById('tms-flash-banner')) return;

  var carousel = document.querySelector('.home-categories-carousel_container__Uru3C');
  var target = carousel || document.querySelector('main') || document.querySelector('#__next') || document.querySelector('#root') || document.body.firstElementChild;
  if (!target) return;
  applied = true;

  if (!document.getElementById('tms-flash-css')) {
  var style = document.createElement('style');
  style.id = 'tms-flash-css';
  style.textContent =
  '@keyframes tmsSlide{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}' +
  '@keyframes tmsFlash{0%,100%{opacity:1}50%{opacity:.4}}' +
  '@keyframes tmsShine{0%{left:-130%}100%{left:170%}}' +
  '@keyframes tmsOrb{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}' +
  '#tms-flash-banner{animation:tmsSlide .5s cubic-bezier(.34,1.1,.64,1) both;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,system-ui,sans-serif;background:linear-gradient(135deg,#1a5c2a 0%,#1e7a34 30%,#25a244 65%,#34c759 100%);border-radius:20px;margin:14px 12px 6px;overflow:hidden;position:relative;box-shadow:0 16px 48px rgba(52,199,89,.28),0 0 0 1px rgba(255,255,255,.08);}' +
  '@media(min-width:1024px){#tms-flash-inner{flex-direction:row;align-items:center;padding:22px 28px 20px;gap:24px;}#tms-flash-left{flex:1;}#tms-flash-title{font-size:26px;}#tms-flash-sub{font-size:13.5px;}#tms-flash-right{align-items:flex-end;gap:14px;}.tms-digit{min-width:44px;padding:6px 10px;}.tms-digit .tms-dnum{font-size:22px;}.tms-digit .tms-dlbl{font-size:9px;}#tms-flash-btn{font-size:14.5px;padding:13px 26px;border-radius:15px;}#tms-flash-badge-row{margin-bottom:12px;}.tms-tag{font-size:11px;padding:4px 11px;}#tms-flash-banner{border-radius:22px;margin:16px 0 8px;}}' +
  '@media(min-width:641px) and (max-width:1023px){#tms-flash-inner{flex-direction:row;align-items:center;padding:18px 22px 16px;gap:18px;}#tms-flash-left{flex:1;}#tms-flash-title{font-size:22px;}#tms-flash-sub{font-size:12.5px;}#tms-flash-right{align-items:flex-end;gap:10px;}.tms-digit{min-width:40px;padding:5px 9px;}.tms-digit .tms-dnum{font-size:19px;}.tms-digit .tms-dlbl{font-size:8.5px;}#tms-flash-btn{font-size:13.5px;padding:12px 22px;}.tms-tag{font-size:10.5px;padding:3px 9px;}}' +
  '@media(max-width:640px){#tms-flash-inner{flex-direction:column;align-items:stretch;padding:16px 16px 14px;gap:14px;}#tms-flash-right{flex-direction:row;align-items:center;justify-content:space-between;}#tms-flash-title{font-size:20px;}#tms-flash-sub{font-size:12px;}.tms-digit{min-width:36px;padding:5px 8px;}.tms-digit .tms-dnum{font-size:17px;}.tms-digit .tms-dlbl{font-size:8px;}#tms-flash-btn{font-size:13px;padding:11px 18px;border-radius:13px;}.tms-tag{font-size:10px;padding:3px 8px;}.tms-sep{font-size:16px;}#tms-flash-banner{border-radius:16px;margin:10px 8px 4px;}}' +
  '#tms-flash-btn{position:relative;overflow:hidden;transition:all .2s ease;}' +
  '#tms-flash-btn::after{content:"";position:absolute;top:0;left:-130%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);animation:tmsShine 2.6s 1.2s infinite;}' +
  '#tms-flash-btn:hover{transform:scale(1.025);box-shadow:0 12px 36px rgba(52,199,89,.45)!important;}' +
  '.tms-sep{animation:tmsFlash 1s infinite;}' +
  '.tms-orb{animation:tmsOrb 7s ease-in-out infinite;pointer-events:none;}';
  document.head.appendChild(style);
  }

  var banner = document.createElement('div');
  banner.id = 'tms-flash-banner';
  banner.innerHTML =
  '<div class="tms-orb" style="position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.12) 0%,transparent 70%);"></div>' +
  '<div class="tms-orb" style="position:absolute;bottom:-40px;left:10px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.08) 0%,transparent 70%);animation-delay:-3s;"></div>' +
  '<div style="position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.02) 0px,rgba(255,255,255,.02) 1px,transparent 1px,transparent 24px);pointer-events:none;"></div>' +
  '<div id="tms-flash-inner" style="display:flex;position:relative;z-index:1;">' +
  '<div id="tms-flash-left">' +
  '<div id="tms-flash-badge-row" style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:10px;">' +
  '<span class="tms-tag" style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);color:#fff;display:inline-flex;align-items:center;gap:5px;border-radius:999px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> FLASH SALE</span>' +
  '<span class="tms-tag" style="background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);color:rgba(255,255,255,.9);display:inline-flex;align-items:center;gap:5px;border-radius:999px;">&#x1F525; Ch\u1ec9 h\xf4m nay</span>' +
  '<span class="tms-tag" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.85);display:inline-flex;align-items:center;gap:5px;border-radius:999px;">&#x23F0; Gi\u1edbi h\u1ea1n s\u1ed1 l\u01b0\u1ee3ng</span>' +
  '</div>' +
  '<div id="tms-flash-title" style="font-weight:900;color:#fff;line-height:1.2;letter-spacing:-.4px;margin-bottom:7px;">Gi\u1ea3m \u0111\u1ebfn&nbsp;<span style="background:rgba(255,255,255,.22);border-radius:8px;padding:0 6px;">70%</span>&nbsp;r\u1ea5t nhi\u1ec1u s\u1ea3n ph\u1ea9m</div>' +
  '<div id="tms-flash-sub" style="color:rgba(255,255,255,.72);line-height:1.55;font-weight:400;">C\xf4ng ngh\u1ec7, gia d\u1ee5ng ch\xednh h\xe3ng \u2014 gi\xe1 s\u1ed1c \u2014 s\u1ed1 l\u01b0\u1ee3ng c\xf3 h\u1ea1n m\u1ed7i ng\xe0y. \u0110\u0102NG K\xdd HO\u1eb6C \u0110\u0102NG NH\u1eacP \u0110I ANH EM</div>' +
  '</div>' +
  '<div id="tms-flash-right" style="display:flex;flex-direction:column;">' +
  '<div style="display:flex;align-items:center;gap:4px;">' +
  '<div class="tms-digit" style="display:inline-flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.15);border-radius:10px;backdrop-filter:blur(12px);"><span class="tms-dnum" id="tms-h" style="font-weight:900;color:#fff;line-height:1;letter-spacing:-.5px;">00</span><span class="tms-dlbl" style="font-weight:600;color:rgba(255,255,255,.55);text-transform:uppercase;margin-top:3px;letter-spacing:.06em;">Gi\u1edd</span></div>' +
  '<span class="tms-sep" style="font-weight:900;color:rgba(255,255,255,.6);padding:0 1px;margin-bottom:10px;">:</span>' +
  '<div class="tms-digit" style="display:inline-flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.15);border-radius:10px;backdrop-filter:blur(12px);"><span class="tms-dnum" id="tms-m" style="font-weight:900;color:#fff;line-height:1;letter-spacing:-.5px;">00</span><span class="tms-dlbl" style="font-weight:600;color:rgba(255,255,255,.55);text-transform:uppercase;margin-top:3px;letter-spacing:.06em;">Ph\xfat</span></div>' +
  '<span class="tms-sep" style="font-weight:900;color:rgba(255,255,255,.6);padding:0 1px;margin-bottom:10px;">:</span>' +
  '<div class="tms-digit" style="display:inline-flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.15);border-radius:10px;backdrop-filter:blur(12px);"><span class="tms-dnum" id="tms-s" style="font-weight:900;color:#fff;line-height:1;letter-spacing:-.5px;">00</span><span class="tms-dlbl" style="font-weight:600;color:rgba(255,255,255,.55);text-transform:uppercase;margin-top:3px;letter-spacing:.06em;">Gi\xe2y</span></div>' +
  '</div>' +
  '<a id="tms-flash-btn" href="' + FLASH_URL + '" style="display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:14px;background:#fff;color:#1a5c2a;font-weight:900;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.2);letter-spacing:.01em;white-space:nowrap;text-align:center;margin-top:10px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="#34c759"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>Xem Flash Sale&nbsp;<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>' +
  '</div>' +
  '</div>' +
  '<div style="height:3px;background:linear-gradient(to right,rgba(255,255,255,.15),rgba(255,255,255,.4),rgba(255,255,255,.15));"></div>';

  target.parentNode.insertBefore(banner, target);
  hideCarousel();

  var endTime = getEndTime();
  function tick() {
  var t = formatTime(endTime - new Date());
  var elH = document.getElementById('tms-h');
  var elM = document.getElementById('tms-m');
  var elS = document.getElementById('tms-s');
  if (elH) elH.textContent = t.h;
  if (elM) elM.textContent = t.m;
  if (elS) elS.textContent = t.s;
  }
  tick();
  setInterval(tick, 1000);
  }

  function onUrlChange() {
  applied = false;
  var old = document.getElementById('tms-flash-banner');
  if (old) old.remove();
  if (!isHomePage()) return;
  setTimeout(injectBanner, 400);
  setTimeout(injectBanner, 1200);
  setTimeout(injectBanner, 2500);
  }

  var _push = history.pushState;
  var _replace = history.replaceState;
  history.pushState  = function () { _push.apply(this, arguments); onUrlChange(); };
  history.replaceState = function () { _replace.apply(this, arguments); onUrlChange(); };
  window.addEventListener('popstate', onUrlChange);

  var observer = new MutationObserver(function () {
  if (!isHomePage()) return;
  hideCarousel();
  if (!document.getElementById('tms-flash-banner')) { applied = false; injectBanner(); }
  });

  if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
  if (isHomePage()) {
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(injectBanner, 400);
  setTimeout(injectBanner, 1200);
  setTimeout(injectBanner, 2500);
  }
  });
  } else {
  if (isHomePage()) {
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(injectBanner, 400);
  setTimeout(injectBanner, 1200);
  setTimeout(injectBanner, 2500);
  }
  }
})();
</script>

<script>
(function(){
  if(!window._jjGate)return;
  var css = '.jj-logo-wrap{position:relative;display:inline-flex;align-items:center;overflow:visible;}' +
  '.jj-glow{position:absolute;inset:-8px;border-radius:16px;' +
  'background:radial-gradient(ellipse at center,rgba(16,185,129,.35) 0%,transparent 70%);' +
  'animation:jjGlowPulse 2.4s ease-in-out infinite;pointer-events:none;z-index:1;}' +
  '@keyframes jjGlowPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.3);opacity:0}}' +
  '.jj-shimmer{position:absolute;inset:0;border-radius:8px;overflow:hidden;pointer-events:none;z-index:3;}' +
  '.jj-shimmer::after{content:"";position:absolute;top:0;left:-100%;bottom:0;width:60%;' +
  'background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.65) 50%,transparent 70%);' +
  'transform:skewX(-15deg);animation:jjShimmer 3.2s ease-in-out infinite;}' +
  '@keyframes jjShimmer{0%{left:-100%}45%{left:150%}100%{left:150%}}' +
  '.jj-sparkle{position:absolute;border-radius:50%;background:#10b981;pointer-events:none;z-index:4;animation:jjSparkle 1.4s ease-in-out infinite;}' +
  '@keyframes jjSparkle{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1);opacity:1}}' +
  '.jj-tagline{position:absolute;left:0;top:50%;opacity:0;filter:blur(10px);' +
  'transform:translateY(-50%) translateX(12px);display:flex;align-items:center;z-index:5;' +
  'white-space:nowrap;pointer-events:none;' +
  'transition:opacity .55s cubic-bezier(.22,1,.36,1),filter .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1);}' +
  '.jj-tagline.jj-show{opacity:1;filter:blur(0);transform:translateY(-50%) translateX(0);pointer-events:auto;}' +
  '.jj-tagline-inner{font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;font-size:10.5px;font-weight:700;line-height:1.3;}' +
  '.jj-t-blue{background:linear-gradient(90deg,#0ea5e9,#6366f1,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}' +
  '.jj-t-gray{color:#6b7280;-webkit-text-fill-color:#6b7280;}' +
  '.jj-t-fire{background:linear-gradient(90deg,#f97316,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900;animation:jjFirePulse 1.8s ease-in-out infinite;}' +
  '@keyframes jjFirePulse{0%,100%{opacity:1}50%{opacity:.65}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function applyToLogo(logoImg) {
  if (logoImg.getAttribute('data-jj-done')) return;
  logoImg.setAttribute('data-jj-done', '1');

  logoImg.setAttribute('style',
  'height:80px !important;width:auto !important;' +
  'position:relative;z-index:2;display:block;' +
  'transition:opacity .45s ease,filter .45s ease,transform .45s ease;'
  );

  var logoLink = logoImg.closest ? logoImg.closest('a') : logoImg.parentElement;
  if (!logoLink) logoLink = logoImg.parentElement;
  logoLink.style.display = 'inline-flex';
  logoLink.style.alignItems = 'center';
  logoLink.style.overflow = 'visible';

  
  var headerEl = logoImg.closest('header') ||
  logoImg.closest('.ant-layout-header') ||
  logoImg.closest('[class*="header"]') ||
  logoImg.closest('[class*="Header"]') ||
  logoImg.closest('nav');
  if (headerEl) {
  headerEl.style.setProperty('height', 'auto', 'important');
  headerEl.style.setProperty('min-height', '90px', 'important');
  headerEl.style.setProperty('display', 'flex', 'important');
  headerEl.style.setProperty('align-items', 'center', 'important');
  headerEl.style.setProperty('overflow', 'visible', 'important');
  }

  var wrap = document.createElement('div');
  wrap.className = 'jj-logo-wrap';
  logoLink.parentNode.insertBefore(wrap, logoLink);
  wrap.appendChild(logoLink);

  var glow = document.createElement('div'); glow.className = 'jj-glow'; wrap.appendChild(glow);

  var shimmer = document.createElement('div'); shimmer.className = 'jj-shimmer';
  logoLink.appendChild(shimmer);

  var dots = [
  {top:'-8px',right:'-6px',size:'7px',delay:'0.4s'},
  {top:'4px',right:'-14px',size:'5px',delay:'1.1s'},
  {bottom:'-6px',left:'-8px',size:'6px',delay:'0.8s'},
  {bottom:'2px',right:'-10px',size:'4px',delay:'1.6s'}
  ];
  for (var i = 0; i < dots.length; i++) {
  var d = dots[i];
  var dot = document.createElement('div'); dot.className = 'jj-sparkle';
  var st = 'width:'+d.size+';height:'+d.size+';animation-delay:'+d.delay+';';
  if (d.top)  st += 'top:'+d.top+';';
  if (d.bottom) st += 'bottom:'+d.bottom+';';
  if (d.left)   st += 'left:'+d.left+';';
  if (d.right)  st += 'right:'+d.right+';';
  dot.style.cssText = st;
  wrap.appendChild(dot);
  }

  var tagline = document.createElement('div'); tagline.className = 'jj-tagline';
  tagline.innerHTML = '<div class="jj-tagline-inner">' +
  '<span class="jj-t-blue">Ng\u01b0\u1eddi anh em \u0111\u0103ng nh\u1eadp \u0111i</span><br>' +
  '<span class="jj-t-gray">gi\u00e1 r\u1ebb h\u01a1n </span>' +
  '<span class="jj-t-fire">70%</span>' +
  '<span class="jj-t-gray"> \u0111\u1ea5y \ud83d\udd25</span></div>';
  wrap.appendChild(tagline);

  function cycle() {
  setTimeout(function() {
  logoImg.setAttribute('style',
  'height:80px !important;width:auto !important;position:relative;z-index:2;display:block;' +
  'opacity:0;filter:blur(6px);transform:scale(.88);transition:opacity .45s ease,filter .45s ease,transform .45s ease;'
  );
  shimmer.style.opacity = '0';
  setTimeout(function() { tagline.className += ' jj-show'; }, 150);
  setTimeout(function() {
  tagline.className = tagline.className.replace(' jj-show','');
  setTimeout(function() {
  logoImg.setAttribute('style',
  'height:80px !important;width:auto !important;position:relative;z-index:2;display:block;' +
  'opacity:1;filter:blur(0);transform:scale(1);transition:opacity .45s ease,filter .45s ease,transform .45s ease;'
  );
  shimmer.style.opacity = '1';
  cycle();
  }, 600);
  }, 5500);
  }, 2500);
  }
  cycle();
  }

  function scanLogos() {
  var logos = document.querySelectorAll('img[alt="Logo"]:not([data-jj-done])');
  for (var i = 0; i < logos.length; i++) { applyToLogo(logos[i]); }
  }

  var observer = new MutationObserver(function(mutations) {
  for (var m = 0; m < mutations.length; m++) {
  var nodes = mutations[m].addedNodes;
  for (var n = 0; n < nodes.length; n++) {
  var node = nodes[n];
  if (node.nodeType !== 1) continue;
  if (node.tagName === 'IMG' && node.alt === 'Logo') { applyToLogo(node); }
  var imgs = node.querySelectorAll ? node.querySelectorAll('img[alt="Logo"]') : [];
  for (var j = 0; j < imgs.length; j++) { applyToLogo(imgs[j]); }
  }
  }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  scanLogos();

  var origPush = history.pushState;
  history.pushState = function() {
  origPush.apply(this, arguments);
  setTimeout(scanLogos, 300);
  setTimeout(scanLogos, 800);
  };
  window.addEventListener('popstate', function() {
  setTimeout(scanLogos, 300);
  setTimeout(scanLogos, 800);
  });

})();
</script>

<script>
(function(){
  if(!window._jjGate)return;
  if(document.getElementById('jj-global-css'))return;
  var s=document.createElement('style');
  s.id='jj-global-css';
  s.textContent=
  ".ant-input-search .ant-input-affix-wrapper," +
  ".ant-input-search .ant-input-affix-wrapper-lg {" +
  "  border-radius: 12px 0 0 12px !important;" +
  "  border: 1.5px solid #d1d1d6 !important;" +
  "  border-right: none !important;" +
  "  background: #f5f5f7 !important;" +
  "  box-shadow: none !important;" +
  "  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;" +
  "}" +
  ".ant-input-search .ant-input-affix-wrapper-focused," +
  ".ant-input-search .ant-input-affix-wrapper:focus-within {" +
  "  border-color: #34c759 !important;" +
  "  border-right: none !important;" +
  "  box-shadow: 0 0 0 3px rgba(52,199,89,0.18) !important;" +
  "  background: #fff !important;" +
  "}" +
  ".ant-input-search input.ant-input," +
  ".ant-input-search input.ant-input-lg {" +
  "  background: transparent !important;" +
  "  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif !important;" +
  "  font-size: 15px !important;" +
  "  letter-spacing: -0.01em !important;" +
  "  color: #1c1c1e !important;" +
  "}" +
  ".ant-input-search input.ant-input::placeholder," +
  ".ant-input-search input.ant-input-lg::placeholder { color: #aeaeb2 !important; }" +
  ".ant-input-search .ant-input-search-button," +
  ".ant-input-search .ant-btn.ant-input-search-button {" +
  "  border-radius: 0 12px 12px 0 !important;" +
  "  background: #34c759 !important;" +
  "  border-color: #34c759 !important;" +
  "  border-left: none !important;" +
  "  box-shadow: none !important;" +
  "  padding: 0 18px !important;" +
  "  animation: junjinGlowPulse 2.2s ease-in-out infinite !important;" +
  "}" +
  ".ant-input-search .ant-input-search-button:hover," +
  ".ant-input-search .ant-btn.ant-input-search-button:hover {" +
  "  background: #28a745 !important; border-color: #28a745 !important;" +
  "}" +
  ".ant-input-search .ant-input-group-addon:last-child {" +
  "  border-radius: 0 12px 12px 0 !important; overflow: hidden;" +
  "}" +
  "@keyframes junjinGlowPulse {" +
  "  0%,100% { box-shadow: 0 0 0 0 rgba(52,199,89,0); }" +
  "  50%  { box-shadow: 0 0 0 4px rgba(52,199,89,0.28), 0 0 12px 2px rgba(52,199,89,0.22); }" +
  "}" +
  ".junjin-search-wrap { position:relative !important; display:inline-flex !important; align-items:center !important; justify-content:center !important; cursor:pointer; border-radius:50%; }" +
  ".junjin-search-wrap::before { content:'' !important; position:absolute !important; inset:-4px !important; border-radius:50% !important; background:radial-gradient(circle,rgba(52,199,89,0.45) 0%,rgba(52,199,89,0) 70%) !important; animation:junjinRipple1 2s ease-out infinite !important; pointer-events:none !important; }" +
  ".junjin-search-wrap::after  { content:'' !important; position:absolute !important; inset:-4px !important; border-radius:50% !important; border:1.5px solid rgba(52,199,89,0.6) !important; animation:junjinRipple2 2s ease-out 0.7s infinite !important; pointer-events:none !important; }" +
  "@keyframes junjinRipple1 { 0%{transform:scale(0.9);opacity:.8} 100%{transform:scale(1.9);opacity:0} }" +
  "@keyframes junjinRipple2 { 0%{transform:scale(0.9);opacity:.6} 100%{transform:scale(2.2);opacity:0} }" +
  "@keyframes junjinIconGlow {" +
  "  0%,100% { filter:drop-shadow(0 0 2px #34c759) drop-shadow(0 0 6px rgba(52,199,89,.7)); transform:scale(1); }" +
  "  50%  { filter:drop-shadow(0 0 4px #39ff14) drop-shadow(0 0 12px rgba(57,255,20,.8)); transform:scale(1.12); }" +
  "}" +
  ".junjin-search-wrap svg { animation:junjinIconGlow 2s ease-in-out infinite !important; stroke:#34c759 !important; }" +
  "#junjin-inline-msg {" +
  "  display: none; position: absolute; left: 0; right: 0; top: calc(100% + 6px);" +
  "  z-index: 99999; pointer-events: none; opacity: 0; transform: translateY(-4px);" +
  "  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.4,0.64,1);" +
  "}" +
  "#junjin-inline-msg.jj-msg-show { opacity: 1; transform: translateY(0); }" +
  "#junjin-inline-msg .jj-msg-inner {" +
  "  background: linear-gradient(135deg, #0071e3 0%, #00a651 100%);" +
  "  border-radius: 10px; padding: 8px 32px 8px 10px; color: #fff;" +
  "  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;" +
  "  font-size: 12.5px; font-weight: 500; line-height: 1.5;" +
  "  box-shadow: 0 4px 18px rgba(0,113,227,0.22), 0 1px 6px rgba(0,0,0,0.10);" +
  "  display: flex; align-items: center; gap: 7px; position: relative;" +
  "}" +
  "#junjin-inline-msg .jj-msg-emoji { font-size: 15px; flex-shrink: 0; }" +
  "#junjin-inline-msg .jj-msg-hl { background: rgba(255,255,255,0.22); border-radius: 4px; padding: 0 4px; font-weight: 700; }" +
  "#junjin-inline-msg .jj-msg-close {" +
  "  position: absolute; top: 6px; right: 7px; background: rgba(255,255,255,0.2); border: none;" +
  "  border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center;" +
  "  justify-content: center; cursor: pointer; color: #fff; font-size: 9px;" +
  "  pointer-events: auto; transition: background 0.15s;" +
  "}" +
  "#junjin-inline-msg .jj-msg-close:hover { background: rgba(255,255,255,0.38); }" +
  "@media (min-width: 768px) { #junjin-inline-msg { display: block; } }" +
  "@media (max-width: 767px) { #junjin-inline-msg { display: none !important; } }" +
  "@keyframes jj-cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }" +
  "#jj-fake-placeholder {" +
  "  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);" +
  "  pointer-events: none; z-index: 10;" +
  "  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;" +
  "  font-size: 14px; color: #1a7a3c; font-weight: 500;" +
  "  white-space: nowrap; overflow: hidden; max-width: calc(100% - 80px);" +
  "}" +
  "#jj-fake-placeholder .jj-cursor {" +
  "  display: inline-block; width: 1.5px; height: 13px; background: #1a7a3c;" +
  "  margin-left: 1px; vertical-align: middle; animation: jj-cursor-blink 0.8s ease-in-out infinite;" +
  "}";
  document.head.appendChild(s);
})();
</script>
`
  },
  {
    id: "hide-like-dislike",
    name: "[Trang sản phẩm] Ẩn nút Like/Dislike + Tiêu đề Apple style",
    description: "Ẩn hoàn toàn nút Like/Dislike trên trang sản phẩm và áp dụng font tiêu đề phong cách Apple (SF Pro) cho tên sản phẩm",
    category: "Trang sản phẩm",
    fields: [],
    template: `<style>

/* ── Ẩn nút Like / Dislike ── */
.lucide-thumbs-up,
.lucide-thumbs-down,
.lucide-thumbs-up ~ span,
.lucide-thumbs-down ~ span {
  display: none !important;
}

/* Ẩn cả 2 button chứa thumbs-up / thumbs-down */
button:has(.lucide-thumbs-up),
button:has(.lucide-thumbs-down) {
  display: none !important;
}

/* Dự phòng nếu :has() chưa được hỗ trợ – ẩn wrapper flex chứa 2 nút */
.junjin-hidden-likes {
  display: none !important;
}

/* ── Tiêu đề sản phẩm: phong cách Apple / SF Pro ── */
h1.ant-typography,
h1.ant-typography.font-normal {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
               "SF Pro Text", "Segoe UI", sans-serif !important;
  font-size: clamp(18px, 2.2vw, 24px) !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
  letter-spacing: -0.022em !important;
  color: #1c1c1e !important;
}

</style>

<script>
(function(){
  function hideLikeButtons(){
    var thumbs = document.querySelectorAll(
      '.lucide-thumbs-up, .lucide-thumbs-down'
    );
    thumbs.forEach(function(el){
      var wrap = el.closest('.flex');
      if(wrap && !wrap.classList.contains('junjin-hidden-likes')){
        wrap.classList.add('junjin-hidden-likes');
      }
    });
  }

  hideLikeButtons();
  var obs = new MutationObserver(hideLikeButtons);
  obs.observe(document.body, { childList: true, subtree: true });
})();
</script>`
  },
  {
    id: "hide-kho-ao",
    name: "[Trang sản phẩm] Ẩn badge \"Kho ảo\" + \"Gửi từ\" + Menu mobile bottom nav",
    description: "Ẩn badge 'Kho ảo', dòng 'Gửi từ' trong ant-descriptions, và thêm thanh điều hướng bottom nav mobile với bottom sheet danh mục sản phẩm",
    category: "Trang sản phẩm",
    fields: [
      {
        key: "PRIMARY_COLOR",
        label: "Màu thương hiệu (tùy chọn)",
        placeholder: "Ví dụ: #499421 — bỏ trống = xanh lá mặc định",
        type: "color",
        description: "Mã hex màu chủ đạo cho menu bottom nav — VD: #ee4d2d (đỏ), #2563eb (xanh dương), #499421 (xanh lá). Màu đậm hơn sẽ tự tính."
      }
    ],
    template: `<style>

/* ── Ẩn badge "Kho ảo" + dòng "Thời gian lưu kho" ── */
.junjin-hidden-khoao {
  display: none !important;
}

/* CSS thuần: ẩn span có bg-teal-600 (badge Kho ảo) */
span.bg-teal-600 {
  display: none !important;
}

/* Ẩn block "mb-4 flex flex-col gap-4 px-4 lg:flex-row lg:items-center" */
div.mb-4.flex.flex-col.gap-4.px-4.lg\\:flex-row.lg\\:items-center {
  display: none !important;
}

</style>

<script>
(function(){
{{DOMAIN_LOCK_LINE}}
  function hideKhoAo(){
    document.querySelectorAll('span.bg-teal-600').forEach(function(badge){
      var parent = badge.parentElement;
      if(parent && !parent.classList.contains('junjin-hidden-khoao')){
        parent.classList.add('junjin-hidden-khoao');
      }
    });
  }

  hideKhoAo();
  var obs = new MutationObserver(hideKhoAo);
  obs.observe(document.body, { childList: true, subtree: true });
})();
</script>

<script>
(function () {
{{DOMAIN_LOCK_LINE}}
  function anGuyTu() {
    var rows = document.querySelectorAll('tr.ant-descriptions-row');
    for (var i = 0; i < rows.length; i++) {
      var label = rows[i].querySelector('.ant-descriptions-item-label');
      if (label && (label.textContent || '').trim() === 'G\u1eedi t\u1eeb') {
        rows[i].style.setProperty('display', 'none', 'important');
      }
    }
  }

  function run() {
    anGuyTu();
    setTimeout(anGuyTu, 400);
    setTimeout(anGuyTu, 1200);
    setTimeout(anGuyTu, 2500);
  }

  var oP = history.pushState, oR = history.replaceState;
  history.pushState    = function () { oP.apply(history, arguments); setTimeout(run, 300); };
  history.replaceState = function () { oR.apply(history, arguments); setTimeout(run, 300); };
  window.addEventListener('popstate', function () { setTimeout(run, 300); });

  new MutationObserver(function () { anGuyTu(); })
    .observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
</script>

<script>
(function () {
{{DOMAIN_LOCK_LINE}}
  var COLOR  = '{{PRIMARY_COLOR}}' || '#499421';
  var COLORD = (function(h){
    if (!h || h.length < 7) return '#3a7a1a';
    var r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);
    var d=function(v){return ('0'+Math.round(v*0.80).toString(16)).slice(-2);};
    return '#'+d(r)+d(g)+d(b);
  })(COLOR);

  var ICONS = {
    home:
      '<svg width="26" height="26" viewBox="0 0 28 28" fill="none">' +
      '<path d="M4 12.5L14 4l10 8.5V24a1.5 1.5 0 01-1.5 1.5h-5.25V18h-6.5v7.5H4.5A1.5 1.5 0 013 24V12.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '</svg>',
    categories:
      '<svg width="26" height="26" viewBox="0 0 28 28" fill="none">' +
      '<rect x="3" y="3" width="9.5" height="9.5" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
      '<rect x="15.5" y="3" width="9.5" height="9.5" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
      '<rect x="3" y="15.5" width="9.5" height="9.5" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
      '<rect x="15.5" y="15.5" width="9.5" height="9.5" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
      '</svg>',
    cart:
      '<svg width="26" height="26" viewBox="0 0 28 28" fill="none">' +
      '<path d="M3 4h2.5l2.8 12.5a2 2 0 002 1.5h9.4a2 2 0 001.96-1.62L23 9H7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '<circle cx="10.5" cy="22.5" r="1.5" fill="currentColor"/>' +
      '<circle cx="19.5" cy="22.5" r="1.5" fill="currentColor"/>' +
      '</svg>',
    account:
      '<svg width="26" height="26" viewBox="0 0 28 28" fill="none">' +
      '<circle cx="14" cy="10" r="5" stroke="currentColor" stroke-width="1.8" fill="none"/>' +
      '<path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
      '</svg>'
  };

  var FF = '-apple-system,BlinkMacSystemFont,SF Pro Text,Segoe UI,sans-serif';

  var MENU = [
    { icon:'&#x1F4F1;', label:'Di\u1ec7n tho\u1ea1i & Ph\u1ee5 ki\u1ec7n', url:'/dien-thoai-phu-kien_c1' },
    { icon:'&#x1F50C;', label:'Thi\u1ebft b\u1ecb \u0111i\u1ec7n gia d\u1ee5ng',  url:'/thiet-bi-dien-gia-dung_c2' },
    { icon:'&#x1F3E0;', label:'Nh\xe0 c\u1eeda & \u0110\u1eddi s\u1ed1ng',        url:'/nha-cua-doi-song_c4' },
    { icon:'&#x1F4BB;', label:'M\xe1y t\xednh & Laptop',                          url:'/may-tinh-laptop_c34' },
    { icon:'&#x26FA;',  label:'\u0110\u1ed3 Camping & C\u1eafm tr\u1ea1i',       url:'/do-camping-phuot-cam-trai_c61' }
  ];

  function hideOrigDesktop() {
    var wrappers = document.querySelectorAll('.hidden.w-52');
    for (var i = 0; i < wrappers.length; i++) {
      wrappers[i].style.setProperty('display', 'none', 'important');
    }
    var triggers = document.querySelectorAll('.ant-dropdown-trigger.bg-primary');
    for (var j = 0; j < triggers.length; j++) {
      triggers[j].style.setProperty('display', 'none', 'important');
      if (triggers[j].parentElement) {
        triggers[j].parentElement.style.setProperty('display', 'none', 'important');
      }
    }
  }

  function injectCSS() {
    if (document.getElementById('jj-bn-css')) return;
    var s = document.createElement('style');
    s.id = 'jj-bn-css';
    s.textContent =
      '.jj-bn-bar{position:fixed;bottom:0;left:0;right:0;z-index:9999;height:64px;display:flex;align-items:center;justify-content:space-around;background:#fff;border-top:1px solid rgba(0,0,0,.07);box-shadow:0 -4px 24px rgba(0,0,0,.08);padding:0 8px;font-family:' + FF + ';}' +
      '.jj-bn-item{display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#8e8e93;font-size:10px;font-weight:600;letter-spacing:.01em;flex:1;padding:4px 0;transition:color .18s;-webkit-tap-highlight-color:transparent;}' +
      '.jj-bn-item.jj-active{color:' + COLOR + ';}' +
      '.jj-bn-cat{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;flex:1;padding:4px 0;-webkit-tap-highlight-color:transparent;}' +
      '.jj-bn-cat-pill{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,' + COLOR + ',' + COLORD + ');color:#fff;border-radius:999px;width:54px;height:32px;box-shadow:0 4px 14px rgba(73,148,33,.40);transition:transform .15s,box-shadow .15s;}' +
      '.jj-bn-cat:active .jj-bn-cat-pill{transform:scale(.94);}' +
      '.jj-bn-cat-label{font-size:10px;font-weight:700;color:' + COLOR + ';letter-spacing:.01em;}' +
      '@keyframes jjAccPulse{0%,100%{filter:drop-shadow(0 0 0px ' + COLOR + ');transform:scale(1);}50%{filter:drop-shadow(0 0 6px rgba(73,148,33,.80));transform:scale(1.14);}}' +
      '@keyframes jjAccDot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.6);}}' +
      '@keyframes jjSheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
      '@keyframes jjSheetFade{from{opacity:0}to{opacity:1}}' +
      '.jj-bn-acc-wrap{position:relative;color:' + COLOR + ';animation:jjAccPulse 1.6s ease-in-out infinite;}' +
      '.jj-bn-acc-dot{position:absolute;top:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:#ff3b30;border:1.5px solid #fff;animation:jjAccDot 1.6s ease-in-out infinite;}' +
      '.jj-bn-acc-label{font-size:10px;font-weight:700;color:' + COLOR + ';letter-spacing:.01em;}';
    document.head.appendChild(s);
  }

  function buildNav() {
    var orig = document.querySelector('.sticky.inset-x-0.bottom-0.z-20');
    if (!orig || orig.getAttribute('data-jj-bn')) return;
    orig.setAttribute('data-jj-bn', '1');
    orig.style.setProperty('display', 'none', 'important');

    var bar = document.createElement('div');
    bar.id = 'jj-bottom-nav';
    bar.className = 'jj-bn-bar';

    var home = document.createElement('a');
    home.href = '/';
    home.className = 'jj-bn-item';
    home.innerHTML = ICONS.home + '<span>Trang ch\u1ee7</span>';

    var cat = document.createElement('a');
    cat.href = '/danh-muc';
    cat.className = 'jj-bn-cat';
    cat.innerHTML = '<div class="jj-bn-cat-pill">' + ICONS.categories + '</div><span class="jj-bn-cat-label">Danh m\u1ee5c</span>';
    cat.addEventListener('click', openSheet);

    var cart = document.createElement('a');
    cart.href = '/gio-hang';
    cart.className = 'jj-bn-item';
    cart.innerHTML = ICONS.cart + '<span>Gi\u1ecf h\xe0ng</span>';

    var acc = document.createElement('a');
    acc.href = '/tai-khoan';
    acc.className = 'jj-bn-item';
    acc.innerHTML =
      '<div class="jj-bn-acc-wrap">' + ICONS.account + '<span class="jj-bn-acc-dot"></span></div>' +
      '<span class="jj-bn-acc-label">T\xe0i kho\u1ea3n</span>';

    bar.appendChild(home);
    bar.appendChild(cat);
    bar.appendChild(cart);
    bar.appendChild(acc);
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '64px';

    var p = location.pathname;
    if (p === '/' || p === '') home.classList.add('jj-active');
    else if (p.indexOf('gio-hang') !== -1) cart.classList.add('jj-active');
    else if (p.indexOf('tai-khoan') !== -1) acc.classList.add('jj-active');
  }

  function openSheet(e) {
    e.preventDefault();
    e.stopPropagation();
    if (document.getElementById('jj-sheet-ov')) return;

    var ov = document.createElement('div');
    ov.id = 'jj-sheet-ov';
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.5);animation:jjSheetFade .25s ease both;';

    var sheet = document.createElement('div');
    sheet.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:999999;background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -8px 40px rgba(0,0,0,.18);animation:jjSheetUp .3s cubic-bezier(.32,1.2,.64,1) both;overflow:hidden;padding-bottom:80px;';

    var hd = document.createElement('div');
    hd.style.cssText = 'display:flex;justify-content:center;padding:12px 0 6px;cursor:pointer;';
    hd.innerHTML = '<span style="width:40px;height:4px;border-radius:999px;background:#e0e0e0;display:block;"></span>';
    hd.addEventListener('click', function () { ov.remove(); });

    var title = document.createElement('div');
    title.style.cssText = 'background:linear-gradient(135deg,' + COLOR + ',' + COLORD + ');padding:14px 18px;margin:0 14px 4px;border-radius:14px;display:flex;align-items:center;gap:10px;color:#fff;font-size:16px;font-weight:800;';
    title.textContent = 'Danh m\u1ee5c s\u1ea3n ph\u1ea9m';

    sheet.appendChild(hd);
    sheet.appendChild(title);

    for (var i = 0; i < MENU.length; i++) {
      var a = document.createElement('a');
      a.href = MENU[i].url;
      a.style.cssText = 'display:flex;align-items:center;gap:14px;padding:15px 20px;text-decoration:none;color:#1a1a1a;font-size:15px;font-weight:600;border-bottom:1px solid #f5f5f5;';
      var icon = document.createElement('span');
      icon.style.cssText = 'font-size:22px;width:36px;text-align:center;flex-shrink:0;';
      icon.innerHTML = MENU[i].icon;
      var lbl = document.createElement('span');
      lbl.textContent = MENU[i].label;
      var arr = document.createElement('span');
      arr.style.cssText = 'margin-left:auto;color:#bbb;font-size:18px;';
      arr.textContent = '\u203a';
      a.appendChild(icon); a.appendChild(lbl); a.appendChild(arr);
      sheet.appendChild(a);
    }

    var all = document.createElement('a');
    all.href = '/danh-muc';
    all.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:14px 20px;text-decoration:none;color:' + COLOR + ';font-size:14px;font-weight:700;background:#f6fdf1;margin:6px 14px 0;border-radius:14px;border:1.5px solid #d4edbe;';
    all.textContent = 'Xem t\u1ea5t c\u1ea3 danh m\u1ee5c \u2192';
    sheet.appendChild(all);

    ov.appendChild(sheet);
    document.body.appendChild(ov);
    ov.addEventListener('click', function (ev) { if (ev.target === ov) ov.remove(); });
  }

  function run() {
    injectCSS();
    hideOrigDesktop();
    buildNav();
  }

  new MutationObserver(function () {
    hideOrigDesktop();
    var orig = document.querySelector('.sticky.inset-x-0.bottom-0.z-20');
    if (orig && !orig.getAttribute('data-jj-bn')) buildNav();
  }).observe(document.body, { childList: true, subtree: true });

  var oP = history.pushState, oR = history.replaceState;
  history.pushState    = function () { oP.apply(history, arguments); setTimeout(run, 300); };
  history.replaceState = function () { oR.apply(history, arguments); setTimeout(run, 300); };
  window.addEventListener('popstate', function () { setTimeout(run, 300); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); setTimeout(run, 1000); });
  } else {
    setTimeout(run, 400); setTimeout(run, 1000);
  }

})();
</script>`
  },
  {
    id: "hide-gui-tu",
    name: "[Kho & Liên hệ] Ẩn dòng \"Gửi từ\" trong thông tin đơn hàng",
    description: "Ẩn hàng 'Gửi từ' trong bảng mô tả ant-descriptions trên các trang kho, liên hệ, địa chỉ bảo hành và footer — dùng MutationObserver + hook SPA để hoạt động trên toàn bộ trang",
    category: "Kho & Liên hệ",
    fields: [],
    template: `<script>
(function () {

  function anGuyTu() {
    var rows = document.querySelectorAll('tr.ant-descriptions-row');
    for (var i = 0; i < rows.length; i++) {
      var label = rows[i].querySelector('.ant-descriptions-item-label');
      if (label && (label.textContent || '').trim() === 'G\u1eedi t\u1eeb') {
        rows[i].style.setProperty('display', 'none', 'important');
      }
    }
  }

  function run() {
    anGuyTu();
    setTimeout(anGuyTu, 400);
    setTimeout(anGuyTu, 1200);
    setTimeout(anGuyTu, 2500);
  }

  var oP = history.pushState, oR = history.replaceState;
  history.pushState    = function () { oP.apply(history, arguments); setTimeout(run, 300); };
  history.replaceState = function () { oR.apply(history, arguments); setTimeout(run, 300); };
  window.addEventListener('popstate', function () { setTimeout(run, 300); });

  new MutationObserver(function () { anGuyTu(); })
    .observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
</script>`
  },
  {
    id: "custom-html-blank",
    name: "Script tùy chỉnh (trống)",
    description: "Tạo script HTML tùy chỉnh với các trường thay thế do bạn định nghĩa",
    category: "Tùy chỉnh",
    fields: [],
    template: `<script>
(function() {
  // Script của bạn ở đây
  // Sử dụng {{TEN_BIEN}} để tạo các trường thay thế
})();
</script>`
  },
  {
    id: "flash-sale-combo",
    name: "[Trang chủ] Flash Sale — Widget + Sản phẩm bán chạy + Banner",
    description: "Gộp 3 script: Flash Sale API widget (đếm ngược + thanh tiến trình), widget sản phẩm bán chạy hôm nay, và banner 'Gợi Ý Hôm Nay'. Chỉ cần nhập domain là dùng được cho mọi website.",
    category: "Trang chủ",
    fields: [
      {
        key: "SITE",
        label: "Domain website (để trống = tự động theo domain đang chạy)",
        placeholder: "https://junjin.ratxin.vn",
        type: "text",
        description: "Để trống: script tự nhận diện domain hiện tại. Điền nếu muốn override — VD: https://junjin.ratxin.vn"
      },
      {
        key: "TENANT_ID",
        label: "Tenant ID (để trống = tự động nhận diện từ trang)",
        placeholder: "384",
        type: "text",
        description: "Để trống: script tự tìm từ dữ liệu trang (__NEXT_DATA__, script tags). Điền nếu không tự nhận diện được — xem trong Network tab, header X-Tenant-ID khi vào trang /flash-sale."
      }
    ],
    template: `<style>
#sdn-gy-hdr{
  width:100%;
  margin:8px 0 0;
  padding:0;
  box-sizing:border-box;
}
#sdn-gy-hdr-card{background:linear-gradient(90deg,#c0392b 0%,#ee4d2d 40%,#ff6b35 70%,#f39c12 100%);border-radius:8px 8px 0 0;overflow:hidden;position:relative;box-shadow:0 2px 8px rgba(238,77,45,.25)}
#sdn-gy-hdr-card::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08)}
#sdn-gy-hdr-card::after{content:'';position:absolute;bottom:-20px;left:60px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.06)}
#sdn-gy-hdr-tab{display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 20px;position:relative;z-index:1}
#sdn-gy-hdr-tab .gy-icon{font-size:22px;line-height:1}
#sdn-gy-hdr-tab .gy-txt{font-size:17px;font-weight:900;color:#fff;letter-spacing:2px;text-transform:uppercase;text-shadow:0 1px 4px rgba(0,0,0,.2)}
#sdn-gy-hdr-tab .gy-badge{background:rgba(255,255,255,.22);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:.5px;border:1px solid rgba(255,255,255,.35)}
</style>

<script>
(function () {
{{DOMAIN_LOCK_LINE}}
  'use strict';
  var SITE      = '{{SITE}}' || (window.location.protocol + '//' + window.location.hostname);
  var TENANT_ID = (function () {
    if ('{{TENANT_ID}}') return '{{TENANT_ID}}';
    try {
      var nd = window.__NEXT_DATA__;
      if (nd && nd.props) {
        var pp = nd.props.pageProps || {};
        var cands = [pp.tenantId, pp.tenant_id,
          pp.store && pp.store.id, pp.store && pp.store.tenantId,
          pp.shopData && pp.shopData.tenantId, nd.props.tenantId];
        for (var i = 0; i < cands.length; i++) {
          if (cands[i] && !isNaN(+cands[i])) return '' + cands[i];
        }
      }
    } catch (e) {}
    try {
      var tags = document.querySelectorAll('script');
      for (var t = 0; t < tags.length; t++) {
        var m = (tags[t].textContent || '').match(/"tenant_?[Ii][dD]"\\s*:\\s*(\\d+)/);
        if (m) return m[1];
      }
    } catch (e2) {}
    return '';
  })();
  var CDN       = 'https://r6i.pen.dropbuy.vn';
  var FS_PATH   = '/flash-sale';
  var API_URL   = '/api/proxy/bff/variations/search';
  var WID       = 'jj-flash-sale';

  if (window[WID + '_loaded']) return;
  window[WID + '_loaded'] = true;

  var CSS = '' +
    '#' + WID + '{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#fff;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.08);margin:0 0 18px;overflow:hidden}' +
    '#' + WID + ' *{box-sizing:border-box}' +
    '.jjfs-hd{display:flex;align-items:center;justify-content:space-between;padding:10px 14px 8px;border-bottom:1px solid #f0f0f0}' +
    '.jjfs-left{display:flex;align-items:center;gap:8px}' +
    '.jjfs-brand{display:flex;align-items:center;line-height:1;font-style:italic;font-weight:900;letter-spacing:-.5px}' +
    '.jjfs-f{color:#ee4d2d;font-size:26px}' +
    '.jjfs-bolt{display:inline-block;width:10px;height:17px;background:linear-gradient(180deg,#ee4d2d 0%,#ff7337 100%);clip-path:polygon(50% 0%,100% 45%,62% 45%,100% 100%,0% 58%,38% 58%,0% 0%);margin:0 1px;flex-shrink:0}' +
    '.jjfs-lash{color:#1a1a1a;font-size:21px}' +
    '.jjfs-sale{color:#ee4d2d;font-size:21px;margin-left:4px}' +
    '.jjfs-timer{display:flex;align-items:center;gap:3px}' +
    '.jjfs-tb{background:#222;color:#fff;font-size:12px;font-weight:700;padding:2px 5px;border-radius:3px;min-width:24px;text-align:center;font-variant-numeric:tabular-nums}' +
    '.jjfs-sep{color:#222;font-weight:700;font-size:13px}' +
    '.jjfs-seeall{color:#ee4d2d;font-size:13px;font-weight:500;text-decoration:none;display:flex;align-items:center;gap:3px;white-space:nowrap}' +
    '.jjfs-seeall:hover{text-decoration:underline}' +
    '.jjfs-body{position:relative}' +
    '.jjfs-scroll{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}' +
    '.jjfs-scroll::-webkit-scrollbar{display:none}' +
    '.jjfs-grid{display:flex;min-width:100%}' +
    '.jjfs-arrow{position:absolute;top:0;bottom:0;width:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;border:none;outline:none;padding:0;background:none}' +
    '.jjfs-arrow-l{left:0;background:linear-gradient(to right,rgba(255,255,255,.95) 60%,rgba(255,255,255,0))}' +
    '.jjfs-arrow-r{right:0;background:linear-gradient(to left,rgba(255,255,255,.95) 60%,rgba(255,255,255,0))}' +
    '.jjfs-arrow svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.15))}' +
    '.jjfs-arrow[data-hide="1"]{display:none}' +
    '.jjfs-card{flex:0 0 calc(100%/6);min-width:130px;padding:10px 8px;border-right:1px solid #f2f2f2;cursor:pointer;text-align:center;text-decoration:none;color:inherit;display:block;background:#fff;transition:background .15s}' +
    '.jjfs-card:last-child{border-right:none}' +
    '.jjfs-card:hover{background:#fdf0ee}' +
    '@media(max-width:1023px){.jjfs-card{flex:0 0 calc(100%/4);min-width:115px}}' +
    '@media(max-width:639px){.jjfs-card{flex:0 0 50%;min-width:100px}}' +
    '.jjfs-imgw{position:relative;width:100%;padding-top:100%;border-radius:5px;overflow:hidden;background:#f6f6f6;margin-bottom:7px}' +
    '.jjfs-img{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:contain;padding:4px;transition:transform .3s ease}' +
    '.jjfs-card:hover .jjfs-img{transform:scale(1.07)}' +
    '.jjfs-badge{position:absolute;top:5px;right:5px;background:#ee4d2d;color:#fff;font-size:11px;font-weight:700;padding:2px 5px;border-radius:3px;line-height:1.4;z-index:2}' +
    '.jjfs-name{font-size:12px;color:#333;line-height:1.3;height:2.6em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:5px}' +
    '.jjfs-origrow{display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:2px;min-height:16px}' +
    '.jjfs-orig{font-size:11px;color:#999;text-decoration:line-through}' +
    '.jjfs-discbadge{display:inline-flex;align-items:center;gap:1px;background:#fff3f0;color:#ee4d2d;font-size:10px;font-weight:700;padding:1px 4px;border-radius:3px;white-space:nowrap}' +
    '.jjfs-price{font-size:15px;font-weight:800;color:#ee4d2d;margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.jjfs-barw{position:relative;height:18px;border-radius:9px;overflow:hidden;background:#fde8e4;margin:0 2px}' +
    '.jjfs-barf{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#f97316,#ee4d2d);border-radius:9px;width:0}' +
    '.jjfs-barl{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.28);z-index:2}' +
    '.jjfs-barl.jjfs-dk{color:#ee4d2d;text-shadow:none}' +
    '.jjfs-loading{padding:28px;text-align:center;color:#ccc;font-size:12px}' +
    '.jjfs-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#ee4d2d;margin:0 3px;animation:jjfsDot 1.2s infinite ease-in-out both}' +
    '.jjfs-dot:nth-child(1){animation-delay:-.24s}.jjfs-dot:nth-child(2){animation-delay:-.12s}' +
    '@keyframes jjfsDot{0%,80%,100%{transform:scale(0);opacity:.4}40%{transform:scale(1);opacity:1}}';

  function injectCSS() {
    if (!document.getElementById(WID + '-css')) {
      var s = document.createElement('style');
      s.id = WID + '-css';
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  var _endTime = 0, _timerId = null;
  function secsLeft(ms) { return Math.max(0, Math.floor((ms - Date.now()) / 1000)); }

  function startTimer(endMs) {
    if (_timerId) clearInterval(_timerId);
    _endTime = endMs;
    function tick() {
      var t = secsLeft(_endTime);
      var eh = document.getElementById(WID + '-h');
      var em = document.getElementById(WID + '-m');
      var es = document.getElementById(WID + '-s');
      if (eh) eh.textContent = pad2(Math.floor(t / 3600));
      if (em) em.textContent = pad2(Math.floor((t % 3600) / 60));
      if (es) es.textContent = pad2(t % 60);
      if (t <= 0 && _timerId) { clearInterval(_timerId); _timerId = null; }
    }
    tick();
    _timerId = setInterval(tick, 1000);
  }

  function timerStr(endMs) {
    var t = secsLeft(endMs);
    return {
      h: pad2(Math.floor(t / 3600)),
      m: pad2(Math.floor((t % 3600) / 60)),
      s: pad2(t % 60)
    };
  }

  function fVND(n) {
    var v = parseInt(('' + n).replace(/[^\\d]/g, ''), 10);
    return v ? v.toLocaleString('vi-VN') + 'd' : '';
  }

  function buildHeader(endMs) {
    var tm = timerStr(endMs || Date.now() + 3600000);
    return '<div class="jjfs-hd">' +
      '<div class="jjfs-left">' +
        '<div class="jjfs-brand">' +
          '<span class="jjfs-f">F</span>' +
          '<span class="jjfs-bolt"></span>' +
          '<span class="jjfs-lash">LASH</span>' +
          '<span class="jjfs-sale">SALE</span>' +
        '</div>' +
        '<div class="jjfs-timer">' +
          '<span class="jjfs-tb" id="' + WID + '-h">' + tm.h + '</span>' +
          '<span class="jjfs-sep">:</span>' +
          '<span class="jjfs-tb" id="' + WID + '-m">' + tm.m + '</span>' +
          '<span class="jjfs-sep">:</span>' +
          '<span class="jjfs-tb" id="' + WID + '-s">' + tm.s + '</span>' +
        '</div>' +
      '</div>' +
      '<a class="jjfs-seeall" href="' + SITE + FS_PATH + '" target="_blank">Xem tất cả sản phẩm giá sốc ' +
        '<svg width="5" height="9" viewBox="0 0 5 9"><path d="M1 1l3 3.5L1 8" stroke="#ee4d2d" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>' +
      '</a>' +
    '</div>';
  }

  var SVG_L = '<svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_R = '<svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M1 1L9 9L1 17" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildCards(items) {
    return items.map(function (it) {
      var img = '';
      if (it.res_thumbnail_url) {
        var raw = it.res_thumbnail_url;
        img = raw.indexOf('http') === 0 ? raw : CDN + raw;
        img = img.replace('_128x128.', '_256x256.');
      }

      var commission = 0;
      var comms = it.tenant_detail_commissions || [];
      for (var ci = 0; ci < comms.length; ci++) {
        if (comms[ci].tenant_id === +TENANT_ID) { commission = comms[ci].commission; break; }
      }
      var origP   = it.price_public || 0;
      var memberP = (commission > 0 && origP > 0)
        ? Math.round(origP * (1 - commission / 100))
        : 0;

      var prog  = (it.flash_sale_programs && it.flash_sale_programs[0]) || null;
      var saleP = (prog && prog.price_flash_sale > 0)
        ? prog.price_flash_sale
        : (memberP > 0 ? memberP : origP);
      var showO = (saleP > 0 && origP > 0 && origP > saleP);

      var fakeDisc = 65 + Math.floor(Math.random() * 31);

      var maxS = (prog && prog.max_stock  > 0) ? prog.max_stock  : 100;
      var solS = (prog && prog.sold_stock > 0) ? prog.sold_stock : 0;
      var pct  = Math.min(Math.round(solS / maxS * 100), 98);
      if (pct < 5) pct = 5 + Math.floor(Math.random() * 25);
      var dark = pct < 40;
      var lbl  = pct > 85 ? 'Gan het' : 'Đã bán ' + pct + '%';

      var link = SITE + '/' + it.slug + '_p' + it.product_id;

      var boltSvg = '<svg width="8" height="13" viewBox="0 0 8 13" fill="none" style="flex-shrink:0">' +
        '<path d="M5 0L0 7.5h3L3 13l5-7.5H5L5 0z" fill="#ee4d2d"/></svg>';

      return '<a class="jjfs-card" href="' + link + '">' +
        '<div class="jjfs-imgw">' +
          (img ? '<img class="jjfs-img" src="' + img + '" alt="">' : '') +
        '</div>' +
        '<div class="jjfs-name">' + (it.product_name || '').replace(/</g, '&lt;') + '</div>' +
        '<div class="jjfs-origrow">' +
          (showO ? '<span class="jjfs-orig">' + fVND(origP) + '</span>' : '') +
          '<span class="jjfs-discbadge">' + boltSvg + '-' + fakeDisc + '%</span>' +
        '</div>' +
        '<div class="jjfs-barw">' +
          '<div class="jjfs-barf" style="width:' + pct + '%"></div>' +
          '<div class="jjfs-barl' + (dark ? ' jjfs-dk' : '') + '">' + lbl + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  function bindArrows(container) {
    var scroll = container.querySelector('.jjfs-scroll');
    var btnL   = container.querySelector('.jjfs-arrow-l');
    var btnR   = container.querySelector('.jjfs-arrow-r');
    if (!scroll || !btnL || !btnR) return;
    function updateArrows() {
      var sl = scroll.scrollLeft;
      var maxSl = scroll.scrollWidth - scroll.clientWidth;
      btnL.setAttribute('data-hide', sl <= 2 ? '1' : '0');
      btnR.setAttribute('data-hide', sl >= maxSl - 2 ? '1' : '0');
    }
    function scrollBy(dir) {
      var step = Math.round(scroll.clientWidth * 0.75);
      scroll.scrollBy({ left: dir * step, behavior: 'smooth' });
    }
    btnL.addEventListener('click', function () { scrollBy(-1); });
    btnR.addEventListener('click', function () { scrollBy(1); });
    scroll.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  }

  function renderLoading(w, endMs) {
    w.innerHTML = buildHeader(endMs) +
      '<div class="jjfs-loading">' +
        '<span class="jjfs-dot"></span><span class="jjfs-dot"></span><span class="jjfs-dot"></span>' +
      '</div>';
    startTimer(endMs || Date.now() + 3600000);
  }

  function renderWidget(items, endMs, w) {
    if (!w || !w.parentNode) return;
    w.innerHTML = buildHeader(endMs) +
      '<div class="jjfs-body">' +
        '<button class="jjfs-arrow jjfs-arrow-l" aria-label="Truoc">' + SVG_L + '</button>' +
        '<div class="jjfs-scroll"><div class="jjfs-grid">' + buildCards(items) + '</div></div>' +
        '<button class="jjfs-arrow jjfs-arrow-r" aria-label="Sau">' + SVG_R + '</button>' +
      '</div>';
    startTimer(endMs);
    bindArrows(w);
  }

  function renderFallback(w) {
    if (!w || !w.parentNode) return;
    w.innerHTML = buildHeader(Date.now() + 3600000) +
      '<div style="padding:14px 16px;text-align:center">' +
        '<a href="' + SITE + FS_PATH + '" style="color:#ee4d2d;font-weight:600;font-size:14px;text-decoration:none">' +
          'Xem ngay cac uu dai Flash Sale hom nay ->' +
        '</a>' +
      '</div>';
    startTimer(Date.now() + 3600000);
  }

  function removeOldBanner() {
    var old = document.getElementById('tms-flash-banner');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var oldCss = document.getElementById('tms-flash-css');
    if (oldCss && oldCss.parentNode) oldCss.parentNode.removeChild(oldCss);
  }

  function findTargets() {
    var path    = window.location.pathname.replace(/\\/$/,  '');
    var targets = [];

    if (path === '' || path === '/') {
      var carousel = document.querySelector('.home-categories-carousel_container__Uru3C');
      if (carousel) {
        targets.push({ ref: carousel, pos: 'before' });
      } else {
        var divs = document.querySelectorAll('div');
        for (var i = 0; i < divs.length; i++) {
          var cls = divs[i].getAttribute('class') || '';
          if (cls.indexOf('px-2') !== -1 && cls.indexOf('md:px-0') !== -1) {
            targets.push({ ref: divs[i], pos: 'before' });
            break;
          }
        }
      }
    }

    var all = document.querySelectorAll('div');
    for (var j = 0; j < all.length; j++) {
      var c = all[j].getAttribute('class') || '';
      if (c.indexOf('grid-cols-1') !== -1 && c.indexOf('bg-white') !== -1 &&
          c.indexOf('lg:grid-cols-2') !== -1 && c.indexOf('relative') !== -1) {
        targets.push({ ref: all[j], pos: 'after' });
        break;
      }
    }

    return targets;
  }

  function insertAt(ref, pos, node) {
    var par = ref && ref.parentNode;
    if (!par) return false;
    if (pos === 'before') { par.insertBefore(node, ref); }
    else { var nx = ref.nextSibling; nx ? par.insertBefore(node, nx) : par.appendChild(node); }
    return true;
  }

  function fetchProducts(cb) {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Tenant-ID': TENANT_ID
      },
      credentials: 'include',
      body: JSON.stringify({ is_flash_sale: 'T', page_size: 20, page_num: 1 })
    })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (j) {
      var items = j && j.data && j.data.items;
      if (!items || !items.length) { cb(null, null); return; }
      var endMs = null;
      items.forEach(function (it) {
        (it.flash_sale_programs || []).forEach(function (p) {
          if (p.to_time && p.status === 'A') {
            var t = new Date(p.to_time).getTime();
            if (!endMs || t < endMs) endMs = t;
          }
        });
      });
      if (!endMs || endMs < Date.now()) endMs = Date.now() + 6 * 3600000;
      cb(items, endMs);
    })
    .catch(function () { cb(null, null); });
  }

  function launch() {
    removeOldBanner();
    injectCSS();
    var targets = findTargets();
    if (!targets.length) return false;

    var wrappers = [];
    targets.forEach(function (t) {
      if (document.getElementById(WID)) return;
      var w = document.createElement('div');
      w.id = WID;
      if (insertAt(t.ref, t.pos, w)) {
        renderLoading(w, Date.now() + 3600000);
        wrappers.push(w);
      }
    });
    if (!wrappers.length) return false;

    fetchProducts(function (items, endMs) {
      if (!items || !items.length) {
        wrappers.forEach(function (w) { renderFallback(w); });
        return;
      }
      wrappers.forEach(function (w) { renderWidget(items, endMs, w); });
    });

    return true;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') setTimeout(fn, 200);
    else document.addEventListener('DOMContentLoaded', function () { setTimeout(fn, 200); });
  }

  ready(function () {
    if (!launch()) {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (launch() || tries > 20) clearInterval(iv);
      }, 500);
    }
  });

})();
</script>

<script>
(function () {
{{DOMAIN_LOCK_LINE}}
  'use strict';

  var SITE = '{{SITE}}' || (window.location.protocol + '//' + window.location.hostname);
  var WID  = 'jj-home-fs';

  if (window[WID + '_loaded']) return;
  window[WID + '_loaded'] = true;

  var CSS = '' +
    '#' + WID + '{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.08);margin:0 0 16px;overflow:hidden}' +
    '#' + WID + ' *{box-sizing:border-box !important}' +
    '.jjhfs-hd{display:flex !important;align-items:center;justify-content:space-between;padding:10px 14px 8px;border-bottom:1px solid #f0f0f0}' +
    '.jjhfs-left{display:flex !important;align-items:center;gap:8px}' +
    '.jjhfs-fire{font-size:20px;margin-right:4px}' +
    '.jjhfs-title{color:#ee4d2d;font-size:17px;font-weight:900;letter-spacing:-.3px}' +
    '.jjhfs-seeall{color:#ee4d2d;font-size:13px;font-weight:500;text-decoration:none;display:flex !important;align-items:center;gap:3px;white-space:nowrap}' +
    '.jjhfs-seeall:hover{text-decoration:underline}' +
    '.jjhfs-scr{overflow-x:auto !important;overflow-y:hidden !important;-webkit-overflow-scrolling:touch;scrollbar-width:none !important}' +
    '.jjhfs-scr::-webkit-scrollbar{display:none !important}' +
    '.jjhfs-row{display:grid !important;grid-template-columns:repeat(6,1fr) !important;' +
      'grid-template-rows:1fr !important;align-items:start !important;width:100% !important;min-width:660px !important}' +
    '.jjhfs-card{display:block !important;text-decoration:none !important;color:inherit !important;' +
      'background:#fff !important;transition:background .15s;padding:10px 6px !important;' +
      'border-right:1px solid #f2f2f2;overflow:hidden !important;min-width:0 !important}' +
    '.jjhfs-card:last-child{border-right:none !important}' +
    '.jjhfs-card:hover{background:#fdf0ee !important}' +
    '.jjhfs-imgw{position:relative !important;width:100% !important;padding-top:100% !important;' +
      'border-radius:6px;overflow:hidden !important;background:#f6f6f6;margin-bottom:7px;display:block !important}' +
    '.jjhfs-img,.jjhfs-vid{position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;' +
      'width:100% !important;height:100% !important;object-fit:cover !important;transition:transform .3s}' +
    '.jjhfs-img{object-fit:contain !important;padding:4px}' +
    '.jjhfs-card:hover .jjhfs-img,.jjhfs-card:hover .jjhfs-vid{transform:scale(1.07)}' +
    '.jjhfs-name{font-size:12px !important;font-weight:700 !important;color:#333 !important;line-height:1.35 !important;' +
      'white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;' +
      'margin-bottom:7px !important;display:block !important;text-align:center !important}' +
    '.jjhfs-barw{position:relative !important;height:18px !important;border-radius:9px;overflow:hidden !important;background:#fde8e4;margin:0 1px}' +
    '.jjhfs-barf{position:absolute !important;left:0 !important;top:0 !important;bottom:0 !important;' +
      'background:linear-gradient(90deg,#f97316,#ee4d2d);border-radius:9px}' +
    '.jjhfs-barl{position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;' +
      'display:flex !important;align-items:center;justify-content:center;' +
      'font-size:11px !important;font-weight:700;color:#fff !important;text-shadow:0 1px 2px rgba(0,0,0,.3);z-index:2}' +
    '@keyframes jjDot{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}';

  function injectCSS() {
    if (!document.getElementById(WID + '-css')) {
      var s = document.createElement('style'); s.id = WID + '-css'; s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  function buildHeader() {
    return '<div class="jjhfs-hd">' +
      '<div class="jjhfs-left">' +
        '<span class="jjhfs-fire">&#128293;</span>' +
        '<span class="jjhfs-title">S&#7843;n ph&#7849;m b&aacute;n ch&#7841;y h&ocirc;m nay</span>' +
      '</div>' +
      '<a class="jjhfs-seeall" href="' + SITE + '" target="_blank">Xem t&#7845;t c&#7843; ' +
        '<svg width="5" height="9" viewBox="0 0 5 9"><path d="M1 1l3 3.5L1 8" stroke="#ee4d2d" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>' +
      '</a>' +
    '</div>';
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function bestImg(card) {
    if (card.querySelector('iframe')) return null;

    var vid = card.querySelector('video');
    if (vid) {
      var poster = vid.getAttribute('poster') || '';
      if (poster) return { type: 'img', src: poster };
      var src0 = vid.querySelector('source');
      if (src0) { var vs = src0.getAttribute('src') || ''; if (vs) return { type: 'vid', src: vs }; }
      var vs2 = vid.getAttribute('src') || '';
      if (vs2) return { type: 'vid', src: vs2 };
    }
    var imgs = card.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var el = imgs[i];
      var raw = el.getAttribute('src') || el.getAttribute('data-src') || '';
      var wAttr = parseInt(el.getAttribute('width') || '999', 10);
      if (wAttr < 40) continue;
      var ss = el.getAttribute('srcset') || '';
      if (ss) {
        var best = ''; var bestW = 0;
        ss.split(',').forEach(function (seg) {
          var p = seg.trim().split(/\\s+/);
          var w = parseInt(p[1] || '0', 10);
          if (w > bestW && p[0]) { bestW = w; best = p[0]; }
        });
        if (best) return { type: 'img', src: best };
      }
      if (raw) return { type: 'img', src: raw };
    }
    return null;
  }

  function bestName(card) {
    var clone = card.cloneNode(true);
    var jjEls = clone.querySelectorAll('[data-jjs]');
    for (var i = jjEls.length - 1; i >= 0; i--) {
      if (jjEls[i].parentNode) jjEls[i].parentNode.removeChild(jjEls[i]);
    }
    var divs = clone.querySelectorAll('div');
    for (var i = divs.length - 1; i >= 0; i--) {
      var cl = divs[i].getAttribute('class') || '';
      if (cl.indexOf('flex') !== -1 && cl.indexOf('w-full') !== -1 && cl.indexOf('items-center') !== -1) {
        if (divs[i].parentNode) divs[i].parentNode.removeChild(divs[i]);
      }
    }
    var txt = (clone.textContent || '').replace(/[\\d,\\.]{3,}\\s*[đdĐ]/g, '').replace(/\\s+/g, ' ').trim();
    if (txt.length >= 5) return txt.slice(0, 80);
    var ps = card.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      var t = (ps[i].textContent || '').trim();
      if (t.length >= 5 && !/^[\\d,\\. ]+[đdĐ]?$/.test(t)) return t.slice(0, 80);
    }
    return '';
  }

  function scanGrid(grid) {
    var seen = {}; var items = [];
    var cards = grid.children;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];

      if (card.querySelector('iframe')) continue;

      var a = card.querySelector('a[href*="_p"]');
      if (!a) continue;
      var href = a.getAttribute('href') || '';
      var match = href.match(/_p(\\d+)/);
      if (!match) continue;
      var pid = match[1];
      if (seen[pid]) continue;
      seen[pid] = 1;
      var fullHref = href.indexOf('http') === 0 ? href : SITE + href;

      var media = bestImg(card);
      if (!media) continue;

      items.push({ href: fullHref, media: media, name: bestName(card) });
    }
    return shuffle(items).slice(0, 6);
  }

  function buildCards(items) {
    return items.map(function (it) {
      var pct = 85 + Math.floor(Math.random() * 14);
      var mediaHtml = '';
      if (it.media) {
        if (it.media.type === 'vid') {
          mediaHtml = '<video class="jjhfs-vid" src="' + it.media.src + '" autoplay muted loop playsinline></video>';
        } else {
          mediaHtml = '<img class="jjhfs-img" src="' + it.media.src + '" alt="" loading="lazy">';
        }
      }
      return '<a class="jjhfs-card" href="' + it.href + '">' +
        '<div class="jjhfs-imgw">' + mediaHtml + '</div>' +
        '<div class="jjhfs-name">' + (it.name || '').replace(/</g, '&lt;') + '</div>' +
        '<div class="jjhfs-barw">' +
          '<div class="jjhfs-barf" style="width:' + pct + '%"></div>' +
          '<div class="jjhfs-barl">&#272;&atilde; B&aacute;n ' + pct + '%</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  function renderWidget(items, w) {
    if (!w || !w.parentNode) return;
    w.innerHTML = buildHeader() +
      '<div class="jjhfs-scr"><div class="jjhfs-row">' + buildCards(items) + '</div></div>';
  }

  function findGrid() {
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var cls = divs[i].getAttribute('class') || '';
      if (cls.indexOf('grid-cols-2') !== -1 && cls.indexOf('gap-2') !== -1 &&
          cls.indexOf('md:grid-cols-3') !== -1 && cls.indexOf('lg:grid-cols-6') !== -1) return divs[i];
    }
    return null;
  }

  function isHomepage() {
    var p = window.location.pathname.replace(/\\/$/,  '');
    return p === '' || p === '/';
  }

  function launch() {
    if (!isHomepage()) return true;
    var grid = findGrid();
    if (!grid || grid.children.length < 6) return false;
    if (document.getElementById(WID)) return true;
    var items = scanGrid(grid);
    if (items.length < 3) return false;
    var w = document.createElement('div');
    w.id = WID;
    var parent = grid.parentNode;
    if (!parent) return false;
    parent.insertBefore(w, grid);
    injectCSS();
    renderWidget(items, w);
    return true;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') setTimeout(fn, 500);
    else document.addEventListener('DOMContentLoaded', function () { setTimeout(fn, 500); });
  }

  ready(function () {
    if (!launch()) {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (launch() || tries > 40) clearInterval(iv);
      }, 400);
    }
  });

})();
</script>

<script>
(function(){
{{DOMAIN_LOCK_LINE}}
  'use strict';

  if(window.location.pathname.replace(/\\/$/,'') !== '') return;

  var HTML =
    '<div id="sdn-gy-hdr-card">' +
      '<div id="sdn-gy-hdr-tab">' +
        '<span class="gy-icon">&#x2728;</span>' +
        '<span class="gy-txt">G&#7907;i &Yacute; H&ocirc;m Nay</span>' +
        '<span class="gy-badge">D&agrave;nh ri&ecirc;ng cho b&#7841;n</span>' +
      '</div>' +
    '</div>';

  function inject() {
    if (document.getElementById('sdn-gy-hdr')) return true;
    var jjhfs = document.getElementById('jj-home-fs');
    if (!jjhfs) return false;
    var w = document.createElement('div');
    w.id = 'sdn-gy-hdr';
    w.innerHTML = HTML;
    jjhfs.parentNode.insertBefore(w, jjhfs.nextSibling);
    return true;
  }

  var n = 0;
  function run() {
    n++;
    if (inject()) return;
    if (n < 60) setTimeout(run, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 800); });
  } else {
    setTimeout(run, 800);
  }

  try {
    new MutationObserver(function () {
      if (!document.getElementById('sdn-gy-hdr')) inject();
    }).observe(document.body, { childList: true, subtree: true });
  } catch(e) {}

})();
</script>`
  }
];

function djb2Hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 33) + s.charCodeAt(i)) | 0;
  }
  return h;
}

function normalizeDomain(raw: string): string {
  return raw.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

export function applyFieldValues(template: string, values: Record<string, string>): string {
  let result = template;

  // Build augmented values: for fields ending in _IDS, also generate _IDS_JSON (JSON array string)
  const augmented: Record<string, string> = { ...values };

  // Default DOMAIN_LOCK_LINE to empty string if DOMAIN_LOCK not provided
  if (!("DOMAIN_LOCK" in augmented)) {
    augmented["DOMAIN_LOCK_LINE"] = "";
  }

  for (const [key, value] of Object.entries(values)) {
    if (key.endsWith("_IDS")) {
      const ids = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `"${s}"`);
      augmented[`${key}_JSON`] = `[${ids.join(",")}]`;
    }
    // Auto-generate DOMAIN_LOCK_LINE from DOMAIN_LOCK field
    if (key === "DOMAIN_LOCK") {
      const domain = value.trim();
      if (domain) {
        const nd = normalizeDomain(domain);
        const hash = djb2Hash(nd);
        augmented["DOMAIN_LOCK_LINE"] =
          `var _L=${hash},_f=function(s){var h=5381;for(var i=0;i<s.length;i++){h=(Math.imul(h,33)+s.charCodeAt(i))|0;}return h;},_d=location.hostname.replace(/^www\\./,'');if(_f(_d)!==_L)return;`;
      } else {
        augmented["DOMAIN_LOCK_LINE"] = "";
      }
    }
  }

  for (const [key, value] of Object.entries(augmented)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, value);
  }
  return result;
}

export function extractFieldsFromTemplate(template: string): string[] {
  const regex = /\{\{([A-Z_]+)\}\}/g;
  const fields: string[] = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    const key = match[1];
    // Skip auto-generated derived keys
    if (key.endsWith("_IDS_JSON")) continue;
    if (key === "DOMAIN_LOCK_LINE") continue;
    if (!fields.includes(key)) {
      fields.push(key);
    }
  }
  return fields;
}
