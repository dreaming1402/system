<?php
// Khai báo các đường dẫn cố định
define('PUBLIC_DIR',	'./apps/' . APP_PREFIX . '/public');
define('TEMPLATE_DIR',	'./apps/' . APP_PREFIX . '/public/templates');
define('UPLOAD_DIR',	'./apps/' . APP_PREFIX . '/public/uploads');
define('PLUGIN_DIR',	'./apps/' . APP_PREFIX . '/public/plugins');

// Các đường dẫn hệ thống
define('LIB_DIR',	'./system/library');

// Khai báo biến cố định ở file config
$app_config_file = PATH_APPLICATION.'/config/config.php';
if (file_exists($app_config_file)) {
	$app_config = include_once $app_config_file;
	foreach ($app_config as $key => $value)	{
		define(strtoupper($key), $value);
	};
} else die('File missing: ./apps/'.APP_PREFIX.'/config/config.php');