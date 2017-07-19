<?php
/**
* 
*/
class Uploader_Library
{	public function __construct()
	{
		RegisterScript('Uploader', 'css', LIB_DIR.'/Uploader/uploader.css');
		RegisterScript('Uploader','js', LIB_DIR.'./Uploader/uploader.js');
	}

	// Hàm hỗ trợ upload
	// $_src_file = $FILE['file']
	// Return value: -1 = đã tồn tại; -2: Lỗi $_src_file hoặc $_des_file = null
	// Phương thức POST gửi đến gồm $_FILE, rename, overwrite
	public function UploadFile($_src_file, $_des_file, $_overwrite = false)
	{
		if (!$_src_file || !$_des_file)
			return -2;

		$src_file = $_src_file['tmp_name'];
		$des_file = $_des_file;
		$src_dir = dirname($des_file);

		// Nếu chưa tồn tại folder thì tạo mới
		if (!is_dir($src_dir))
			mkdir($src_dir, 0777, true);

		// Nếu file đã tồn tại thì trả về -1
		if (file_exists($des_file) && !$_overwrite)
			return -1;

		if (move_uploaded_file($src_file, $des_file))
			return $des_file;
	}

	// Hàm hỗ trợ xóa file
	// Phương thức DELETE gửi đến bao gồm id = tên file, ext = đuôi file
	// Return value: -2: des_file missing; -1 = file missing; 1 = xóa thành công
	public function DeleteFile($_des_file, $_token = false)
	{
		if (!$_des_file)
			return -2;

		if (!file_exists($_des_file))
			return -1;

		unlink($_des_file);
		return 1;
	}
}