<?php if (!defined('PATH_SYSTEM')) die ('Bad requested!');
class MVC_Controller
{
    // Đối tượng view
    protected $view = NULL;
    
    // Đối tượng model
    protected $model = NULL;
    
    // Đối tượng library
    protected $library = NULL;
    
    // Đối tượng helper
    protected $helper = NULL;
    
    // Đối tượng config
    protected $config = NULL;

    // Method
    protected $method = NULL;
    
    /**
	 * Hàm khởi tạo
     * 
     * @desc    Load các thư viện cần thiết
	 */
    public function __construct() {
        // Define
        $GLOBALS['configs'] = [];
        $_SESSION['login_user_id'] = 'admin';

        // Method
        $this->method = $_SERVER['REQUEST_METHOD'];

        // Load Helper
        require_once PATH_SYSTEM . '/core/loader/MVC_Helper_Loader.php';
        $this->helper = new MVC_Helper_Loader();
        $this->helper->Load('functions');

        // Loader Library
        require_once PATH_SYSTEM . '/core/loader/MVC_Library_Loader.php';
        $this->library = new MVC_Library_Loader();

        // Load Model
        require_once PATH_SYSTEM . '/core/loader/MVC_Model_Loader.php';
        $this->model = new MVC_Model_Loader();

        // Load View
        require_once PATH_SYSTEM . '/core/loader/MVC_View_Loader.php';
        $this->view = new MVC_View_Loader();

    }
}