function Uploader(_options) {
	var defaults = {
			appName: 'Uploader',
	        namespace: _options.namespace || 'Demo',

	        renderTo: _options.renderTo || '#Uploader',
	        autoUpload: _options.autoUpload || false,

	        debug: _options.debug || false,

	        dropzoneCls: _options.dropzoneCls || 'uploader-dropzone',
	        fileCls: _options.fileCls || 'uploader-file',
	        hintCls: _options.hintCls || 'uploader-hint',
	        outputCls: _options.outputCls || 'uploader-output',
	        fileTemplates: _options.fileTemplates || {
	        	default: false,
	        },
	        hint: _options.hint || false,

	        // File
	        server: _options.server  || {
	        	upload: 'server.php',
	        	delete: 'server.php',
	        },
	        multiFile: _options.multiFile || false,
	        overwrite: _options.overwrite || false,
	        extensions: _options.extensions || ['png'],
	        maxSize: _options.maxSize*1024*1024 || 2*1024*1024, // mặc định 2mb
	        thumb: _options.thumb || false,

	        // callback
	        afterAdd: _options.afterAdd || false,
	        afterRemove: _options.afterRemove || false,
	        afterClear: _options.afterClear || false,
	        afterChange: _options.afterChange || false,
	        afterDelete: _options.afterDelete || false,

	        afterDragover: _options.afterDragover || false,
	        afterDragleave: _options.afterDragleave || false,
	        afterDrop: _options.afterDrop || false,

	        afterUpload: _options.afterUpload || false,
	        afterUploadSuccess: _options.afterUploadSuccess || false,
	        afterUploadError: _options.afterUploadError || false,

	        afterDelete: _options.afterDelete || false,
	        afterDeleteSuccess: _options.afterDeleteSuccess || false,
	        afterDeleteError: _options.afterDeleteError || false,
		},
		debug = defaults.debug || false,
		fileList = [],
		dropzoneTemplate = '<div class="'+defaults.dropzoneCls+'"><input class="'+defaults.fileCls+'-handler" type="file" name="file" id="file" title="file" accept=""><span class="'+defaults.hintCls+'">'
					+'<button action="'+defaults.namespace+'.Browers" class="control-action btn btn-default">Chọn</button> hoặc kéo thả file vào đây</span><!--drop-zone--></div>';
        outputTemplate = '<p class="'+defaults.outputCls+'"></p>';
        fileTemplate = '<div class="'+defaults.fileCls+'">'
        				+'<div class="file-thumb"><div class="centered"><span class="file-extension">EXT</span></div><!--thumb--></div>'
        				+'<div class="file-info"><span class="file-name">Name</span><span class="file-size">size</span><!--info--></div>'
        				+'<!--file--></div>',
        fileControl = '<div class="file-control overlay"><div class="centered"><i class="loading fa fa-refresh fa-spin text-blue"></i>'
	                	+'<div class="control">'
	                	+'<span action="'+defaults.namespace+'.UploadFile" role="run" class="control-action text-blue"><i class="fa fa-upload"></i></span>'
	                	+'<span action="'+defaults.namespace+'.TryUploadFile" role="trying" class="control-action text-orange"><i class="fa fa-refresh"></i></span>'
	                	+'<span action="'+defaults.namespace+'.RemoveFile" role="remove" class="control-action text-red"><i class="fa fa-times"></i></span>'
	                	+'<span action="'+defaults.namespace+'.DeleteFile" role="delete" class="control-action bg-red"><i class="fa fa-trash"></i></span>'
	            		+'<!--control--></div>'
	            		+'<!--centered--></div><!--overlay--></div>',

        uploader = $(defaults.renderTo),
		output = uploader.find('.'+defaults.outputCls),
        dropzone = uploader.find('.'+defaults.dropzoneCls),
		fileHandler = dropzone.find('input:file.'+defaults.fileCls+'-handler'),
		hint = dropzone.find('.'+defaults.hintCls),
		fileDemo = dropzone.find('.'+defaults.fileCls+'-container.demo'),
		uploadBusy = false,
		me = this;

	this.Run = function () {
		if (!uploader.length) {
            // Hiển thị thông báo
            error('"renderTo" not set', true);
            return;
        };
        uploader.addClass('uploader');

        if (!dropzone.length) {
        	uploader.append(dropzoneTemplate);
        	dropzone = uploader.find('.'+defaults.dropzoneCls);
        	fileHandler = dropzone.find('input:file.'+defaults.fileCls+'-handler');
			hint = dropzone.find('.'+defaults.hintCls);
			fileDemo = dropzone.find('.'+defaults.fileCls+'-container.demo');
        };

        if (!fileHandler.length) {
			dropzone.prepend($(dropzoneTemplate).find('input:file.'+defaults.fileCls+'-handler'));
			fileHandler = dropzone.find('input:file.'+defaults.fileCls+'-handler');
        };
        if (defaults.extensions.length) {
        	fileHandler.attr('accept', "." + defaults.extensions.join(',.'));
        };
        if (!defaults.multiFile) {
        	dropzone.addClass('single-file');
        	fileHandler.attr('multiple', false);
        } else {
        	dropzone.removeClass('single-file');
        	fileHandler.attr('multiple', true);
        }

        if (!hint.length) {
            dropzone.append($(dropzoneTemplate).find('.'+defaults.hintCls));
            hint = dropzone.find('.'+defaults.hintCls);
        } else {
            if (defaults.hint) {                
                hint.html(defaults.hint);
                hint = dropzone.find('.'+defaults.hintCls);
            };
        };

        if (!fileDemo.length) {
        	dropzone.append($('<div class="'+defaults.fileCls+'-container">'+fileTemplate+'</div>').addClass('demo'));
        	fileDemo = dropzone.find('.'+defaults.fileCls+'-container.demo');
        	fileDemo = fileDemo.find('.'+defaults.fileCls).append(fileControl);
        };

        if (!output.length) {
        	uploader.append(outputTemplate);
			output = uploader.find('.'+defaults.outputCls);
        };

        if (typeof _options.fileTemplates == 'undefined') {
            defaults.fileTemplates['default'] = fileTemplate;
        } else {
        	defaults.fileTemplates.default = _options.fileTemplates.default || fileTemplate;
        };

        // Cập nhập output
        error('Setup completed');
    };
	this.Run();

// Events
	dropzone.on("dragover", dropzone, function(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    $(this).addClass('dragging');

		if (defaults.afterDragover)
			window[defaults.afterDragover](event);
	});
	dropzone.on("dragleave", dropzone, function(event) {
	    event.preventDefault();  
	    event.stopPropagation();
	    $(this).removeClass('dragging');

		if (defaults.afterDragleave)
			window[defaults.afterDragleave](event);
	});
	dropzone.on("drop", dropzone, function(event) {
	    event.preventDefault();  
	    event.stopPropagation();
	    $(this).removeClass('dragging');

	    if(!event.originalEvent.dataTransfer) return;

	    var files = event.originalEvent.dataTransfer.files;

	    if (!files.length) {
	    	error('Drop empty!', true);
	    	return;
	    };

	    if (defaults.multiFile) {
	    	$(files).each(function(index, file) {
		    	me.AddFile(file);
		    });
	    } else {
	    	if (files.length > 0)
	    		me.AddFile(files[0]);
	    };

		if (defaults.afterDrop)
			window[defaults.afterDrop](event);
	});
	fileHandler.on('change', function(e) {
		var files = $(this)[0].files;
		if (defaults.multiFile) {
	    	$(files).each(function(index, file) {
		    	me.AddFile(file);
		    });
	    } else {
	    	if (files.length > 0)
	    		me.AddFile(files[0]);
	    };

	    // Clear input-handler
	    this.value = "";
	});

// Function
	// Hiện file dialog khi nhấn vào
	this.Browers = function() { fileHandler.trigger('click'); }

	// Thêm File mới bằng Obj vào danh sách
    this.AddFile = function(_file, _template_name = 'default') {
    	// Kiểm tra định dạng file
    	if ($.inArray(GetFileExtension(_file.name), defaults.extensions) < 0) {
    		// Hiện thông báo
    		error('Định dạng file không đúng', true);
    		return;
    	};

    	// Kiểm tra file size
    	if (_file.size > defaults.maxSize) {
    		// Hiện thông báo
    		error('File "'+_file.name+'" vượt quá dung lượng cho phép', true);
    		return;
    	};

        // Thêm vào fileList
        var file = me.CreateFile(_file, _template_name),
        	index = fileList.push({file_id: GetFileId(_file.name), file:_file}) -1,
        	file_id = fileList[index].file_id;		

        // Thêm id cho file
        file.attr('id', file_id);        
    	file.find('.'+defaults.fileCls).attr('id', file_id);
        if (!file.find('.file-control').length)
            file.find('.'+defaults.fileCls).append(fileControl);
        file.find('.control-action').attr('action-data', file_id);

        // Thêm vào dropzone
        if (!defaults.multiFile)
        	dropzone.find('.'+defaults.fileCls+'-container:not(.'+defaults.fileCls+'-container.demo)').remove();
        dropzone.append(file);

        // Cập nhập output
        error('Đã thêm file "'+_file.name+'"');

        // Tự động upload
        if (defaults.autoUpload)
        	me.UploadFile(file_id);

        // calback event
        if (defaults.afterAdd)
            window[defaults.afterAdd](fileList, file);

        onChange();

        return file_id;		
    };

	// Xóa file bằng file_id
    this.RemoveFile = function(_file_id) {
        var index = me.GetFileIndex(_file_id);

        if (index > -1) {
        	// Lấy file name
        	var file_name = fileList[index].file.name;

            // Xóa khỏi danh sách
            fileList.splice(index, 1);

            // Xóa khỏi dropzone
            dropzone.find('.'+defaults.fileCls+'#'+_file_id).parent().remove();

            // Cập nhập output
            error('Đã hủy file "'+file_name+'"');
        } else {
            // Cập nhập output            
            error('Không tìm thấy file');
        };

        // calback event
        if (defaults.afterRemove)
            window[defaults.afterRemove](fileList);

        onChange();
    };

	// Xóa tất cả file
    this.Clear = function() {
        fileList = [];
        dropzone.find('.'+defaults.fileCls+'-container').remove();

        // Cập nhập output
        error('Đã xóa tất cả file');

        // calback event
        if (defaults.afterClear)
            window[defaults.afterClear](fileList);

        onChange();
    };

    // Tìm vị trí trong fileList bằng file_id
    // Kết quả trả về là index
    // -1 = không tìm thấy
    this.GetFileIndex = function(_file_id) { // done
        // Trả về -1 nếu không tìm thấy
        var index = -1;
        fileList.forEach(function(file, i) {
            if (file.file_id == _file_id) {
                // Trả về giá trị index
                index = i;
                return index;
            };
        });

		return index;
    };

    // Tạo file template
    this.CreateFile = function(_file, _template_name = 'default') { // done
    	var file = $('<div class="'+defaults.fileCls+'-container">'+defaults.fileTemplates[_template_name]+'</div>');

    	// Set file meta
		file.find('.file-name').text(_file.name);
		file.find('.file-size').text(FormatBytes(_file.size));
		file.find('.file-extension').text(GetFileExtension(_file.name));

        // Tạo thumb
		if (defaults.thumb) {
			file.find('.file-thumb').css('background-image', 'url("'+defaults.thumb+'")');
			file.find('.file-thumb').attr('class', 'thumb loaded');
		};

    	// Cập nhập output
        error('Tạo file thành công');

        // calback event
        if (defaults.afterCreate)
            window[defaults.afterCreate](fileList, file);

        return file;
    };

    // Upload file
    this.UploadFile = function(_file_id, _rename = false, _is_auto = false) { // done
    	// Kiểm tra hiện tại có file đang upload hay không
		if (uploadBusy) {
			if (_is_auto) {				
				// Tự gọi lại cho đến khi nào uploadBusy = false
				setTimeout(function() {me.UploadFile(_file_id, _rename, true)}, 1000);
				return;
			} else {
				if (!defaults.multiFile) {
					error('Một file trước đó đang được upload, vui lòng đợi cho đến khi hoàn tất', true);
					return;
				};
			};
		};

		// Reset flag
		uploadBusy = false;

		var file_outer = dropzone.find('.'+defaults.fileCls+'-container#'+_file_id),
			file_index = me.GetFileIndex(_file_id),
			form_data = new FormData(),
			accept_thumb = ['png', 'jpg', 'jpeg'];

		if (file_index < 0) {
			error('Không tìm thấy file('+_file_id+')', _is_auto == true);
			return;
		};

		var file = fileList[file_index].file;

		form_data.append('file', file);
		form_data.append('rename', _rename);
		form_data.append('overwrite', defaults.overwrite);

		var ajax = new $.ajax({
			url: defaults.server.upload,
			method: 'POST',
			data: form_data,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function(jqXHR, settings) {
				error('Upload file "'+file.name+'"');
				file_outer.attr('class', defaults.fileCls+'-container uploading');
				uploadBusy = true;
			},
			success: function(data, textStatus, jqXHR) {
				if (data.success) {
					file_outer.attr('class', defaults.fileCls+'-container success');
					file_outer.attr('file_id', GetFileId(data.data));

					if ($.inArray(GetFileExtension(data.data).toLowerCase(), accept_thumb) >= 0) {
						file_outer.find('.file-thumb').css('background-image', 'url("'+data.data+'")');
						file_outer.find('.file-thumb').attr('class', 'file-thumb loaded');
					} else {
						file_outer.find('.file-thumb').attr('class', 'file-thumb');
					};
				} else {
					file_outer.attr('class', defaults.fileCls+'-container error');
					file_outer.find('.file-thumb').attr('class', 'file-thumb');
					file_outer.find('.file-thumb').css('background-image', 'none');
					file_outer.find('.loading').attr('class', 'loading fa fa-warning text-orange');
				};

				error(data.message+' "'+file.name+'"');

				uploadBusy = false;

		        // calback event
		        if (defaults.afterUploadSuccess)
		            window[defaults.afterUploadSuccess]({data: data, textStatus: textStatus, jqXHR: jqXHR});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				file_outer.attr('class', defaults.fileCls+'-container failed');
				file_outer.find('.loading').attr('class', 'loading fa fa-ban text-red');

				error('Upload bị lỗi "'+file.name+'"');
				if (defaults.debug) console.log(errorThrown);

				uploadBusy = false;

				// calback event
		        if (defaults.afterUploadError)
		            window[defaults.afterUploadError]({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
			},
			complete: function(jqXHR, textStatus) {
				uploadBusy = false;
			},
		});
	};

	// Delete file
	this.DeleteFile = function(_file_id) {
		var file_outer = dropzone.find('.'+defaults.fileCls+'-container#'+_file_id),
			file_index = me.GetFileIndex(_file_id);

		if (file_index < 0) {
			error('Không tìm thấy file('+_file_id+')', _is_auto == true);
			return;
		};

		var file = fileList[file_index].file,
			ext = GetFileExtension(file.name),			
			params = '?&id='+_file_id+'&ext='+ext;

		if (defaults.server.delete.indexOf('?') >= 0)
			params = '&id='+_file_id+'&ext='+ext;

		var ajax = new $.ajax({
			url: defaults.server.delete+params,
			method: 'DELETE',
			beforeSend: function(jqXHR, settings) {
				file_outer.attr('class', defaults.fileCls+'-container deleting');
			},
			success: function(data, textStatus, jqXHR) {
				if (data.success) {
					me.RemoveFile(_file_id);
				} else {
					file_outer.attr('class', defaults.fileCls+'-container error');
					file_outer.attr('class', defaults.fileCls+'-container filenotfound');					
					file_outer.find('.loading').attr('class', 'loading fa fa-warning text-orange');
				};

				error(data.message+' "'+file.name+'"');

				// calback event
		        if (defaults.afterDeleteSuccess)
		            window[defaults.afterDeleteSuccess]({data: data, textStatus: textStatus, jqXHR: jqXHR});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				file_outer.attr('class', defaults.fileCls+'-container failed');
				file_outer.find('.loading').attr('class', 'loading fa fa-ban text-red');

				error('Delete bị lỗi "'+file.name+'"');
				if (defaults.debug) console.log(errorThrown);

				// calback event
		        if (defaults.afterDeleteError)
		            window[defaults.afterDeleteError]({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
			},
			complete: function(jqXHR, textStatus) {
			}
		});
	};

	// Trying upload
	this.TryUploadFile = function(_file_id, _rename = false) {
		me.UploadFile(_file_id, _rename, true);
	};

	// Update GUI
    function onChange() { // done
		var files = dropzone.find('.'+defaults.fileCls+'-container:not(.'+defaults.fileCls+'-container.demo)');

        if (files.length)
            hint.addClass('hidden');
        else
            hint.removeClass('hidden');

		// calback event
        if (defaults.afterChange)
            window[defaults.afterChange](fileList);
	};

	// Error handler
    function error(_message, _show_alert = false) { // done
        if (_show_alert) alert(_message);
        if (debug) console.log('[Upload Error] - ' + _message);
    	output.text(_message);
    };
};