<template>
  <section class="main_inner">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="合同号" v-model="payInfoSearchReq.contractNum" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="收款单位" v-model="payInfoSearchReq.payee" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-select v-model="payInfoSearchReq.subContractorId" placeholder="请选择分包" clearable>
              <el-option v-for="item in subContractorList"
                         :key="item.subContractorId"
                         :label="item.subContractorName"
                         :value="item.subContractorId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-select v-model="payInfoSearchReq.payType" filterable placeholder="请选择" clearable>
              <el-option key="SUB_CONTRACTOR" label="分包" value="SUB_CONTRACTOR"></el-option>
              <el-option key="MIGRANT_WORKER" label="农民工" value="MIGRANT_WORKER"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item>
            <el-date-picker type="date" style="width: 150px;" v-model="payInfoSearchReq.payStartTime"
                            placeholder="付款开始日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-date-picker type="date" style="width: 150px;" v-model="payInfoSearchReq.payEndTime"
                            placeholder="付款结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" @click="searchList()">查询</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <el-col :span="24" class="toolbar">
      <!--列表-->
      <el-table :data="payInfoList" :summary-method="getSummaries" scope="scope" border style="width: 100%">
        <el-table-column label="合同号" prop="contractNum" width="150">
        </el-table-column>

        <el-table-column label="收款单位" prop="payee" width="200"></el-table-column>

        <el-table-column label="金额" prop="payAmount" width="100">
        </el-table-column>

        <el-table-column label="扣履约金" prop="performanceBoundAmount" width="100">
        </el-table-column>

        <el-table-column label="付款类型">
          <template slot-scope="scope">
            <span>{{scope.row.payType == 'SUB_CONTRACTOR' ? '分包' : '农民工'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remark" width="150"></el-table-column>

        <template v-for="(subContractor, index) in subContractorList">
          <el-table-column prop="payDetailInfoList" :label="subContractor.subContractorName"
                           v-bind:key="subContractor.subContractorId" width="200px">
            <template slot-scope="scope">
              分摊比率: {{ scope.row.payDetailInfoList[index].shareRate }}%
              <br/>
              分摊金额: {{ scope.row.payDetailInfoList[index].shareAmount }}
            </template>
          </el-table-column>
        </template>

        <el-table-column label="付款日期" prop="payTime" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.payTime | dateFilter }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="160px">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row.payId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="pageChange" style="float:right;"
                     :page-size="payInfoSearchReq.pageSize" :total="total">
      </el-pagination>
    </el-col>

    <el-dialog title="新增" :visible.sync="addPayInfoFormVisible" :close-on-click-modal="false" width="700px">
      <el-form :model="addPayInfoForm" label-width="120px" :rules="addPayInfoFormRules" ref="addPayInfoForm">
        <el-form-item label="合同" prop="contractId">
          <el-select v-model="addPayInfoForm.contractId" filterable
                     placeholder="请选择" style="float:left"
                     v-on:change="contractChange(addPayInfoForm.contractId, true)">
            <el-option v-for="item in contractList" :key="item.contractId" :label="item.contractName"
                       :value="item.contractId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="付款对象" prop="payType" label-position="left">
          <el-radio-group v-model="addPayInfoForm.payType">
            <el-radio label="SUB_CONTRACTOR">分包</el-radio>
            <el-radio label="MIGRANT_WORKER">农民工</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="收款单位" prop="payee">
          <el-autocomplete v-model="addPayInfoForm.payee"
                           :fetch-suggestions="payeeFilter" placeholder="请输入内容">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="金额" prop="payAmount">
          <el-input type="number" step="0.01" v-model.number="addPayInfoForm.payAmount" auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="扣履约金" prop="performanceBoundAmount">
          <el-input type="number" step="0.01" v-model.number="addPayInfoForm.performanceBoundAmount"
                    auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="付款日期" prop="payTime">
          <el-date-picker v-model="addPayInfoForm.payTime" type="date" style="float:left">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addPayInfoForm.remark" auto-complete="off" maxlength="30"
                    show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item v-for="(payDetail, index) in addPayInfoForm.payDetailInfoList" :key="payDetail.key"
                      :label="payDetail.subContractorName" :prop="'payDetailInfoList.' + index + '.shareRate'"
                      :rules="addPayInfoFormRules.payDetailInfoList.shareRate">
          <el-input type="number" step="0.01" v-model.number="payDetail.shareRate" placeholder="请输入分摊比率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addPayInfoFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addPayInfoFormSubmit('addPayInfoForm')">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="editPayInfoFormVisible" :close-on-click-modal="false" width="700px">
      <el-form :model="editPayInfoForm" label-width="120px" :rules="addPayInfoFormRules"
               ref="editPayInfoForm">
        <el-form-item label="合同" prop="contractId">
          <el-select v-model="editPayInfoForm.contractId" filterable placeholder="请选择" style="float:left"
                     v-on:change="contractChange(editPayInfoForm.contractId, true)">
            <el-option v-for="item in contractList" :key="item.contractId" :label="item.contractName"
                       :value="item.contractId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="付款对象" prop="payType" label-position="left">
          <el-radio-group v-model="editPayInfoForm.payType">
            <el-radio label="SUB_CONTRACTOR">分包</el-radio>
            <el-radio label="MIGRANT_WORKER">农民工</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="收款单位" prop="payee">
          <el-autocomplete class="inline-input" v-model="editPayInfoForm.payee" :fetch-suggestions="payeeFilter"
                           placeholder="请输入内容">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="金额" prop="payAmount">
          <el-input type="number" step="0.01" v-model.number="editPayInfoForm.payAmount"
                    auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="扣履约金" prop="performanceBoundAmount">
          <el-input type="number" step="0.01" v-model.number="editPayInfoForm.performanceBoundAmount"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="付款日期" prop="payTime">
          <el-date-picker v-model="editPayInfoForm.payTime" type="date" style="float:left">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="editPayInfoForm.remark" auto-complete="off"
                    maxlength="30" show-word-limit></el-input>
        </el-form-item>

        <el-form-item v-for="(payDetail, index) in editPayInfoForm.payDetailInfoList"
                      :key="payDetail.key" :label="payDetail.subContractorName"
                      :prop="'payDetailInfoList.' + index + '.shareRate'"
                      :rules="addPayInfoFormRules.payDetailInfoList.shareRate">
          <el-input type="number" step="0.01" v-model.number="payDetail.shareRate" placeholder="请输入分摊比率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editPayInfoFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editPayInfoFormSubmit('editPayInfoForm')">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'payInfoManage',
    data () {
      let shareRateValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入分摊比率'))
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

      let moneyValidator = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('金额不能小于0'))
          return
        }
        if (!new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$').test(value)) {
          callback(new Error('小数点后至多2位'))
          return
        }
        callback()
      }

      return {
        total: 0,

        sumMap: null,

        payeeSuggestList: [],

        subContractorList: [],
        contractList: [],
        payInfoList: [],
        payInfoSearchReq: {
          contractNum: null,
          payee: null,
          subContractorId: null,
          payStartTime: null,
          payEndTime: null,
          payType: 'SUB_CONTRACTOR',
          pageIndex: 0,
          pageSize: 15
        },
        addPayInfoFormVisible: false,
        addPayInfoForm: {
          contractId: null,
          payType: 'SUB_CONTRACTOR',
          payee: null,
          remark: null,
          payTime: null,
          payAmount: 0,
          performanceBoundAmount: 0,
          payDetailInfoList: []
        },

        editPayInfoFormVisible: false,
        editPayInfoForm: {
          payId: null,
          payType: 'SUB_CONTRACTOR',
          contractId: null,
          payee: null,
          remark: null,
          payTime: null,
          payAmount: 0,
          performanceBoundAmount: 0,
          payDetailInfoList: [
            {
              subContractorId: null,
              subContractorName: null,
              shareRate: null,
              shareAmount: null
            }
          ]
        },

        addPayInfoFormRules: {
          contractId: [
            {required: true, message: '请选择合同', trigger: 'change'}
          ],
          payType: [
            {required: true, message: '请选择付款对象', trigger: 'change'}
          ],
          payee: [
            {required: true, message: '请填写收款单位', trigger: 'change'},
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'change'
            }
          ],
          payTime: [
            {required: true, message: '请填写付款日期', trigger: 'change'}
          ],
          payAmount: [
            {required: true, message: '请填写付款金额', trigger: 'change'},
            {validator: moneyValidator, trigger: 'change'}
          ],
          performanceBoundAmount: [
            {required: true, message: '请填写扣履约金', trigger: 'change'},
            {validator: moneyValidator, trigger: 'change'}
          ],
          payDetailInfoList: {
            taxRate: [{validator: shareRateValidator, trigger: 'change'}]
          }
        }
      }
    },
    created () {
      this.getSubContractorList()
      this.getContractList()
      this.getPayInfoList()
      this.getPayeeSuggest()
    },
    methods: {
      getContractList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/contract/listAll'
        }).then(response => {
          this.contractList = response.result
        })
      },
      getSubContractorList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/subContractor/listAll'
        }).then(response => {
          this.subContractorList = response.result
        })
      },
      getPayInfoList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/payInfo/list',
          data: this.payInfoSearchReq
        }).then(response => {
          this.payInfoList = response.result.list
          this.total = response.result.total
          this.sumMap = response.result.sumMap
        })
      },
      searchList: function () {
        this.payInfoSearchReq.pageIndex = 0
        this.getPayInfoList()
      },
      pageChange: function (pageIndex) {
        this.payInfoSearchReq.pageIndex = pageIndex
        this.getPayInfoList()
      },
      handleAdd: function () {
        this.addPayInfoFormVisible = true
        this.addPayInfoForm.contractId = null
        this.addPayInfoForm.payType = 'SUB_CONTRACTOR'
        this.addPayInfoForm.payee = null
        this.addPayInfoForm.remark = null
        this.addPayInfoForm.payTime = null
        this.addPayInfoForm.payAmount = 0
        this.addPayInfoForm.performanceBoundAmount = 0
        this.addPayInfoForm.payDetailInfoList = []
      },
      handleEdit: function (payInfo) {
        this.editPayInfoFormVisible = true
        this.editPayInfoForm.payId = null
        this.editPayInfoForm.contractId = null
        this.editPayInfoForm.payType = 'SUB_CONTRACTOR'
        this.editPayInfoForm.payee = null
        this.editPayInfoForm.remark = null
        this.editPayInfoForm.payTime = null
        this.editPayInfoForm.payAmount = 0
        this.editPayInfoForm.performanceBoundAmount = 0
        this.editPayInfoForm.payDetailInfoList = []
        this.editPayInfoForm = this.deepCopy(payInfo)
      },
      handleDel: function (payId) {
        if (!confirm('确认删除?')) {
          return
        }

        this.doRequest({
          method: 'post',
          url: this.HOST + '/payInfo/delete',
          data: {
            payId: payId
          }
        }).then(response => {
          alert('删除成功')
          this.getPayInfoList()
        })
      },
      addPayInfoFormSubmit: function (addPayInfoForm) {
        this.$refs[addPayInfoForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/payInfo/add',
              data: this.addPayInfoForm
            }).then(response => {
              this.getPayInfoList()
              this.addPayInfoFormVisible = false
              alert('添加成功')
            })
          }
        })
      },
      editPayInfoFormSubmit: function (editPayInfoForm) {
        this.$refs[editPayInfoForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/payInfo/edit',
              data: this.editPayInfoForm
            }).then(response => {
              this.getPayInfoList()
              this.editPayInfoFormVisible = false
              alert('修改成功')
            })
          }
        })
      },
      contractChange: function (contractId, isAdd) {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/subContractor/getSubContractorWithShareRate',
          data: {
            contractId: contractId
          }
        }).then(response => {
          (isAdd ? this.addPayInfoForm : this.editPayInfoForm).payDetailInfoList = [];
          (isAdd ? this.addPayInfoForm : this.editPayInfoForm).payDetailInfoList = response.result
        })
      },
      getPayeeSuggest: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/payInfo/listAllPayee'
        }).then(response => {
          this.payeeSuggestList = []
          response.result.forEach(payee => {
            this.payeeSuggestList.push({value: payee})
          })
        })
      },
      payeeFilter (queryString, cb) {
        const payeeSuggestList = this.payeeSuggestList
        const results = queryString ? payeeSuggestList.filter(this.createFilter(queryString)) : payeeSuggestList
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return payeeSuggestList => {
          return (payeeSuggestList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      getSummaries (param) {
        let sum = []
        sum[0] = '合计'
        sum[1] = null
        sum[2] = this.sumMap ? this.sumMap['shareAmount'] : null
        sum[3] = this.sumMap ? this.sumMap['performanceBoundAmount'] : null
        sum[4] = null
        sum[5] = null
        sum[6] = this.sumMap ? this.sumMap['subContractor1'] : null
        sum[7] = this.sumMap ? this.sumMap['subContractor2'] : null
        sum[8] = this.sumMap ? this.sumMap['subContractor3'] : null
        sum[9] = this.sumMap ? this.sumMap['subContractor4'] : null
        sum[10] = this.sumMap ? this.sumMap['subContractor5'] : null
        sum[11] = this.sumMap ? this.sumMap['subContractor6'] : null
        sum[12] = this.sumMap ? this.sumMap['subContractor7'] : null
        sum[13] = null
        return sum
      }
    }
  }
</script>
<style></style>
