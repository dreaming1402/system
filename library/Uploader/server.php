<?php
function UploadFile($_FILE, $_rename = null, $_replace = false) {
    $result = false;
    $upload_dir = 'uploads';

    $tmp_file = $_FILE['tmp_name'];
    if ($_rename == '' || $_rename == null) $_rename = $_FILE['name'];
    $destination_file = $upload_dir.'/'.$_rename;

    $upload_folder = dirname($destination_file);
    if (!is_dir($upload_folder))
        mkdir($upload_folder, 0777, true);

    if (file_exists($destination_file) && $_replace == false) {
        $result = -1;
    } else {        
        $upload_flag = move_uploaded_file($tmp_file, $destination_file);

        if ($upload_flag) {
            $result = $destination_file;
        };
    };

    return $result;
}

$data = [
    'response'  => [
        'success'   => false,
        'message'   => 'Upload could not completed',
        'data'      => [],
    ],
];

$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'POST') {
	if (isset($_FILES['file'])) {
        $rename = '/'.$_FILES['file']['name'];
        if ($_POST['rename'] != 'false') $rename = '/'.$_POST['rename'];

        $upload_file = UploadFile($_FILES['file'], $rename, $_POST['replace'] == 'true');

        if ($upload_file == -1) {
            $data = [
                'response'  => [
                    'success'   => false,
                    'message'   => 'Duplicate file',
                    'data'      => [
                        'file'   => $rename,
                    ],
                ],
            ];
        } else if ($upload_file) {
            $data = [
                'response'  => [
                    'success'   => true,
                    'message'   => 'Upload successful',
                    'data'      => [
                        'file'   => $upload_file,
                    ],
                ],
            ];
        }
    }
} else if ($method == 'DELETE') {
	if (isset($_GET['id'])&&isset($_GET['ext'])) {
        $upload_dir = 'uploads';
        $file = $upload_dir.'/'.$_GET['id'].'.'.$_GET['ext'];

        if (file_exists($file)) {
            $delete_file = unlink($file);

            if ($delete_file) {
                $data = [
                    'response'  => [
                        'success'   => true,
                        'message'   => 'Delete successful',
                        'data'      => [
                            'file'   => $file,
                        ],
                    ],
                ];
            }
        } else {
            $data = [
                'response'  => [
                    'success'   => false,
                    'message'   => 'File not found',
                    'data'      => [
                        'file'   => $file,
                    ],
                ],
            ];
        }
        
    }
} else {
	$data['response']['message'] = 'Method Not Allowed';
}

$response = $data['response'];
header("Content-Type: application/json; charset=UTF-8");
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
exit();