<?php if (!defined('PATH_SYSTEM')) die ('Bad requested!');
// Thư Viện Xử Lý Database
class MVC_Model
{
    // Tự kết nối
    public function __construct() {
        $this->connect();
    }

    // Tự hủy kết nối
    public function __destruct() {
        $this->disconnect();
    }

    // Biến lưu trữ kết nối
    private $connected;
    
    // Biến lưu trữ kết quả truy vấn
    private $result = NULL;
    
    // Hàm Kết Nối
    protected function connect() { // done
        // Nếu chưa kết nối thì thực hiện kết nối
        if (!$this->connected){
            $this->connected = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_TABLE) or die ('Lỗi kết nối với cơ sở dữ liệu');

            // Change character set to utf8
            mysqli_set_charset($this->connected, DB_CHARSET);
        }
    }
 
    // Hàm Ngắt Kết Nối
    protected function disconnect() { // done
        if ($this->connected){
            mysqli_close($this->connected);
        }
    }
 
    // Hàm Insert return id của row mới insert hoặc false
    protected function insert($sql) { // done
        mysqli_query($this->connected, $sql);
        $id = mysqli_insert_id($this->connected);

        return $id > 0 ? $id : false;
    }
 
    // Hàm Update return số row đã update (> 0 : true)
    protected function update($sql) { // done 
        mysqli_query($this->connected, $sql);
        $count = mysqli_affected_rows($this->connected);

        return $count > 0;
    }
 
    // Hàm delete
    protected function delete($sql) { // done
        mysqli_query($this->connected, $sql);
        $count = mysqli_affected_rows($this->connected);

        return $count > 0;
    }
 
    // Hàm lấy danh sách
    protected function execute($sql) { // done
        $result = mysqli_query($this->connected, $sql);
 
        if (!$result){
            $this->result = NULL;
            return false;
        } else {
            $this->result = $result;
            return true;          
        }        
    }

// FUNCTION
    // Hàm fetch data
    public function GetResult() { // done
        $result_tmp = [];
        if (!empty($this->result)){
            while ($row = mysqli_fetch_assoc($this->result)){
                array_push($result_tmp, $row);
            }
        }
        return $result_tmp;
    }

    public function WriteLog($_date = true, $_by, $_type, $_success, $_content) { // done
        // Lưu action
        $action_db_name = DB_PREFIX.'db_action';
        $action_prefix = str_replace(DB_PREFIX, '', $action_db_name);
        $sql = [
            'insert' => [
                //$action_db_name.'_date'  => $_date === true ? date(DB_DATE_FORMAT) : $_date;
                $action_prefix.'_by'    => $_by,
                $action_prefix.'_type'  => $_type,
                $action_prefix.'_success'   => $_success,
                $action_prefix.'_content'   => $_content,
            ],
            'into'  => $action_db_name,
        ];

        if ($_date !== true) // sử dụng timelapse của mysql nếu $_date = true
            $sql['insert'][$action_prefix.'_date'] = $_date;

        // Chuyển thành query string
        $sql_query = $this->ToSql($sql);
        $sql_result = $this->insert($sql_query);

        return $sql_result;
    }

    // Hàm convert array to sql string
    public function ToSql($params) { // done
        
        //$params = [
            /*'select'    => [
                'prefix_db_employee.employee_id'    => 'ID',
                'prefix_db_employee.full_name'  => 'NAME',
                'prefix_db_print_card.*',
            ],

            'count' => 'Counting',

            'from'  => [
                'prefix_db_employee',
            ],
            'join'  => [
                [
                    'type' => 'left',
                    'table'=> 'prefix_db_print_card',
                    'on'   => [
                        [
                            'prefix_db_employee.employee_id' => 'prefix_db_print_card.employee_id',
                        ]
                    ]
                ],                
            ],

            'where' => [
                'operator'  => '=',
                'relations' => 'AND',
                [
                    'prefix_db_employee.employee_id' => "15060001",
                ]
            ],*/

            /*'insert' => [
                'prefix_db_employee.employee_id'    => '111',
                'prefix_db_employee.full_name'  => 'LongPro',
            ],
            'into'  => 'prefix_db_employee',*/

            /*'update' => [
                'prefix_db_employee.full_name'  => 'LongPro2',
            ],
            'table'  => 'prefix_db_employee',
            'where' => [
                'operator'  => '=',
                'relations' => 'AND',
                [
                    'prefix_db_employee.employee_id' => "111",
                ]
            ],*/

            /*'delete' => 'prefix_db_employee',
            'where' => [
                'operator'  => '=',
                'relations' => 'AND',
                [
                    'prefix_db_employee.employee_id' => "111",
                ]
            ],*/    
        //];
        
        $sql = [];
        if (isset($params['select'])) {

            // SELECT
            array_push($sql, 'SELECT');
            if ($params['select'] == []) array_push($sql, '*');
            else {
                $select_keys = [];
                foreach ($params['select'] as $key => $value) {
                    // `table`.`id` AS `ID`
                    if (is_numeric($key)) 
                        array_push($select_keys, $value);
                    else {
                        $value = '`'.$value.'`';
                        array_push($select_keys, $key.' AS '.$value);                        
                    }
                }
                array_push($sql, join(',', $select_keys));
            }            
            if (isset($params['count']))
                array_push($sql, ',COUNT(*) AS `'.$params['count'].'`');

            // FROM
            $from_list = [];
            if (is_array($params['from'])) {
                foreach ($params['from'] as $key => $value) {
                    array_push($from_list, '`'.$key.'` AS `'.$value.'`');
                    break; // Giới hạn cái đầu tiên
                }
            }
            else 
                array_push($from_list, '`'.$params['from'].'`');
            array_push($sql, 'FROM '.join(',', $from_list));

            // JOIN
            if (isset($params['join'])) {
                foreach ($params['join'] as $join => $join_value) {
                    array_push($sql, strtoupper($join_value['type']).' JOIN ('.$join_value['table']);
                    
                    array_push($sql, ') AS `'.$join_value['as'].'`');

                    if (isset($join_value['on'])) {
                        array_push($sql, 'ON');

                        // mặc định là so sánh bằng
                        if (!isset($join_value['on']['operator']))
                            $join_value['on']['operator'] = '=';

                        // Mặc định quan hệ là AND
                        if (!isset($join_value['on']['relations']))
                            $join_value['on']['relations'] = 'AND';

                        $join_field_list = [];
                        foreach ($join_value['on'][0] as $key => $value) {
                            $key = '`'.join('`.`',explode('.', $key)).'`';
                            $value = '`'.join('`.`',explode('.', $value)).'`';

                            array_push($join_field_list, '('.$key.' '.$join_value['on']['operator'].' '.$value.')');
                        }
                        array_push($sql, join(' '.strtoupper($join_value['on']['relations']).' ', $join_field_list));


                    }

                }
            }            
        } else if (isset($params['insert'])) {

            // INSERT
            array_push($sql, 'INSERT INTO `'.$params['into'].'`');
            $key_list = [];
            $value_list = [];
            foreach ($params['insert'] as $key => $value) {
                $key = '`'.join('`.`',explode('.', $key)).'`';
                $value = '"'.mysqli_real_escape_string($this->connected, $value).'"';

                array_push($key_list, $key);
                array_push($value_list, $value);
            }
            array_push($sql, '('.join(',', $key_list).') VALUES ('.join(',', $value_list).')');
        } else if (isset($params['update'])) {

            // UPDATE
            array_push($sql, 'UPDATE `'.$params['table'].'`');
            $update_list = [];
            foreach ($params['update'] as $key => $value) {
                $key = '`'.join('`.`',explode('.', $key)).'`';
                $value = '"'.mysqli_real_escape_string($this->connected, $value).'"';

                array_push($update_list, $key.'='.$value);
            }
            array_push($sql, 'SET '.join(',', $update_list));
        } else if (isset($params['delete'])) {

            // DELETE
            array_push($sql, 'DELETE FROM `'.$params['delete'].'`');
        }

        // WHERE (SELECT + UPDATE + DELETE)
        if ((isset($params['select']) || isset($params['update']) || isset($params['delete'])) && isset($params['where'])) {
            array_push($sql, 'WHERE');
            $where_lists = [];
            // mặc định là so sánh bằng
            if (!isset($params['where']['operator']))
                $params['where']['operator'] = '=';

            // Mặc định quan hệ là AND
            if (!isset($params['where']['relations']))
                $params['where']['relations'] = 'AND';

            foreach ($params['where'][0] as $key => $value) {
                $key = '`'.join('`.`',explode('.', $key)).'`';
                $value = '"'.mysqli_real_escape_string($this->connected, $value).'"';

                array_push($where_lists, '('.$key.' '.$params['where']['operator'].' '.$value.')');
            }

            array_push($sql, join(' '.strtoupper($params['where']['relations']).' ', $where_lists));
        }

        /*if (isset($params['orderby'])) {
            $params['orderby'] = '`'.join('`.`',explode('.', $params['orderby'])).'`';
            array_push($sql, 'ORDER BY '. $params['orderby']);
        }*/

        if (isset($params['orderby'])) {
            $orderby_list = [];
            foreach ($params['orderby'][0] as $key => $value) {
                $value = '`'.join('`.`',explode('.', $value)).'`';
                
                array_push($orderby_list, $value);
            }

            array_push($sql, 'ORDER BY ('.join(',', $orderby_list).')');
            
            if (isset($params['orderby']['order'])){
                array_push($sql, $params['orderby']['order']);
            }
        }

        if (isset($params['groupby'])) {
            $groupby_list = [];
            foreach ($params['groupby'][0] as $key => $value) {
                $value = '`'.join('`.`',explode('.', $value)).'`';
                
                array_push($groupby_list, $value);
            }

            array_push($sql, 'GROUP BY ('.join(',', $groupby_list).')');
            
            if (isset($params['groupby']['order'])){
                array_push($sql, $params['groupby']['order']);
            }
        }
        return join(' ', $sql);
    }

    // Hàm lấy fields của bảng
    public function GetTableFields($table_name, $exclude_list = []) {
        $sql = 'DESCRIBE `'.DB_PREFIX.strtolower($table_name).'`';
        $this->execute($sql);
        $result = $this->getResult();

        $fields = [];
        foreach ($result as $row) {
            if (!in_array($row['Field'], $exclude_list))
                //array_push($fields, $row['Field']);
                $fields[$row['Field']] = $row['Field'];
        }

        return $fields;
    }

    // Hàm lấy index của 1 field
    public function GetDataIndexs($_table_name, $_field_name) {
        $table = strtolower($_table_name);

        $sql = 'SELECT '.$_field_name.' FROM `'.DB_PREFIX.$table.'` GROUP BY '.$_field_name;

        $this->execute($sql);

        return $this->getResult();
    }
}