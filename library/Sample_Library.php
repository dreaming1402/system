<?php
class Sample_Library
{
	/* quy tắc chung
        biến private:       tenBienA
        biến protected:     tenBienA
        biến public:        TenBienA
        biến của hàm:       _tenBienA
        biến trong hàm:     ten_bien_a

        tên hàm:            TenHamA
        tên hàm viết lại:   _TenHamA

        tên control:        control_tenA
    */

    private $privVar;	
	protected $protVar;
	public $PubVar;

	public function __construct()
	{
		# code...
		RegisterScript('Sample', 'css', LIB_DIR.'/Sample/sample.css');
		RegisterScript('Sample','js', LIB_DIR.'./Sample/sample.js');
	}

	public function __destruct() {

    }

    protected function protFunc($_args) {
    	$func_var = [];
    }

    private function privFunc($_args) {

    }

    public function PubFunc($_args) {

    }
}