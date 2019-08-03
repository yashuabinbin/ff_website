<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" style="float: left;">
        <el-form-item>
          <el-input placeholder="分包名称" v-model="subContractorSearchReq.subContractorName" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24" class="toolbar">
      <!--列表-->
      <el-table :data="subContractorList" border style="width: 100%">
        <el-table-column prop="subContractorId" label="id"></el-table-column>
        <el-table-column prop="subContractorName" label="分包名称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateTimeFilter }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="pageChange"
                     style="float:right;" :page-size="subContractorSearchReq.pageSize" :total="total">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editSubContractorFormVisible" :close-on-click-modal="false">
      <el-form :model="editSubContractorForm" label-width="80px"
               :rules="addSubContractorFormRules" ref="editSubContractorForm">
        <el-form-item label="分包名称" prop="subContractorName">
          <el-input v-model.trim="editSubContractorForm.subContractorName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editSubContractorFormVisible = false">取消
        </el-button>
        <el-button type="primary" @click.native=" editSubContractorFormSubmit('editSubContractorForm')">
          提交
        </el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addSubContractorFormVisible" :close-on-click-modal="false">
      <el-form :model="addSubContractorForm" label-width="80px"
               :rules="addSubContractorFormRules" ref="addSubContractorForm">
        <el-form-item label="分包名称" prop="subContractorName">
          <el-input v-model.trim="addSubContractorForm.subContractorName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addSubContractorFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubContractorFormSubmit('addSubContractorForm')">
          提交
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'subContractorManage',
    data () {
      return {
        subContractorList: [],
        subContractorSearchReq: {
          subContractorName: '',
          pageIndex: 0,
          pageSize: 15
        },
        total: 0,

        addSubContractorFormVisible: false,
        editSubContractorFormVisible: false,

        editSubContractorForm: {
          subContractorId: '',
          subContractorName: ''
        },

        addSubContractorForm: {
          subContractorName: ''
        },
        addSubContractorFormRules: {
          subContractorName: [
            {required: true, message: '请输入分包名', trigger: 'change'},
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'change'
            }
          ]
        }
      }
    },
    created () {
      this.getSubContractorList()
    },
    methods: {
      getSubContractorList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/subContractor/list',
          data: {
            subContractorName: this.subContractorSearchReq
              .subContractorName,
            pageIndex: this.subContractorSearchReq.pageIndex,
            pageSize: this.subContractorSearchReq.pageSize
          }
        }).then(response => {
          this.subContractorList = response.result.list
          this.total = response.result.total
        })
      },
      searchList: function () {
        this.subContractorSearchReq.pageIndex = 0
        this.getSubContractorList()
      },
      pageChange: function (pageIndex) {
        console.info(pageIndex)
        this.subContractorSearchReq.pageIndex = pageIndex
        this.getSubContractorList()
      },
      handleAdd: function () {
        this.addSubContractorFormVisible = true
        this.addSubContractorForm.subContractorName = ''
      },
      handleEdit: function (subContractor) {
        this.editSubContractorFormVisible = true
        this.editSubContractorForm.subContractorId = null
        this.editSubContractorForm.subContractorName = ''

        this.editSubContractorFormVisible = true
        this.editSubContractorForm.subContractorId =
          subContractor.subContractorId
        this.editSubContractorForm.subContractorName =
          subContractor.subContractorName
      },
      handleDel: function (subContractorId) {
        if (!confirm('确认删除?')) {
          return
        }

        this.doRequest({
          method: 'post',
          url: this.HOST + '/subContractor/delete',
          data: {
            subContractorId: subContractorId
          }
        }).then(response => {
          alert('删除成功')
          this.getSubContractorList()
        })
      },
      addSubContractorFormSubmit: function (addSubContractorForm) {
        this.$refs[addSubContractorForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/subContractor/add',
              data: {
                subContractorName: this.addSubContractorForm
                  .subContractorName,
                payeeName: this.addSubContractorForm.payeeName,
                taxRate: this.addSubContractorForm.taxRate
              }
            }).then(response => {
              this.getSubContractorList()
              this.addSubContractorFormVisible = false
              alert('添加成功')
            })
          }
        })
      },
      editSubContractorFormSubmit: function (editSubContractorForm) {
        this.$refs[editSubContractorForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/subContractor/edit',
              data: {
                subContractorId: this.editSubContractorForm
                  .subContractorId,
                subContractorName: this.editSubContractorForm
                  .subContractorName
              }
            }).then(response => {
              this.getSubContractorList()
              this.editSubContractorFormVisible = false
              alert('修改成功')
            })
          }
        })
      }
    }
  }
</script>
<style></style>
