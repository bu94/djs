$(function() {
    $('#goReg,#goLogin').on('click',function() {
        $(this).parents('form').hide().siblings('form').show();
    })

    layui.form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $('#regBox [name="password"]').val();
            if(pwd != value) {
                return '密码不一致'
            }
        }
    })

    $('#regBox').submit(function(e) {
        var username = $('#regBox [name="username"]').val();
        var password = $('#regBox [name="password"]').val();
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: username,
                password : password
            },
            success: function(res) {
                if(res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                $('#goLogin').click();
            }
        })
    })

    $('#loginBox').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $('#loginBox').serialize(),
            success: function(res) {
                if(res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                localStorage.setItem('token',res.token);
                location.href = '/index.html';
            }
        })
    })
})