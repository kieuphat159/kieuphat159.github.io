# Hướng Dẫn Sử Dụng i18n (Đa Ngôn Ngữ)

## 📚 Tổng Quan

Hệ thống đa ngôn ngữ đã được tích hợp vào project, hỗ trợ 2 ngôn ngữ:
- 🇻🇳 **Tiếng Việt** (mặc định)
- 🇬🇧 **English**

## 🎯 Cách Sử Dụng

### 1. Đánh Dấu Phần Tử Cần Dịch

Thêm thuộc tính `data-i18n` vào các phần tử HTML cần dịch:

```html
<!-- Dịch textContent -->
<h1 data-i18n="home.hero.title">Khám phá Thế Giới Cùng Chúng Tôi</h1>

<!-- Dịch placeholder -->
<input type="text" data-i18n="home.hero.searchPlaceholder" data-i18n-placeholder />

<!-- Dịch aria-label -->
<button data-i18n="common.search" data-i18n-aria>Tìm kiếm</button>

<!-- Dịch title -->
<a href="#" data-i18n="common.readMore" data-i18n-title>Đọc thêm</a>
```

### 2. Cấu Trúc Key Translation

Keys được tổ chức theo cấu trúc nested trong file JSON:

```
header.nav.home          → "Trang chủ" / "Home"
common.readMore          → "Đọc thêm" / "Read more"
home.hero.title          → "Khám phá..." / "Explore..."
```

### 3. Sử Dụng Trong JavaScript

```javascript
// Lấy bản dịch
const text = window.i18n.t('home.hero.title');

// Lấy bản dịch với tham số
const greeting = window.i18n.t('common.greeting', { name: 'John' });

// Chuyển đổi ngôn ngữ
await window.i18n.changeLanguage('en');

// Lấy ngôn ngữ hiện tại
const currentLang = window.i18n.getCurrentLanguage(); // 'vi' hoặc 'en'

// Dịch lại trang sau khi load nội dung mới
window.i18n.translatePage();
```

### 4. Lắng Nghe Sự Kiện Thay Đổi Ngôn Ngữ

```javascript
// Đăng ký observer
window.i18n.subscribe((newLang) => {
    console.log('Language changed to:', newLang);
    // Cập nhật UI hoặc reload data
});
```

## 📁 Cấu Trúc File

```
assets/
  lang/
    vi.json    # File ngôn ngữ Tiếng Việt
    en.json    # File ngôn ngữ English
  js/
    i18n.js    # Module xử lý đa ngôn ngữ
```

## ✨ Tính Năng

- ✅ Tự động load ngôn ngữ từ localStorage
- ✅ Chuyển đổi ngôn ngữ mượt mà
- ✅ Hỗ trợ nested keys
- ✅ Hỗ trợ placeholder, aria-label, title
- ✅ Observer pattern cho reactive updates
- ✅ Fallback về Tiếng Việt nếu có lỗi

## 🔧 Thêm Nội Dung Mới Cần Dịch

### Bước 1: Thêm vào file JSON

**vi.json:**
```json
{
  "mySection": {
    "title": "Tiêu đề của tôi",
    "description": "Mô tả chi tiết"
  }
}
```

**en.json:**
```json
{
  "mySection": {
    "title": "My Title",
    "description": "Detailed description"
  }
}
```

### Bước 2: Đánh dấu trong HTML

```html
<h2 data-i18n="mySection.title">Tiêu đề của tôi</h2>
<p data-i18n="mySection.description">Mô tả chi tiết</p>
```

### Bước 3: Gọi translatePage() (nếu load động)

```javascript
// Sau khi load nội dung mới
load("#main", "./pages/mypage.html", () => {
    window.i18n.translatePage(); // Dịch nội dung mới
});
```

## 🎨 Nút Chuyển Đổi Ngôn Ngữ

Nút chuyển đổi đã được thêm vào header, bên cạnh nút theme toggle.

- Click để chuyển đổi giữa VI ↔ EN
- Hiển thị cờ và mã ngôn ngữ
- Lưu lựa chọn vào localStorage

## 📝 Lưu Ý

1. **Key phải tồn tại trong cả 2 file** (vi.json và en.json)
2. **Gọi translatePage()** sau khi load nội dung động
3. **Sử dụng data-i18n-placeholder** cho input placeholder
4. **Sử dụng data-i18n-aria** cho aria-label
5. **Sử dụng data-i18n-title** cho title attribute

## 🚀 Next Steps

Để hoàn thiện hệ thống đa ngôn ngữ cho toàn bộ website:

1. Thêm `data-i18n` cho các trang còn lại (home, about, tours, blog, etc.)
2. Cập nhật các file JSON với đầy đủ translations
3. Gọi `window.i18n.translatePage()` trong các page scripts
4. Test kỹ trên tất cả các trang

---

**Tác giả:** Safe Tour Team  
**Ngày tạo:** November 12, 2025
