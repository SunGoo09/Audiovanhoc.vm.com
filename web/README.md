# 📖 VănHọc12 — Cẩm Nang Toàn Văn SGK & Luyện Thi THPT Quốc Gia 9+

Ứng dụng web học tập và ôn luyện Ngữ Văn 12 toàn diện, tích hợp công cụ quản trị độc quyền cho Admin, trình phát âm thanh bài giảng, tùy biến hình nền web và thiết kế vỏ ngoài sách.

---

## ✨ Các Tính Năng Nổi Bật

### 1. 🎨 Tùy Biến Hình Nền Web (Website Wallpaper Customizer)
- **Nút bấm trực quan trên thanh tiêu đề**: Nhấn biểu tượng 🎨 cạnh nút chế độ Sáng/Tối để mở trình tùy biến.
- **Tải ảnh cá nhân**: Tải file ảnh trực tiếp từ thiết bị (.jpg, .png, .webp).
- **Liên kết URL**: Dán link ảnh chất lượng cao trực tiếp từ internet.
- **Bộ sưu tập Preset nghệ thuật**: Tuyển chọn các bối cảnh văn học (Thư viện hoàng hôn, Đêm ngàn sao, Rừng thông sương mù, Biển đêm, Giấy da mộc cổ điển...).
- **Thanh trượt bảo vệ thị lực**:
  - *Lớp phủ tối (Overlay)*: Tùy chỉnh từ 15% đến 95% để văn bản bài học luôn nổi bật 100%, dễ đọc, không mỏi mắt.
  - *Độ nhòe hình nền (Blur)*: Tùy chỉnh độ mờ tạo chiều sâu không gian học tập.
- **Tự động ghi nhớ**: Cài đặt hình nền được lưu an toàn trong trình duyệt (`localStorage`) và tự động tải lại mỗi lần vào web.

---

### 2. 📚 Chỉnh Sửa Vỏ Ngoài Của Sách (Book Cover Exterior)
- **Dành riêng cho Quản trị viên (Admin)**: Mở modal chỉnh sửa tác phẩm bất kỳ hoặc tạo tác phẩm mới.
- **Khung Xem Trước Bìa Thời Gian Thực (Live Preview)**:
  - Hiển thị bìa sách 3D sống động với gáy sách dập bóng, biểu tượng thể loại, tên tác phẩm và tên tác giả.
  - Tự động đồng bộ ngay khi Admin gõ thay đổi tiêu đề hoặc tên tác giả.
- **Tải ảnh bìa riêng**: Tải ảnh chụp bìa sách, tranh minh họa từ máy tính.
- **Dán URL ảnh bìa**: Dán đường link ảnh bìa trên web.
- **Preset màu Gradient & Biểu tượng**: 7 bảng màu gradient mang phong cách văn học đỉnh cao (Tây Bắc Huyền Ảo, Sông Đà Hùng Vĩ, Mùa Vàng Lúa Chín, Biển Sóng Hoàng Hôn, Ánh Lửa Kháng Chiến...).
- **Đồng bộ toàn diện**: Ảnh bìa vỏ ngoài mới sẽ hiển thị tức thì trên cả thẻ sách tại trang chủ, thẻ sách trong Tủ bài ôn thi, và mô hình sách 3D tương tác tại mục Tiêu Điểm (Hero Section).

---

### 3. 👑 Chế Độ Quản Trị Viên (Admin Mode)
- **Bảo mật tuyệt đối**: Đăng nhập bằng mật khẩu quản trị viên riêng (`Viet09`).
- **Toàn quyền chỉnh sửa**: Sửa toàn văn trích đoạn SGK, đổi năm sáng tác, thêm mở bài mẫu 9+, thêm luận điểm nghị luận xã hội và văn học.
- **Tải lên File Âm Thanh riêng**: Đính kèm file audio bài giảng (.mp3, .wav, .m4a) cho từng tác phẩm.
- **Bảng phân quyền khách xem**: Admin quyết định khách được phép nhấn những nút nào (Nghe Audio, Sao chép dẫn chứng, Lưu tủ bài ôn, Thêm ghi chú, Bôi đen văn bản).

---

### 4. 📜 Trải Nghiệm Đọc Toàn Văn Chuẩn SGK & Lướt Trang Thông Minh
- **Toàn văn bài học trọn vẹn**: Trích dẫn đầy đủ tác phẩm (Vợ chồng A Phủ, Vợ nhặt, Người lái đò Sông Đà, Tây Tiến, Việt Bắc, Sóng, Đất Nước, Chiếc thuyền ngoài xa, Hồn Trương Ba da hàng thịt...).
- **Thanh tiến độ lướt trang**: Header hiển thị thanh tiến độ đọc mượt mà khi cuộn trang.
- **Cụm phím cuộn thông minh**: Phím nổi Lên đầu trang (Top) và Xuống bài học (Explore) giúp thao tác nhanh và thuận tiện trên cả máy tính lẫn điện thoại.
- **Phông chữ chuẩn Tiếng Việt**: Sử dụng font chữ Be Vietnam Pro và Merriweather cho độ tương phản sắc nét và thoải mái khi đọc lâu.

---

### 5. ☁️ Đồng Bộ Đám Mây Trực Tuyến (Google Firebase Realtime Database — Cách 1)
- **Tự động đồng bộ thời gian thực**: Khi Admin chỉnh sửa bài học, đổi ảnh bìa sách, cập nhật liên kết âm thanh bài giảng hay thiết lập hình nền mặc định, **tất cả học sinh ở mọi nơi mở trang web đều sẽ tự động thấy ngay lập tức**.
- **Miễn phí 100% vĩnh viễn**: Sử dụng gói Spark Free của Google Firebase, hoàn toàn không tốn phí duy trì.
- **Hoạt động hoàn hảo trên GitHub Pages**: Biến trang web tĩnh trên GitHub Pages thành ứng dụng web đồng bộ đám mây mạnh mẽ.
- **Tích hợp trình phát âm thanh trực tuyến**: Hỗ trợ dán liên kết âm thanh MP3/WAV online giúp học sinh nghe mượt mà không bị giới hạn bộ nhớ máy.

---

## 🚀 Hướng Dẫn Kích Hoạt Đám Mây Google Firebase (Cách 1)

Chỉ cần thực hiện 1 lần duy nhất trong 3 phút:

### Bước 1: Tạo dự án Firebase
1. Truy cập [console.firebase.google.com](https://console.firebase.google.com/) (đăng nhập bằng tài khoản Google bất kỳ).
2. Bấm **"Add project"** (Thêm dự án), đặt tên dự án (ví dụ: `vanhoc12-app`) rồi bấm Tiếp tục.

### Bước 2: Bật Realtime Database
1. Trong menu bên trái Firebase Console, chọn **Build** ➜ **Realtime Database**.
2. Bấm nút **"Create Database"** (Tạo cơ sở dữ liệu), chọn vị trí (Singapore hoặc US).
3. Tại bước chọn Security rules, chọn **"Start in test mode"** (chế độ kiểm thử: `.read: true`, `.write: true`) rồi bấm **Enable**.

### Bước 3: Lấy mã cấu hình Web App & Kết nối
1. Bấm biểu tượng bánh răng **⚙️ Project settings** ➜ kéo xuống mục **Your apps**, bấm biểu tượng web `</>`.
2. Đặt tên app rồi bấm Register. Firebase sẽ hiển thị đoạn mã:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "vanhoc12-app.firebaseapp.com",
     databaseURL: "https://vanhoc12-app-default-rtdb.firebaseio.com",
     projectId: "vanhoc12-app",
     storageBucket: "vanhoc12-app.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
3. Mở web [VănHọc12](file:///c:/Users/Admin/Music/Book%20learn/web/index.html) trên trình duyệt, đăng nhập Admin với mật khẩu `Viet09`.
4. Bấm nút **"☁️ Đồng Bộ Đám Mây"** (hoặc bấm vào huy hiệu đám mây trên thanh header), dán đoạn mã cấu hình vào ô rồi bấm **"🚀 Lưu & Bật Đám Mây"**.
5. Hệ thống sẽ lập tức kết nối và đồng bộ toàn bộ kho tác phẩm, bìa sách và hình nền lên đám mây!

> 💡 **Mẹo dành cho GitHub Pages**: Sau khi đã kết nối đám mây, Admin có thể bấm nút **"💾 Tải data.js mới"** trong bảng cài đặt hình nền hoặc copy cấu hình vào `DEFAULT_FIREBASE_CONFIG` trong [js/data.js](file:///c:/Users/Admin/Music/Book%20learn/web/js/data.js) rồi đẩy lên GitHub. Khi đó bất kỳ học sinh nào truy cập link GitHub Pages đều sẽ tự động kết nối đám mây mà không cần thao tác gì!

---

## 💻 Hướng Dẫn Sử Dụng Nhanh
1. Mở file [index.html](file:///c:/Users/Admin/Music/Book%20learn/web/index.html) bằng bất kỳ trình duyệt hiện đại nào (Chrome, Edge, Safari, Firefox).
2. Nhấn nút **"🎨"** trên thanh điều hướng để đổi hình nền không gian học tập.
3. Nhấn **"👑 Đăng Nhập Admin"** và nhập mật khẩu quản trị viên để mở quyền chỉnh sửa nội dung, gán ảnh bìa sách và kết nối đám mây.
4. **Giọng AI Bình Giảng Chuyên Nghiệp:** Nhấn nút **"🎧 Nghe Bình Giảng"** trong giao diện đọc sách để nghe AI bình giảng văn học bằng tiếng Việt chuẩn. Bạn có thể chọn giữa **🌸 Nữ AI Truyền Cảm (Hoài My)**, **🎙️ Nam AI Trầm Ấm (Nam Minh)** hoặc **🌐 Google AI Chuẩn Việt**.
5. **Tải Lên File Thu Âm MP3 Dành Cho Giáo Viên:** Khi đăng nhập Admin, bạn có thể bấm **"🎵 Tải Audio MP3"** trong trình đọc sách hoặc dán link MP3 khi sửa bài học. Hệ thống sẽ tự động đồng bộ lên Firebase và hiển thị huy hiệu **"🎙️ Có Bản Thu MP3"** để tất cả học sinh vào nghe ngay lập tức!

---

## 🎙️ Hướng Dẫn Sử Dụng Thư Mục Audio Riêng & Đồng Bộ Tự Động Lên Firebase

Hệ thống đã thiết lập sẵn thư mục âm thanh chuyên dụng và các công cụ đồng bộ siêu tốc:

### 1. Thư mục lưu trữ:
- Thư mục chính: `Book learn/audio/` (hoặc `Book learn/web/audio/`).
- Bất cứ khi nào bạn tải hoặc copy file `.mp3` vào thư mục này, file sẽ được lưu trữ an toàn trên máy tính.

### 2. Không giới hạn tên file — Bất kỳ file MP3 nào đều được lưu & phát:
- **Bất kỳ file nào:** `nhac_on_thi.mp3`, `bai_giang_1.mp3`, `audio123.mp3`... đều được lưu lại và đồng bộ lên Google Firebase!
- **Học sinh:** Bấm nút **🎧 Kho Audio** trên thanh Menu là có thể nghe tất cả các file MP3 trực tuyến hoặc tải về ôn tập!
- **Tự động ghép bài học:** Nếu tên file có chứa từ khóa của tác phẩm (ví dụ `vo-chong-a-phu.mp3`, `tay-tien.mp3`, `song.mp3`...), hệ thống sẽ tự động ghép vào bài học đó.

### 3. Cách Đồng Bộ Lên Đám Mây:
* **Cách 1 - Nhấp đúp chuột trên máy tính (Nhanh nhất):**
  - Chạy file **`DONG_BO_AUDIO.bat`** để đồng bộ ngay tất cả file trong thư mục `audio/` lên Firebase.
  - Hoặc chạy **`DONG_BO_TU_DONG_KHI_CO_FILE_MOI.bat`** để bật chế độ tự canh chừng: Cứ mỗi khi bạn thả thêm bất kỳ file MP3 nào vào thư mục `audio/`, hệ thống sẽ tự động phát hiện và đồng bộ ngay lên Firebase!
* **Cách 2 - Ngay trên Giao Diện Web App:**
  - Đăng nhập Admin, vào menu **👑 Quản Trị** ➜ chọn **"🎙️ Kho & Thư Mục Audio MP3"**.
  - Bạn có thể kéo thả hàng loạt file MP3 vào, hoặc bấm **"📂 Nạp Từ Thư Mục Máy"** (chọn thư mục `audio`), web sẽ tự động đọc và đồng bộ lên Firebase chỉ với 1 click!



