$(function() {
    
    initTable();
    initCate();

    $('#filterForm').on('submit',function(e) {
        e.preventDefault();
        q.cate_id = $('[name="cate_id"]').val();
        q.state = $('[name="state"]').val();
        getList()
    })


    $('tbody').on('click','.remove',function() {
        var id = $('.remove').attr('data-id')
        layer.confirm('确定要删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if($('.remove').length == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            
            layer.close(index);
          });
    })
})






var q = {
    pagenum: 1, //页码值
    pagesize:2, //每页显示多少条数据
    cate_id: '', //文章分类的 Id
    state: '', //文章的状态，可选值有：已发布、草稿
}
//获取文章列表数据
function initTable() {
    $.ajax({
        type: 'get',
        url: '/my/article/list',
        data: q,
        success: function(res) {
            if(res.status !== 0) return layer.msg('获取数据失败')
            var str = template('tpl',res);
            $('tbody').html(str);
            renderPage(res.total) // total数据总条数
        }
    })
}

template.defaults.imports.detaformat = function(time) {
    var dt = new Date(time);
    var y = dt.getFullYear();
    var m = (dt.getMonth() + 1).toString().padStart(2,'0');
    var d = (dt.getDate()).toString().padStart(2,'0')

    var hh = (dt.getHours()).toString().padStart(2,'0')
    var mm = (dt.getMinutes()).toString().padStart(2,'0')
    var ss = (dt.getSeconds()).toString().padStart(2,'0')

    var str = `${y}年${m}月${d}日${hh}时${mm}分${ss}秒`
    return str
}

//获取分类数据
function initCate() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function(res) {
            var str = template('tpl-cate',res);
            $('[name="cate_id"]').html(str);
            layui.form.render()
        }
    })
}

//渲染分页
function renderPage(total) {
    console.log(total);
    layui.laypage.render({
        elem: 'pageBox',
        count: total, //总数据
        limit: q.pagesize,
        curr: q.pagenum,
        layout: ['count','limit','prev', 'page', 'next','skip'],
        limits:[2,3,5,10],
        jump: function(obj,first) {
            q.pagenum = obj.curr;
            q.pagesize = obj.limit;
            if(!first) {
                initTable()
            }
        }
    })
}