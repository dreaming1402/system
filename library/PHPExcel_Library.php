<?php
/**
* 
*/
require_once 'PHPExcel/1.8/PHPExcel.php';
class PHPExcel_Library
{	
	
	public function __construct()
	{
	}

	public $ColumnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
							'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
							'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', //<--

							'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI',
							'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR',
							'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',

							'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI',
							'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR',
							'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',

							'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI',
							'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR',
							'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ',

							'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI',
							'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR',
							'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ',

							'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI',
							'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER',
							'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ',
							];

  /*'#A', '#B', '#C', '#D', '#E', '#F', '#G', '#H', '#I',
	'#J', '#K', '#L', '#M', '#N', '#O', '#P', '#Q', '#R',
	'#S', '#T', '#U', '#V', '#W', '#X', '#Y', '#Z', */
		

	public function CreateFileTut($_data, $_file, $_download = false) {
		$data = [
			['Nguyễn Khánh Linh', 'Nữ', '500k'], 
			['Ngọc Trinh', 'Nữ', '700k'], 
			['Tùng Sơn', 'Không xác định', 'Miễn phí'], 
			['Kenny Sang', 'Không xác định', 'Miễn phí']
				];
		//Khởi tạo đối tượng
		$excel = new PHPExcel();
		//Chọn trang cần ghi (là số từ 0->n)
		$excel->setActiveSheetIndex(0);
		//Tạo tiêu đề cho trang. (có thể không cần)
		$excel->getActiveSheet()->setTitle('demo ghi dữ liệu');

		//Set chiều rộng cho từng, nếu muốn set height thì dùng setRowHeight()
		$excel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
		$excel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$excel->getActiveSheet()->getColumnDimension('C')->setWidth(30);

		//Set in đậm cho khoảng cột
		$excel->getActiveSheet()->getStyle('A1:C1')->getFont()->setBold(true);
		//Tạo tiêu đề cho từng cột
		//Vị trí có dạng như sau:
		/**
		 * |A1|B1|C1|..|n1|
		 * |A2|B2|C2|..|n1|
		 * |..|..|..|..|..|
		 * |An|Bn|Cn|..|nn|
		 */
		$excel->getActiveSheet()->setCellValue('A1', 'Tên');
		$excel->getActiveSheet()->setCellValue('B1', 'Giới Tính');
		$excel->getActiveSheet()->setCellValue('C1', 'Đơn giá(/shoot)');
		// thực hiện thêm dữ liệu vào từng ô bằng vòng lặp
		// dòng bắt đầu = 2
		$numRow = 2;
		foreach($data as $row){
			$excel->getActiveSheet()->setCellValue('A'.$numRow, $row[0]);
			$excel->getActiveSheet()->setCellValue('B'.$numRow, $row[1]);
			$excel->getActiveSheet()->setCellValue('C'.$numRow, $row[2]);
			$numRow++;
		}
		// Khởi tạo đối tượng PHPExcel_IOFactory để thực hiện ghi file
		// ở đây mình lưu file dưới dạng excel2007
		if ($_download) {
			header('Content-type: application/vnd.ms-excel');
			header('Content-Disposition: attachment; filename="'.$_file.'"');
			PHPExcel_IOFactory::createWriter($excel, 'Excel2007')->save('php://output');
		} else {
			PHPExcel_IOFactory::createWriter($excel, 'Excel2007')->save($_file);
		}
	}

	public function ReadFileTut($_file) {
		//Đường dẫn file
		$file = $_file;
		//Tiến hành xác thực file
		$objFile = PHPExcel_IOFactory::identify($file);
		$objData = PHPExcel_IOFactory::createReader($objFile);

		//Chỉ đọc dữ liệu
		$objData->setReadDataOnly(true);

		// Load dữ liệu sang dạng đối tượng
		$objPHPExcel = $objData->load($file);

		//Lấy ra số trang sử dụng phương thức getSheetCount();
		// Lấy Ra tên trang sử dụng getSheetNames();

		//Chọn trang cần truy xuất
		$sheet  = $objPHPExcel->setActiveSheetIndex(0);

		//Lấy ra số dòng cuối cùng
		$Totalrow = $sheet->getHighestRow();
		//Lấy ra tên cột cuối cùng
		$LastColumn = $sheet->getHighestColumn();

		//Chuyển đổi tên cột đó về vị trí thứ, VD: C là 3,D là 4
		$TotalCol = PHPExcel_Cell::columnIndexFromString($LastColumn);

		//Tạo mảng chứa dữ liệu
		$data = [];

		//Tiến hành lặp qua từng ô dữ liệu
		//----Lặp dòng, Vì dòng đầu là tiêu đề cột nên chúng ta sẽ lặp giá trị từ dòng 2
		for ($i = 2; $i <= $Totalrow; $i++)
		{
			//----Lặp cột
			for ($j = 0; $j < $TotalCol; $j++)
			{
		    	// Tiến hành lấy giá trị của từng ô đổ vào mảng
				$data[$i-2][$j]=$sheet->getCellByColumnAndRow($j, $i)->getValue();;
			}
		}
		//Hiển thị mảng dữ liệu
		echo '<pre>';
		var_dump($data);
	}

	/*$data = [
		'data'	=> [
			[// row
				'1', 'Thái Minh Long'
			],
			[// row
				...
			]
		],
		'header'=> [
			[// row
				'ID', 'Fullname'
			],
			[
				...
			]
		],
	];*/
	public function CreateFile($_data, $_file, $_download = false) { // done
		// Dữ liệu mẫu
		/*$data = [
			['Nguyễn Khánh Linh', 'Nữ', '500k'], 
			['Ngọc Trinh', 'Nữ', '700k'], 
			['Tùng Sơn', 'Không xác định', 'Miễn phí'], 
			['Kenny Sang', 'Không xác định', 'Miễn phí']
				];*/

		$data = $_data;

		// Kiểm tra xem dữ liệu có hay không
		if (!isset($data) || $data == [] || $_file == '')
			return -1;

		if (!isset($data['data']))
			return -1;

		$save_as_file = date('Y-m-d').'_'.$_file;

		// Khởi tạo đối tượng
		$excel = new PHPExcel();
		// Chọn trang cần ghi (là số từ 0->n)
		$excel->setActiveSheetIndex(0);
		// Tạo tiêu đề cho sheet. (có thể không cần)
		$excel->getActiveSheet()->setTitle('Export data');

		// Set chiều rộng cho từng, nếu muốn set height thì dùng setRowHeight()
		//$excel->getActiveSheet()->getColumnDimension('A')->setWidth(20);

		// Tạo tiêu đề cho từng cột
		// Vị trí có dạng như sau:
		/**
		 * |A1|B1|C1|..|n1|
		 * |A2|B2|C2|..|n1|
		 * |..|..|..|..|..|
		 * |An|Bn|Cn|..|nn|
		 */
		// Set header
		// Ví dụ: $excel->getActiveSheet()->setCellValue('A1', 'ID');
		if (isset($data['header'])) {
			$numRow = 1; // Luôn luôn bắt đầu từ row 1
			$header_row_index = sizeof($data['header']);
			foreach($data['header'] as $row) {
				$field_length = sizeof($row);
				$field_index = 0;
				foreach ($row as $field_key => $cel_value) {
					$excel->getActiveSheet()->setCellValue($this->ColumnLabels[$field_index].$numRow, $cel_value);

					$header_row = $this->ColumnLabels[$field_index].$header_row_index.':'.$this->ColumnLabels[$field_index].$header_row_index;

					// Set in đậm cho khoảng cột
					// Ví dụ: $excel->getActiveSheet()->getStyle('A1:C1')->getFont()->setBold(true);
					$excel->getActiveSheet()->getStyle($header_row)->getFont()->setBold(true);
		
					if ($field_index >= $field_length)
						$field_index = 0;
					else
						$field_index++;
				}

				

				$numRow++;
			}
		}

		// Dòng bắt đầu luôn luôn = 1, nếu có header thì = header.length +1
		$numRow = 1;
		if (isset($data['header']))
			$numRow = sizeof($data['header'])+1;

		// Thực hiện thêm dữ liệu vào từng ô bằng vòng lặp
		// ví dụ: $excel->getActiveSheet()->setCellValue('A'.$numRow, $row[0]);
		foreach($data['data'] as $row) {
			$field_length = sizeof($row);
			$field_index = 0;
			foreach ($row as $field_key => $cel_value) {
				$excel->getActiveSheet()->setCellValue($this->ColumnLabels[$field_index].$numRow, $cel_value);

				if ($field_index >= $field_length)
					$field_index = 0;
				else
					$field_index++;
			}
			$numRow++;
		}

		// Khởi tạo đối tượng PHPExcel_IOFactory để thực hiện ghi file
		// Mặc định là sử dụng định dạng xlsx
		if ($_download) {
			header('Content-type: application/vnd.ms-excel');
			header('Content-Disposition: attachment; filename="'.$save_as_file.'"');
			PHPExcel_IOFactory::createWriter($excel, 'Excel2007')->save('php://output');
		} else {
			PHPExcel_IOFactory::createWriter($excel, 'Excel2007')->save($save_as_file);
		}
		return $save_as_file;
	}

	// Return: -1 = file not found
	public function ReadFile($_file, $_data_offset = 1) {
		//Kiểm tra file có tồn tại hay không
		if (!$_file || $_file == '')
			return -1;

		$file_name = explode('.', basename($_file));
		$file_ext = array_pop($file_name);

		if (in_array($file_ext, ['xlsx', 'xls']) === false)
			return -2;

		if (!file_exists($_file))
			return -1;

		// Sửa lỗi offset nếu nhập vào <= 0
		if ($_data_offset <= 0)
			$_data_offset = 1;

		// Đường dẫn file
		$file = $_file;
		// Tiến hành xác thực file
		$objFile = PHPExcel_IOFactory::identify($file);
		$objData = PHPExcel_IOFactory::createReader($objFile);

		// Chỉ đọc dữ liệu
		$objData->setReadDataOnly(true);

		// Load dữ liệu sang dạng đối tượng
		$objPHPExcel = $objData->load($file);

		// Lấy ra số trang sử dụng phương thức getSheetCount();
		// Lấy Ra tên trang sử dụng getSheetNames();

		// Chọn trang cần truy xuất
		$sheet = $objPHPExcel->setActiveSheetIndex(0);

		// Lấy ra số dòng cuối cùng
		$Totalrow = $sheet->getHighestRow();
		// Lấy ra tên cột cuối cùng
		$LastColumn = $sheet->getHighestColumn();

		// Chuyển đổi tên cột đó về vị trí thứ, VD: C là 3,D là 4
		$TotalCol = PHPExcel_Cell::columnIndexFromString($LastColumn);

		// Tạo mảng chứa dữ liệu
		$data = [
			'header'=> [],
			'data'	=> [],
		];

		// Lấy dữ liệu header nếu ofset > 1
		if ($_data_offset > 1) {
			// Tiến hành lặp qua từng ô dữ liệu
			// Bắt đầu lặp từ 1
			for ($i = 1; $i < $_data_offset; $i++)
			{
				// Lặp cột
				for ($j = 0; $j < $TotalCol; $j++)
				{
			    	// Tiến hành lấy giá trị của từng ô đổ vào mảng
					$data['header'][$i-1][$j]=$sheet->getCellByColumnAndRow($j, $i)->getValue();;
				}
			}
		}


		// Tiến hành lặp qua từng ô dữ liệu
		// Bắt đầu lặp từ offset
		for ($i = $_data_offset; $i <= $Totalrow; $i++)
		{
			// Lặp cột
			for ($j = 0; $j < $TotalCol; $j++)
			{
		    	// Tiến hành lấy giá trị của từng ô đổ vào mảng
				$data['data'][$i-$_data_offset][$j]=$sheet->getCellByColumnAndRow($j, $i)->getValue();;
			}
		}

		// Trả về dữ liệu
		return $data;
	}
}