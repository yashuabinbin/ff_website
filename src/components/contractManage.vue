<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" style="float: left;">
        <el-form-item>
          <el-input placeholder="合同名称" v-model="contractSearchReq.contractName" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-input placeholder="合同号" v-model="contractSearchReq.contractNum" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchList()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24" class="toolbar">
      <!--列表-->
      <el-table :data="contractList" border style="width: 100%">
        <el-table-column prop="contractNum" label="合同号" width="150px"></el-table-column>
        <el-table-column prop="contractName" label="合同名称" width="200px"></el-table-column>
        <el-table-column prop="contractDesc" label="合同描述" width="200px"></el-table-column>
        <el-table-column prop="taxRate" label="税率" width="100px"></el-table-column>

        <el-table-column label="分摊比率" style="text-align:center">
          <template v-for="(subContractor, index) in subContractorList">
            <el-table-column prop="subContractorList" :label="subContractor.subContractorName"
                             v-bind:key="subContractor.subContractorId" width="200px">
              <template slot-scope="scope">
                {{ scope.row.subContractorList[index].shareRate }}%
              </template>
            </el-table-column>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateTimeFilter }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="160px">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row.contractId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="pageChange"
                     style="float:right;" :page-size="contractSearchReq.pageSize" :total="total">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editContractFormVisible" :close-on-click-modal="false">
      <el-form :model="editContractForm" label-width="80px" :rules="addContractFormRules" ref="editContractForm">

        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model.trim="editContractForm.contractName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="合同号" prop="contractNum">
          <el-input v-model.trim="editContractForm.contractNum" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="合同描述" prop="contractDesc">
          <el-input type="textarea" v-model.trim="editContractForm.contractDesc"
                    auto-complete="off" maxlength="30" show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item label="税率" prop="taxRate">
          <el-input type="number" step="0.01" v-model.number="editContractForm.taxRate" auto-complete="off">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-row :span="24" v-if="subContractorList !== undefined && subContractorList.length > 0">
          <el-col :span="12" v-for="(subContractor, index) in editContractForm.subContractorList"
                  :key="subContractor.subContractorId">
            <el-form-item :label="subContractorList[index].subContractorName + ' 分摊比率'"
                          :prop="'subContractorList.' + index + '.shareRate'"
                          :rules="addContractFormRules.subContractorList.shareRate"
                          label-width="150px">
              <el-input type="number" step="0.01" v-model.number="subContractor.shareRate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addContractor(false)">新增分包</el-button>
        <el-button @click.native="editContractFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editContractFormSubmit('editContractForm')">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addContractFormVisible">
      <el-form :model="addContractForm" label-width="80px"
               :rules="addContractFormRules" ref="addContractForm">
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model.trim="addContractForm.contractName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="合同号" prop="contractNum">
          <el-input v-model.trim="addContractForm.contractNum" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="合同描述" prop="contractDesc">
          <el-input type="textarea" v-model.trim="addContractForm.contractDesc"
                    auto-complete="off" maxlength="30" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="税率" prop="taxRate">
          <el-input
            type="number"
            step="0.01"
            v-model.number="addContractForm.taxRate"
            auto-complete="off">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-row :span="24" v-if="subContractorList !== undefined && subContractorList.length > 0">
          <el-col :span="12" v-for="(subContractor, index) in addContractForm.subContractorList"
                  :key="subContractor.subContractorId">
            <el-form-item :label="subContractorList[index].subContractorName + ' 分摊比率'"
                          :prop="'subContractorList.' + index + '.shareRate'"
                          :rules="addContractFormRules.subContractorList.shareRate"
                          label-width="150px">
              <el-input type="number" step="0.01" v-model.number="subContractor.shareRate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addContractFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addContractFormSubmit('addContractForm')">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'contractManage',
    data () {
      const taxRateValidator = (rule, value, callback) => {
        if (value === null || value === undefined) {
          callback(new Error('请输入税率'))
          return
        }

        if (value < 0 || value > 100) {
          callback(new Error('数值范围0-100，小数点后至多2位'))
          return
        }

        if (!new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$').test(value)) {
          callback(new Error('数值范围0-100，小数点后至多2位'))
          return
        }
        callback()
      }

      return {
        subContractorList: [],

        contractList: [],
        contractSearchReq: {
          contractNum: '',
          contractName: '',
          pageIndex: 0,
          pageSize: 12
        },
        total: 0,

        addContractFormVisible: false,
        editContractFormVisible: false,

        editContractForm: {
          subContractorList: [
            {
              subContractorId: '',
              shareRate: null
            }
          ],
          contractId: '',
          contractName: '',
          contractNum: '',
          contractDesc: '',
          taxRate: null
        },

        addContractForm: {
          subContractorList: [
            {
              subContractorId: '',
              shareRate: null
            }
          ],
          contractName: '',
          contractNum: '',
          contractDesc: '',
          taxRate: null
        },
        addContractFormRules: {
          contractName: [
            {required: true, message: '请输入合同名', trigger: 'change'},
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'change'
            }
          ],
          contractNum: [
            {required: true, message: '请输入合同号', trigger: 'change'},
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'change'
            }
          ],
          taxRate: [{validator: taxRateValidator, trigger: 'change'}],
          idx: [{required: true, message: '请选择序号', trigger: 'change'}],
          subContractorList: {
            subContractorId: [
              {required: true, message: '请选择分包', trigger: 'change'}
            ],
            shareRate: [{validator: taxRateValidator, trigger: 'change'}]
          }
        }
      }
    },
    created () {
      this.getContractList()
      this.getSubContractorList()
    },
    methods: {
      getContractList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/contract/list',
          data: this.contractSearchReq
        }).then(response => {
          this.contractList = response.result.list
          this.total = response.result.total
        })
      },
      searchList: function () {
        this.contractSearchReq.pageIndex = 0
        this.getContractList()
      },
      pageChange: function (pageIndex) {
        this.contractSearchReq.pageIndex = pageIndex
        this.getContractList()
      },
      handleAdd: function () {
        this.addContractFormVisible = true
        this.addContractForm.contractNum = ''
        this.addContractForm.contractName = ''
        this.addContractForm.contractDesc = ''
        this.addContractForm.taxRate = null
        this.addContractForm.subContractorList = []
        this.subContractorList.forEach(item => {
          this.addContractForm.subContractorList.push({subContractorId: item.subContractorId, shareRate: 0})
        })
      },
      handleEdit: function (contract) {
        this.editContractFormVisible = true
        this.editContractForm.contractId = null
        this.editContractForm.contractNum = ''
        this.editContractForm.contractName = ''
        this.editContractForm.contractDesc = ''
        this.editContractForm.taxRate = null
        this.editContractForm = this.deepCopy(contract)
      },
      handleDel: function (contractId) {
        if (!confirm('确认删除?')) {
          return
        }

        this.doRequest({
          method: 'post',
          url: this.HOST + '/contract/delete',
          data: {
            contractId: contractId
          }
        }).then(response => {
          alert('删除成功')
          this.getContractList()
        })
      },
      addContractFormSubmit: function (addContractForm) {
        this.$refs[addContractForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/contract/add',
              data: this.addContractForm
            }).then(response => {
              this.getContractList()
              this.addContractFormVisible = false
              alert('添加成功')
            })
          }
        })
      },
      editContractFormSubmit: function (editContractForm) {
        this.$refs[editContractForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/contract/edit',
              data: this.editContractForm
            }).then(response => {
              this.getContractList()
              this.editContractFormVisible = false
              alert('修改成功')
            })
          }
        })
      },

      removeSubContractor: function (item, isAdd) {
        let index = (isAdd ? this.addContractForm : this.editContractForm).subContractorList.indexOf(item)
        if (index !== -1) {
          (isAdd ? this.addContractForm : this.editContractForm).subContractorList.splice(index, 1)
        }
      },
      getSubContractorList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/subContractor/listAll'
        }).then(response => {
          this.subContractorList = response.result
          console.info(this.subContractorList)
        })
      }
    }
  }
</script>
<style>

</style>
