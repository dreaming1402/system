<?php if ( ! defined('PATH_SYSTEM')) die ('Bad requested!');

// Chuyển đổi chữ thành số
function StringToInt($str) {
    return sprintf("%u", crc32($str));
}