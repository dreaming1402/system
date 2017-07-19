<?php if (!defined('PATH_SYSTEM')) die ('Bad requested!');
class MVC_View_Loader
{
    /**
     * @desc biến lưu trữ các view đã load
	 */
    private $content = array();
    
    /**
	 * Load view
     * 
	 * @param 	string
     * @param   array
     * @desc    hàm load view, tham số truyền vào là tên của view và dữ liệu truyền qua view
	 */
    public function Load($view, $data = array()) 
    {
        // Controller & action 
        $controller = ucfirst(strtolower($_GET['c']));
        $action = strtolower($_GET['a']);
        $page_id = $controller.'_'.$action.'_'.rand(1,100);

        // Chuyển mảng dữ liệu thành từng biến
        extract($data);
        
        // Chuyển nội dung view thành biến thay vì in ra bằng cách dùng ab_start()
        ob_start();
        require_once PATH_APPLICATION . '/view/' . $view . '.php';
        $content = ob_get_contents();
        ob_end_clean();
        
        // Gán nội dung vào danh sách view đã load
        $this->content[] = $content;
    }
    
    // Hàm hiển thị toàn bộ view đã load, được dùng ở controller
    public function Show() { // Done
        foreach ($this->content as $html){
            echo $html;
        };
    }
}