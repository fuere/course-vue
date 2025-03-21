<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="login-wrapper">
        <div class="title-container">
          <h3 class="title">校园课程资源中心</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

        <div class="tips">
          <span style="margin-right:20px;"></span>
          <span></span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => { 
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url('~@/assets/login-bg.jpeg'); // 假设图片在src/assets目录下
  background-size: cover;     // 确保图片覆盖整个容器
  background-position: center; // 图片居中显示
  background-repeat: no-repeat; // 不重复平铺
  overflow: hidden;

  .login-form {
    background: rgba(255, 255, 255, 0.85); // 半透明白色背景
    border-radius: 12px;                   // 圆角
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); // 阴影增强层次
    width: 480px;                         // 适当缩小宽度
    padding: 40px 35px 30px;              // 调整内边距
    position: relative;
    margin: 0 auto;
    top: 20vh;                            // 垂直居中偏移

    // 标题样式强化
    .title-container .title {
      color: #409eff !important; // 使用Element UI的主蓝色
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); // 增加文字阴影提升对比度
    }

    // 输入框组样式改造
    .el-form-item {
      background: rgba(240, 244, 248, 0.95) !important; /* 推荐#F0F4F8带轻微透明度 */
      border: 1px solid rgba(200, 208, 216, 0.3); /* 添加浅灰色边框 */  
      .el-input__inner {
        color: #2d3a4b !important; /* 深蓝灰文字 */
      }
    }

    ::v-deep {
      /* 输入文字主色调 */
      .el-input__inner {
        color: #333 !important; // 使用深灰色（比纯黑更柔和）
        caret-color: #409eff;  // 光标颜色保持品牌蓝
      }

      /* 聚焦状态增强 */
      .el-input.is-active .el-input__inner {
        text-shadow: 0 0 1px rgba(51,51,51,0.2); // 文字防眩光
      }

      /* 占位符颜色适配 */
      input::placeholder {
        color: #999 !important;
        opacity: 1; // 确保所有浏览器占位符透明度一致
      }
    }
    // 提示信息样式优化
    .tips {
      color: #666;                       // 调整为深灰色
      margin-top: 25px;
      text-align: center;
      span {
        display: block;                  // 换行显示
        margin: 8px 0;
      }
    }
  }

  // 密码可视按钮强化
  .show-pwd {
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.8);
    padding: 5px;
    border-radius: 50%;
  }
}
</style>
