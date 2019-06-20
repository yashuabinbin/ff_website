<template>
  <div class="index">
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <span class="el-dropdown-link">dsfad</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="140px">
          <el-menu>
            <el-menu-item v-for="menu in menuList" v-on:click="go(menu)" v-bind:key="menu.name" style="padding-left: 15px;">
              <span slot="title">
                {{ menu.name }}
              </span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ selectedMenu.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data: function () {
      return {
        menuList: [
          {
            name: '合同管理',
            to: 'contractManage',
            select: false
          },
          {
            name: '分包管理',
            to: 'subContractorManage',
            select: false
          },
          {
            name: '付款管理',
            to: 'payInfoManage',
            select: false
          },
          {
            name: '发票管理',
            to: 'invoiceInfoManage',
            select: false
          }
        ],
        selectedMenu: {
          name: '',
          to: '',
          select: false
        }
      }
    },
    created: function () {
      this.$router.push(this.menuList[0].to)
      this.selectedMenu = this.menuList[0]
    },
    methods: {
      go: function (menu) {
        this.$router.push(menu.to)
        this.selectedMenu = menu
      },
      logout: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/logout'
        }).then(response => {
          localStorage.removeItem('TOKEN')
          localStorage.removeItem('LOGINED_USER')
          this.$router.push('/login')
        })
      }
    }
  }
</script>

<style>
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-breadcrumb {
    margin-bottom: 10px;
  }

  .main {
    min-width: 800px;
    min-height: 600px;
    overflow: hidden;
    line-height: unset;
    text-align: unset;
  }

  .ml10 {
    margin-left: 10px;
  }

  .mr10 {
    margin-right: 10px;
  }

  .el-table th, td>.cell {
    text-align: center;
  }
</style>
