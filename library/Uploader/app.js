// Hỗ trợ replace tất cả text có trong chuỗi
String.prototype.ReplaceAll = function(search, replacement) { var target = this; return target.split(search).join(replacement); };

// Lấy thông tin file
function GetFileName(_file_path) { return _file_path.split('\\').pop().split('/').pop(); }
function GetFileExtension(_file_path) { return _file_path.split('.').pop(); }
function GetFileId(_file_path) { return GetFileName(_file_path).ReplaceAll('.'+GetFileExtension(_file_path), ''); }

// Định dạng bytes
function FormatBytes(_bytes, _decimals = 0) {
  if(_bytes == 0) return '0 Byte';
  var k = 1000,
      dm = _decimals + 1 || 3,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(_bytes) / Math.log(k));
  return parseFloat((_bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Hàm gọi event bằng function name
function CallFunctionByName(_function_name, _context, _args = []) {
  var args = _args.slice.call(arguments).splice(2),
      namespaces = _function_name.split("."),
      function_name = namespaces.pop(), // function name là cái cuối cùng của chuỗi
      namespace = namespaces.pop(); // namespace của function là cái cuối cùng của chuỗi đã cắt bằng function_name

  if (typeof _context[namespace][function_name] === 'function')
    return _context[namespace][function_name].apply(_context[namespace][function_name], args);
  else {
    console.log('"'+_function_name+'" function is not available');
    return false;
  }
};

$(document).ready(function() {
  // Gọi event bằng class .control-action
  // Ex: <a class="control-action" action="file.upload" data="url">Click me</a>
  $('body').on('click', '.control-action', function() {
    var action = $(this).attr('action'),
        data = $(this).attr('action-data'); //option1
          //data = [{sender: $(this), data: $(this).attr('action-data')}]; //option2
          
    //option1
    if (data == null)
      data = [];
    else
      data = data.split('|');

    if (!Array.isArray(data))
      data = [data];

      CallFunctionByName(action, window, data);
  })
})