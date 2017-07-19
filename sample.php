<?php // File tiêu chuẩn
// Đường dẫn tới hệ  thống
define('PATH_SYSTEM', __DIR__ .'/system');

// Đường dẫn đến app
define('APP_PREFIX', basename(__FILE__, '.php'));
define('PATH_APPLICATION', __DIR__ . '/apps/' . APP_PREFIX);

// Lấy thông số cấu hình
require_once PATH_SYSTEM . '/config/config.php';

//mở file MVC_Common.php, file này chứa hàm MVC_Load() chạy hệ thống
include_once PATH_SYSTEM . '/core/MVC_Common.php';

// Chương trình chính
MVC_Load();