$(function () {
    layui.form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称长度必须在1 ~ 6个字符之间!'
            }
        }
    })
    getUser();
    function getUser() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                console.log(res);
                layui.form.val('formInfo',res.data)
            }
        })
    }

    $('#btnReset').on('click',function(e){
        e.preventDefault();
        getUser();
    })

    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})