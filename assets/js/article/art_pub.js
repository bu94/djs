$(function() {
    var layer = layui.layer;
    getList()
    function getList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if(res.status !== 0) {
                    return layer.msg('获取类别失败')
                }
                var str = template('tpl-cate',res);
                $('[name="cate_id"]').html(str);
                layui.form.render('select');
            }
        })
    }
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

        // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnFile').on('click', function() {
    	$('#coverFile').click()
    })


    $('#coverFile').on('change',function() {
        if(this.files.length == 0) return layer.msg('更换封面失败');
        var imgURL = URL.createObjectURL(this.files[0]);
        $image
          .cropper('destroy') // 销毁旧的裁剪区域
          .attr('src', imgURL) // 重新设置图片路径
          .cropper(options) // 重新初始化裁剪区域
    })


    var state = '已发布';
    $('#btn2').on('click',function(){
        state = '草稿'
    })


    $('#form-pub').on('submit',function(e){
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state',state);
        // fd.forEach(function(v,k){
        //     console.log(k,v);
        // });
        $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function(blob) {
          // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          // 5. 将文件对象，存储到 fd 中
          fd.append('cover_img', blob);
          $.ajax({
              type:'post',
              url:'/my/article/add',
              data:fd,
              processData: false,
              contentType: false,
              success: function(res){
                console.log(res);
                if(res.status !== 0) return layer.msg('发布失败');
                location.href = '/article/art_list.html'
              }
          })
        
        })
        
    })
})

