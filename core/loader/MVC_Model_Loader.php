<?php if (!defined('PATH_SYSTEM')) die ('Bad requested!');
class MVC_Model_Loader
{   
    /**
	 * Load model
     * 
	 * @param 	string
     * @desc    hàm load model, tham số truyền vào là tên của model và các biến truyền vào hàm khởi tạo
	 */
    public function Load($model, $args = [])
    {
        // Nếu model chưa load thì tiến hành load
        if (empty($this->{$model})){
            $class = ucfirst($model) . '_Model';
            require_once(PATH_APPLICATION . '/model/' . $class . '.php');
            $this->{$model} = new $class($args);
        }
    }
}