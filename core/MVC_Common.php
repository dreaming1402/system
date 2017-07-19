<?php if (!defined('PATH_SYSTEM')) die ('Bad requested!');
/**
 * Hàm chạy ứng dụng
 */
function MVC_Load()
{
    if (session_status() == PHP_SESSION_NONE) session_start();

    //if (!isset($_SESSION['uid']) && strtolower($_GET['c']) != 'login')
    //    header('location: admin.php?c=Login');
    
    // Lấy phần config khởi tạo ban đầu
    $config = include_once PATH_APPLICATION . '/config/init.php';

    // Nếu không truyền controller thì lấy controller mặc định
    if (empty($_GET['c'])) $_GET['c'] = $config['default_controller'];
    $controller = $_GET['c'];

    // Nếu không truyền action thì lấy action mặc định
    if (empty($_GET['a'])) $_GET['a'] = $config['default_action'];
    $action = $_GET['a'];

    // Chuyển đổi tên controller vì nó có định dạng là {Name}_Controller
    $controller = ucfirst(strtolower($controller)) . '_Controller';

    // chuyển đổi tên action vì nó có định dạng {name}Action
    $action = strtolower($action) . 'Action';
    
    // Kiểm tra file controller có tồn tại hay không
    if (!file_exists(PATH_APPLICATION . '/controller/' . $controller . '.php')) {
        die ('Không tìm thấy controller');
    }

    // Include model chính để các model con nó kế thừa
    include_once PATH_SYSTEM . '/core/MVC_Model.php';

    // Include controller chính để các controller con nó kế thừa
    include_once PATH_SYSTEM . '/core/MVC_Controller.php';

    // Load Base_Controller
    if (file_exists(PATH_APPLICATION . '/core/Base_Controller.php')){
        include_once PATH_APPLICATION . '/core/Base_Controller.php';
    }
    
    // Gọi file controller vào
    require_once PATH_APPLICATION . '/controller/' . $controller . '.php';

    // Kiểm tra class controller có tồn tại hay không
    if (!class_exists($controller)) {
        die ('Không tìm thấy controller');
    }

    // Khởi tạo controller
    $controllerObject = new $controller();

    // Kiểm tra action có tồn tại hay không
    if ( !method_exists($controllerObject, $action)){
        die ('Không tìm thấy action');
    }
    
    // Chạy ứng dụng
    $controllerObject->{$action}();
}
