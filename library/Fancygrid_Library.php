<?php
/**
* 
*/
class Fancygrid_Library
{	
	public function __construct()
	{
		# code...
		RegisterScript('Fancygrid', 'css', LIB_DIR.'/Fancygrid/1.6.2/fancy.min.css');
		RegisterScript('Fancygrid','js', LIB_DIR.'/Fancygrid/1.6.2/fancy.full.min.js');
	}

	// read và edit phải giống csdl, write là hiển thị trên web,dấu / không sử dụng được
	// Format chuẩn: format:{read:\'Y-m-d\', write:\'d-m-Y\', edit:\'Y-m-d\'}
	// Format lại từ genuwin format:{read:\'d/m/Y\', write:\'d-m-Y\', edit:\'d/m/Y\'}
	public function ParseValue($_input) {
		if ($_input === true) {
			return 'true';
		} else if ($_input === false) {
			return 'false';
		} else if (is_numeric($_input)) {
			return $_input;
		} else {
			return '\''.$_input.'\'';
		}
	}

	// Hỗ trợ chuyển đổi dữ liệu datetime sang dữ liệu theo chuẩn mysql Y-m-d
	// Mặc định là kiểu US
	// input của việt nam là d/M/yyyy
	public function ParseDateValue($_input, $_input_format = 'M/d/yyyy') {
		if ($_input == '' || $_input == null)
			return '';

		$spliter = '!@#-#@!';
		$output_format = 'yyyy-MM-dd';

		if (strpos($_input, '/') !== false) {
			$_input = str_replace('/', $spliter, $_input);
		} else if (strpos($_input, '-') !== false) {
			$_input = str_replace('-', $spliter, $_input);
		}

		$date = explode($spliter, $_input);
		$date_format = [];
		if (sizeof($date < 3))
			return '';

		array_push($date_format, $date[2]);
		array_push($date_format, $date[1]);
		array_push($date_format, $date[0]);
		
		// SQL sử dụng spliter -
		return join('-', $date_format);
	}

	public function FancygridParse($_fancygrid, $order = true) {
		$html = $configs = [];

		foreach ($_fancygrid as $option => $config) {
			if (is_array($config)) {

				switch ($option) {
					case 'defaults':
						$defaults = [];
						foreach ($config as $key => $value) {
							if (is_array($value)) {
								$tmp = [];
								foreach ($value as $k => $v) {
									array_push($tmp, $k.':'.$this->ParseValue($v));
								} 
								array_push($defaults, $key.':{'.join(',', $tmp).'}');
							} else {
								array_push($defaults, $key.':'.$this->ParseValue($value));
							}
						}
						array_push($configs, 'defaults:{'.join(',', $defaults).'}');
						break;

					case 'columns':
						$columns = [];

						if ($order && !isset($config['order']))
							array_push($columns, '{type:\'order\',title:\'No.\',locked:true,width:40}');

						foreach ($config as $key => $value) {
							array_push($columns, '{'.$this->FancygridParse($value, false).'}');
						}
						array_push($configs, 'columns:['.join(',', $columns).']');
						break;

					case 'data':
						$data = [];
						if (isset($config['proxy'])) {
							foreach ($config as $key => $value) {
								if(is_array($value)) {
									$tmp = [];
									foreach ($value as $k => $v) {
										if (is_array($v)) {
											$tmp2 = [];
											foreach ($v as $vk => $vv) {
												array_push($tmp2, $vk.':'.$this->ParseValue($vv));
											}

											array_push($tmp, $k.':{'.join(',', $tmp2).'}');
										} else array_push($tmp, $k.':'.$this->ParseValue($v));
									}

									array_push($data, $key.':{'.join(',', $tmp).'}');
								} else array_push($data, $this->ParseValue($value));
							}

							array_push($configs, 'data:{'.join(',', $data).'}');
						} else {
							foreach ($config as $key => $value) {
								array_push($data, $this->ParseValue($value));
							}

							array_push($configs, 'data:['.join(',', $data).']');
						}						
						break;
					
					case 'items':
						$items = [];
						foreach ($config as $key => $value) {
							if (is_array($value))
								array_push($items, '{'.$this->FancygridParse($value, false).'}');
							else
								array_push($items, $key.':'.$this->ParseValue($value));	
						}
						array_push($configs, 'items:[{'.join(',', $items).'}]');
						break;

					case 'format':
						$format = [];
						foreach ($config as $key => $value) {
							if (is_array($value))
								array_push($format, '{'.$this->FancygridParse($value, false).'}');
							else
								array_push($format, $key.':'.$this->ParseValue($value));
						}
						array_push($configs, 'format:[{'.join(',', $format).'}]');
						break;

					default: //bar
						$other = [];

						foreach ($config as $key => $value) {
							array_push($other, '{'.$this->FancygridParse($value, false).'}');
						}
						array_push($configs, $option.':['.join(',', $other).']');
						break;
				}
			} else {
				array_push($configs, $option.':'.$this->ParseValue($config));

				// Mặc định cho một số type
				if ($option == 'type') {
					if ($config == 'date') { // date
						if (!isset($_fancygrid['format']))
							array_push($configs, 'format:{read:\'Y-m-d\', write:\'d-m-Y\', edit:\'Y-m-d\'}');

							// Theo genuwin
							//array_push($configs, 'format:{read:\'d/m/Y\', write:\'d-m-Y\', edit:\'d/m/Y\'}');							
					}
				}
			}
		}

		$html = join(',', $configs);
		return $html;
	}
	public function FancygridParseEnum($_enums) {
		$tmp = [];
		foreach ($_enums as $enum) {
			foreach ($enum as $key => $value) {
				if ($value != null)
					array_push($tmp, $value);
			}
		}
		return $tmp;
	}
	public function FancyformParse($_fancyform) {
		$html = $tab_titles = [];

		$configs = [];

		foreach ($_fancyform as $option => $config) {
			if (is_array($config)) {

				switch ($option) {
					case 'defaults':
						$defaults = [];
						foreach ($config as $key => $value) {
							if (is_array($value)) {
								$tmp = [];
								foreach ($value as $k => $v) {
									array_push($tmp, $k.':'.$this->ParseValue($v));
								} 
								array_push($defaults, $key.':{'.join(',', $tmp).'}');
							} else {
								array_push($defaults, $key.':'.$this->ParseValue($value));
							}
						}
						array_push($configs, 'defaults:{'.join(',', $defaults).'}');
						break;
					
					case 'items':
						$items = [];
						foreach ($config as $key => $value) {
							array_push($items, '{'.$this->FancyformParse($value).'}');
						}
						array_push($configs, 'items:['.join(',', $items).']');
						break;

					case 'data':
						$data = [];
						foreach ($config as $key => $value) {
							array_push($data, '{valueKey: \''.$value['valueKey'].'\', displayKey: \''.$value['displayKey'].'\'}');
						}
						array_push($configs, 'data:['.join(',', $data).'],displayKey:\'displayKey\',valueKey:\'valueKey\'');
						break;

					case 'event':
						$events = [];
						foreach ($config as $key => $value) {
							array_push($events, $key.':'.$value);
						}
						array_push($configs, 'events:[{'.join(';', $events).'}]');
						break;

					case 'format':
						$format = [];
						foreach ($config as $key => $value) {
							if (is_array($value))
								array_push($format, '{'.$this->FancygridParse($value, false).'}');
							else
								array_push($format, $key.':'.$this->ParseValue($value));
						}
						array_push($configs, 'format:[{'.join(',', $format).'}]');
						break;

					default:
						$other = [];

						foreach ($config as $key => $value) {
							array_push($other, '{'.$this->FancygridParse($value, false).'}');
						}
						array_push($configs, $option.':['.join(',', $other).']');
						break;
				}

			} else {
				array_push($configs, $option.':'.$this->ParseValue($config));

				// Mặc định cho một số type
				if ($option == 'type') {

					if ($config == 'date') {
						if (!isset($_fancyform['format']))
							array_push($configs, 'format:{read:\'Y-m-d\', write:\'d-m-Y\', edit:\'Y-m-d\'}');

							// Theo genuwin
							//array_push($configs, 'format:{read:\'d/m/Y\', write:\'d-m-Y\', edit:\'d/m/Y\'}');
					}
				}
			}
		}

		$html = join(',', $configs);
		return $html;
	}
	public function FancyformParseEnum($_enums) {
		$tmp = [];
		foreach ($_enums as $enum) {
			foreach ($enum as $key => $value) {
				if ($value != null)
					array_push($tmp, ['valueKey'=>$value, 'displayKey'=>$value]);
			}
		}
		return $tmp;
	}
}