<?php if ( ! defined('PATH_SYSTEM')) die ('Bad requested!');

function image_compress($source, $destination, $quality = 80) {

	$info = getimagesize($source);

	if ($info['mime'] == 'image/jpeg') 
		$image = imagecreatefromjpeg($source);

	elseif ($info['mime'] == 'image/gif') 
		$image = imagecreatefromgif($source);

	elseif ($info['mime'] == 'image/png') 
		$image = imagecreatefrompng($source);

	if (!is_dir(dirname($destination)))
        mkdir(dirname($destination));

	imagejpeg($image, $destination, $quality);

	imagedestroy($image);

	return $destination;
}

function image_to_png($source) {

	$info = getimagesize($source);

	if ($info['mime'] == 'image/jpeg') 
		$image = imagecreatefromjpeg($source);

	elseif ($info['mime'] == 'image/gif') 
		$image = imagecreatefromgif($source);

	elseif ($info['mime'] == 'image/png') 
		$image = imagecreatefrompng($source);

	imagepng($image);

	imagedestroy($image);

	return $image;
}