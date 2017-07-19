<?php // $GLOBALS['configs'] // save all configs
function _e($_text) {
	//$lang_file = PATH_APPLICATION.'/view/inc/lang.php';
	//if (file_exists($lang_file)) include_once $lang_file;
	//else die('Error: Language file not found at: \''.str_replace(PATH_APPLICATION, '', $lang_file).'\'');

	$lang_set = 'vi';

	$dic = strtolower($_text);

	if (isset($GLOBALS['configs']['lang'][$dic][$lang_set])) return $GLOBALS['configs']['lang'][$dic][$lang_set];
	else return $_text;
}

// Print the homepage
function TheHomePage($_replace = 'Home', $_icon = 'fa-dashboard', $_class = '', $_id='') {
	$icon_tag = $_icon ? '<i class="fa '.$_icon.'"></i> ' : '';
	echo '<a href="'.GetHomePage().'" class="'.$_class.'" id="'.$_id.'">'.$icon_tag.$_replace.'</a>';
}

// Return homepage
function GetHomePage() {
	return BASE_URL.'.php';
}

function IsLoginPage() { return strtolower($_GET['c'])=='login'; }

// Kiểm tra url có tồn tại hay không
// Return true hoặc false
function UrlExists($_url)
{
	$url_headers = @get_headers($_url);
	if(!$url_headers || $url_headers[0] == 'HTTP/1.1 404 Not Found') return false;
	else return true;
}

// $_type = js. html, css
// $_key = name
function RegisterScript($_key, $_type, $_url)
{
	$key = strtolower($_key);
	$type = strtolower($_type);
	// Define
	if (!isset($GLOBALS['configs']['script']))
		$GLOBALS['configs']['script'] = [];
	if (!isset($GLOBALS['configs']['script'][$key]))
		$GLOBALS['configs']['script'][$key] = [];
	if (!isset($GLOBALS['configs']['script'][$key][$type]))
		$GLOBALS['configs']['script'][$key][$type] = [];

	// Save
	array_push($GLOBALS['configs']['script'][$key][$type], $_url);
};

// Print script
function ApplyScript($_key = false, $_type = false)
{
	if (!isset($GLOBALS['configs']['script']))
		return;
	
	$html = [];
	$script_root = $GLOBALS['configs']['script'];//['type']['key']['url']
	
	/*$GLOBALS['configs']['script'] = [ // root
		'uploader'		=> [ // key
			'css'		=> [ // type
				'http://' // url
			]
		]
	]*/

	if ($_key == false && $_type == false) {
		foreach ($script_root as $key => $types) {
			foreach ($types as $type => $urls) {
				foreach ($urls as $index => $url) {
					if ($type == 'css') {
						array_push($html, '<link id="'.$key.'_'.$type.'_'.$index.'" href="'.$url.'" rel="stylesheet" type="text/css">');
					} else if ($type == 'js') {
						array_push($html, '<script id="'.$key.'_'.$type.'_'.$index.'" src="'.$url.'" type="text/javascript"></script>');
					}
				};
			};
		};
	} else if ($_key != false && $_type != false) {
		$key = strtolower($_key);
		$type = strtolower($_type);
		if (!isset($script_root[$key][$type]))
			return;

		$urls = $script_root[$key][$type];
		foreach ($urls as $index => $url) {
			if ($type == 'css') {
				array_push($html, '<link id="'.$key.'_'.$type.'_'.$index.'" href="'.$url.'" rel="stylesheet" type="text/css">');
			} else if ($type == 'js') {
				array_push($html, '<script id="'.$key.'_'.$type.'_'.$index.'" src="'.$url.'" type="text/javascript"></script>');
			} else if ($type == 'html') {
				if (file_exists($url))
					array_push($html, file_get_contents($url));
			}
		};
	} else if ($_key == false && $_type != false) {
		$type = strtolower($_type);
		foreach ($script_root as $key => $types) {
			if (isset($types[$type])) {
				$urls = $types[$type];
				foreach ($urls as $index => $url) {
					if ($type == 'css') {
						array_push($html, '<link id="'.$key.'_'.$type.'_'.$index.'" href="'.$url.'" rel="stylesheet" type="text/css">');
					} else if ($type == 'js') {
						array_push($html, '<script id="'.$key.'_'.$type.'_'.$index.'" src="'.$url.'" type="text/javascript"></script>');
					} else if ($type == 'html') {
						if (file_exists($url))
							array_push($html, file_get_contents($url));
					}
				};
			};
		};
	} else if ($_key != false && $_type == false) {
		$key = strtolower($_key);
		if (isset($script_root[$key])) {
			$types = $script_root[$key];
			foreach ($types as $type => $urls) {
				foreach ($urls as $index => $url) {
					if ($type == 'css') {
						array_push($html, '<link id="'.$key.'_'.$type.'_'.$index.'" href="'.$url.'" rel="stylesheet" type="text/css">');
					} else if ($type == 'js') {
						array_push($html, '<script id="'.$key.'_'.$type.'_'.$index.'" src="'.$url.'" type="text/javascript"></script>');
					};
				};
			};
		}
	};

	echo join('', $html);
};

// Chuyển hướng trang
function RedirectTo($_page = 'index.php') {
    header('Location: '. BASE_URL . $_page);
    exit();
}
function Error($_code, $_message = '')
{
    header('Location:?c=error&a=e'.$_code);
    exit();
}

function FormatDateToSql($_date_input, $_spliter = '/') {
    if (is_null($_date_input) || $_date_input == '') {
        // Format theo người dùng nhập dạng text
        return '0000-00-00 00:00:01';
    } else if (is_numeric($_date_input)) {
        // Format theo định dạng date của excel trên windows
        return date(DB_DATE_FORMAT, ($_date_input-25569)*86400);
    } else {
    	// Sửa lỗi theo cách nhập của người Việt day/month/year
    	$date = explode($_spliter, $_date_input);
    	if (sizeof($date) <= 2)
    		return '0000-00-00 00:00:02';
    	else
    		return $date[2].'-'.$date[1].'-'.$date[0].' 00:00:03';
    }
}