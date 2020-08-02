$(function(){
    getList();

    var index = null;
    var index1 = null;
    //点击按钮添加功能
    
    $('#btnAdd').on('click',function() {
        index = layer.open({
            type:1,
            area:["500px","250px"],
            title:'添加文章分类',
            content:$('#addTpl').html()
        })
    });
    $('body').on('submit','#form-add',function(e) {
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/my/article/addcates',
            data:$('#form-add').serialize(),
            success: function(res){
                if(res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                layer.msg('添加分类成功')
                getList();
                //第一种思路，模拟点击关闭弹出层
                $('.layui-layer-close').click();
            }
        })
    });
    
    //编辑按钮点击事件
    $('body').on('click','.edit',function(){
        index1 = layer.open({
            type:1,
            area:["500px","250px"],
            title:'修改文章分类',
            content:$('#editTpl').html()
        })
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                layui.form.val('editform',res.data)
            }
        })
    })

    //为编辑表单添加提交功能
    $('body').on('submit','#form-edit',function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('修改成功')
                getList();
                layer.close(index1)
            }
        })
    })

    //删除功能
    $('body').on('click','.remove',function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type:'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) return layer.msg('删除失败');
                    layer.msg('删除成功')
                    getList()
                }
            })
            layer.close(index);
        });
    })
})






//获取文章列表，渲染到页面上
function getList() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function(res) {
            if(res.status != 0) {
                return layer.msg('获取文章列表失败')
            }
            var tr = template('tpl',res);
            $('tbody').html(tr)
        }
    })
}

