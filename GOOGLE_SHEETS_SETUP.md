# Hướng dẫn cấu hình Google Sheets làm Backend

## Bước 1: Tạo Google Sheet

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một Spreadsheet mới
3. Đặt tên: **"TTNS Admin Data"**
4. Tạo 2 sheet:
   - **Sheet1**: Đổi tên thành `News`
   - **Sheet2**: Tạo mới và đặt tên `Reviews`
   - **Sheet3**: Tạo mới và đặt tên `Leads` (Đây là nơi chứa thông tin khách hàng đăng ký)

### Cấu trúc Sheet "News":
| ID | Date | Category | Title | Excerpt | Content | Image | Link |
|----|------|----------|-------|---------|---------|-------|------|
| 1 | 2024-01-20 | Tin tức | Tiêu đề bài viết | Mô tả ngắn | Nội dung đầy đủ | URL hình | URL bài gốc |

### Cấu trúc Sheet "Reviews":
| Name | Location | Rating | Content |
|------|----------|--------|---------|
| Nguyễn Văn A | Tân An, Long An | 5 | Dịch vụ rất tốt |

### Cấu trúc Sheet "Leads" (Thông tin đăng ký):
| Timestamp | Source | Name | Phone | Email | Specialty/Subject | Date/Message | Raw Data |
|-----------|--------|------|-------|-------|-------------------|--------------|----------|
| (Tự động) | Trang chủ | A | 090... | a@... | Khám tổng quát | ... | ... |

---

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet, vào **Extensions > Apps Script**
2. Xóa code mặc định và dán code sau:

```javascript
// Google Apps Script - Admin Backend

const SPREADSHEET_ID = SpreadsheetApp.getActive().getId();

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Guard Clause: Ngăn lỗi khi chạy thủ công trong Editor (Run button)
  if (!e) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Vui lòng không chạy trực tiếp hàm này trong Editor. Hãy Deploy dưới dạng Web App và sử dụng URL được cấp.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Lấy action từ e.parameter (GET/POST Form) hoặc e.postData (JSON POST)
  let action = '';
  let data = {};

  if (e.parameter && e.parameter.action) {
    action = e.parameter.action;
    data = e.parameter;
  } else if (e.postData && e.postData.contents) {
    try {
      const json = JSON.parse(e.postData.contents);
      action = json.action;
      // Hỗ trợ cả cấu trúc trực tiếp hoặc lồng trong 'news'
      data = json.news || json;
    } catch (err) {
      Logger.log('Error parsing JSON: ' + err);
    }
  }
  
  let result;
  
  switch(action) {
    case 'getNews':
      result = getNews();
      break;
    case 'addNews':
      result = addNews(data);
      break;
    case 'updateNews':
      result = updateNews(data);
      break;
    case 'deleteNews':
      result = deleteNews(data.id || (e.postData && JSON.parse(e.postData.contents).id));
      break;
    case 'submitForm':
      result = submitForm(data); // Handle form data
      break;
    default:
      result = { success: false, error: 'Unknown action: ' + action };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ... (getNews, addNews, updateNews, deleteNews functions remain the same)

function submitForm(data) {
  try {
    let sheet = SpreadsheetApp.getActive().getSheetByName('Leads');
    // Auto-create sheet if not exists
    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet('Leads');
      sheet.appendRow(['Timestamp', 'Source', 'Name', 'Phone', 'Email', 'Specialty/Subject', 'Date/Message', 'Raw Data']);
    }
    
    const timestamp = new Date().toLocaleString('vi-VN');
    
    // Map usage based on form source
    let name = data.ho_ten || data['Họ tên'] || '';
    let phone = data.so_dien_thoai || data['Số điện thoại'] || '';
    let email = data.email || data['Email'] || '';
    let subject = data.chuyen_khoa || ''; // Specialization
    let message = data.loi_nhan || data.ngay_kham || ''; // Message or Date
    
    sheet.appendRow([
      timestamp,
      data.form_source || 'Unknown',
      name,
      phone,
      email,
      subject,
      message,
      JSON.stringify(data) // Backup raw data
    ]);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

3. Bấm **Save** (Ctrl+S)
4. Đặt tên project: **"TTNS Admin API"**

### Lưu ý cho Form Đăng Ký
Hệ thống sẽ tự động tạo sheet **"Leads"** nếu chưa có. Dữ liệu từ các form (Trang chủ, Liên hệ, Footer) sẽ đổ về đây.

3. Bấm **Save** (Ctrl+S)
4. Đặt tên project: **"TTNS Admin API"**

---

## Bước 3: Deploy Web App

1. Bấm **Deploy > New deployment**
2. Click **Select type** > chọn **Web app**
3. Cấu hình:
   - **Description**: Admin API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Bấm **Deploy**
5. Copy **Web app URL** (dạng `https://script.google.com/macros/s/...`)

---

## Bước 4: Cấu hình trong Admin Panel

1. Mở `admin.html` trong trình duyệt
2. Đăng nhập với mật khẩu mặc định: `tanan2024`
3. Vào tab **Cài đặt**
4. Dán **Web app URL** vào ô "Google Apps Script URL"
5. Bấm **Lưu cấu hình**

---

## Lưu ý bảo mật

> ⚠️ **QUAN TRỌNG**: 
> - Đổi mật khẩu ngay sau lần đăng nhập đầu tiên
> - Không chia sẻ URL của Google Apps Script công khai
> - Đây là giải pháp đơn giản, không phù hợp cho dữ liệu nhạy cảm

---

## Hỗ trợ

Nếu gặp lỗi "Failed to fetch", hãy kiểm tra:
1. URL đã được copy đầy đủ chưa
2. Đã deploy lại sau khi sửa code chưa
3. Quyền truy cập đã chọn "Anyone" chưa
