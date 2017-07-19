<?php if (!defined('PATH_SYSTEM')) die ('Bad requested!');
class MVC_Helper_Loader
{
    /**
	 * Load helper
     * 
	 * @param 	string
     * @desc    hàm load helper, tham số truyền vào là tên của helper
	 */
    public function Load($helper)
    {
        $helper = ucfirst($helper) . '_Helper';
        require_once(PATH_SYSTEM . '/helper/' . $helper . '.php');
    }
}