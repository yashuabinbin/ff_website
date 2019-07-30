<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" style="float: left;">
        <el-form-item>
          <el-input placeholder="合同号" v-model="invoiceInfoSearchReq.contractNum" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-select v-model="invoiceInfoSearchReq.subContractorId" placeholder="请选择分包" clearable>
            <el-option v-for="item in subContractorList" :key="item.subContractorId"
                       :label="item.subContractorName" :value="item.subContractorId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker type="date" v-model="invoiceInfoSearchReq.invoiceStartTime"
                          placeholder="开票开始日期" width="150">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker type="date" v-model="invoiceInfoSearchReq.invoiceEndTime"
                          placeholder="开票结束日期" width="150">
          </el-date-picker>
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
      <el-table :data="invoiceList" stripe show-summary :summary-method="getSummaries" scope="scope"
                style="width: 100%">
        <el-table-column prop="contractNum" label="合同号" width="150px">
        </el-table-column>

        <el-table-column prop="invoiceContent" label="发票内容" width="150px">
        </el-table-column>

        <el-table-column prop="invoiceTime" label="开票日期" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.invoiceTime | dateFilter }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="beforeTaxAmount" label="含税金额" width="120px">
        </el-table-column>

        <el-table-column prop="taxRate" label="税点" width="100px"></el-table-column>

        <el-table-column prop="deductAmount" label="抵扣额" width="120px"></el-table-column>

        <template v-for="(subContractor, index) in subContractorList">
          <el-table-column prop="invoiceDetailInfoList" :label="subContractor.subContractorName"
                           v-bind:key="subContractor.subContractorId" width="200px">
            <template slot-scope="scope">
              分摊比率: {{ scope.row.invoiceDetailInfoList[index].shareRate }}%
              <br/>
              分摊金额: {{ scope.row.invoiceDetailInfoList[index].shareAmount }}
            </template>
          </el-table-column>
        </template>

        <el-table-column prop="remark" label="备注" width="150px"></el-table-column>

        <el-table-column label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row.invoiceId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="pageChange" style="float:right;"
                     :page-size="invoiceInfoSearchReq.pageSize" :total="total">
      </el-pagination>
    </el-col>

    <el-dialog title="新增" :visible.sync="addInvoiceInfoFormVisible" :close-on-click-modal="false" width="700px">
      <el-form :model="addInvoiceInfoForm" label-width="120px" :rules="addInvoiceInfoFormRules"
               ref="addInvoiceInfoForm">
        <el-form-item label="合同" prop="contractId">
          <el-select v-model="addInvoiceInfoForm.contractId" filterable placeholder="请选择"
                     v-on:change="contractChange(addInvoiceInfoForm.contractId, true)">
            <el-option v-for="item in contractList" :key="item.contractId"
                       :label="item.contractName" :value="item.contractId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发票内容" prop="invoiceContent">
          <el-autocomplete class="inline-input" v-model="addInvoiceInfoForm.invoiceContent"
                           :fetch-suggestions="invoiceContentFilter" placeholder="请输入内容">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="开票日期" prop="invoiceTime">
          <el-date-picker v-model="addInvoiceInfoForm.invoiceTime" type="date">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="含税金额" prop="beforeTaxAmount">
          <el-input type="number" step="0.01" v-model.number="addInvoiceInfoForm.beforeTaxAmount" auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="税点" prop="taxRate">
          <el-input type="number" step="0.01" v-model.number="addInvoiceInfoForm.taxRate" auto-complete="off">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addInvoiceInfoForm.remark" auto-complete="off" maxlength="30"
                    show-word-limit></el-input>
        </el-form-item>

        <el-row :span="24">
          <el-col :span="12" v-for="(invoiceDetail, index) in addInvoiceInfoForm.invoiceDetailInfoList"
                  :key="invoiceDetail.key">
            <el-form-item :label="invoiceDetail.subContractorName"
                          :prop="'invoiceDetailInfoList.' + index + '.shareRate'"
                          :rules="addInvoiceInfoFormRules.invoiceDetailInfoList.shareRate">
              <el-input type="number" step="0.01" v-model.number="invoiceDetail.shareRate" placeholder="请输入分摊比率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addInvoiceInfoFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addInvoiceInfoFormSubmit('addInvoiceInfoForm')">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="editInvoiceInfoFormVisible" :close-on-click-modal="false" width="700px">
      <el-form :model="editInvoiceInfoForm" label-width="120px" :rules="addInvoiceInfoFormRules"
               ref="editInvoiceInfoForm">
        <el-form-item label="合同" prop="contractId">
          <el-select v-model="editInvoiceInfoForm.contractId" filterable placeholder="请选择"
                     v-on:change="contractChange(editInvoiceInfoForm.contractId, true)">
            <el-option v-for="item in contractList" :key="item.contractId"
                       :label="item.contractName" :value="item.contractId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发票内容" prop="invoiceContent">
          <el-autocomplete class="inline-input" v-model="editInvoiceInfoForm.invoiceContent"
                           :fetch-suggestions="invoiceContentFilter" placeholder="请输入内容">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="开票日期" prop="invoiceTime">
          <el-date-picker v-model="editInvoiceInfoForm.invoiceTime" type="date">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="含税金额" prop="beforeTaxAmount">
          <el-input type="number" step="0.01" v-model.number="editInvoiceInfoForm.beforeTaxAmount" auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="税点" prop="taxRate">
          <el-input type="number" step="0.01" v-model.number="editInvoiceInfoForm.taxRate" auto-complete="off">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="editInvoiceInfoForm.remark" auto-complete="off" maxlength="30"
                    show-word-limit></el-input>
        </el-form-item>

        <el-row :span="24">
          <el-col :span="12" v-for="(invoiceDetail, index) in editInvoiceInfoForm.invoiceDetailInfoList"
                  :key="invoiceDetail.key">
            <el-form-item :label="invoiceDetail.subContractorName"
                          :prop="'invoiceDetailInfoList.' + index + '.shareRate'"
                          :rules="addInvoiceInfoFormRules.invoiceDetailInfoList.shareRate">
              <el-input type="number" step="0.01" v-model.number="invoiceDetail.shareRate" placeholder="请输入分摊比率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editInvoiceInfoFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editInvoiceInfoFormSubmit('editInvoiceInfoForm')">提交
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'invoiceManage',
    data () {
      let shareRateValidator = (rule, value, callback) => {
        if (value === null || value === undefined) {
          callback(new Error('请输入比率'))
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

        invoiceContentSuggestList: [],

        subContractorList: [],
        contractList: [],
        invoiceList: [],
        invoiceInfoSearchReq: {
          contractNum: null,
          subContractorId: null,
          invoiceStartTime: null,
          invoiceEndTime: null,
          pageIndex: 0,
          pageSize: 15
        },
        addInvoiceInfoFormVisible: false,
        addInvoiceInfoForm: {
          contractId: null,
          invoiceContent: null,
          remark: null,
          invoiceTime: null,
          beforeTaxAmount: 0,
          taxRate: 0,
          invoiceDetailInfoList: []
        },

        editInvoiceInfoFormVisible: false,
        editInvoiceInfoForm: {
          invoiceId: null,
          contractId: null,
          invoiceContent: null,
          remark: null,
          invoiceTime: null,
          beforeTaxAmount: 0,
          taxRate: 0,
          invoiceDetailInfoList: [
            {
              subContractorId: null,
              subContractorName: null,
              shareRate: null,
              shareAmount: null
            }
          ]
        },

        addInvoiceInfoFormRules: {
          contractId: [
            {required: true, message: '请选择合同', trigger: 'change'}
          ],
          invoiceContent: [
            {required: true, message: '请填写发票内容', trigger: 'change'},
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'change'
            }
          ],
          invoiceTime: [
            {required: true, message: '请填写开票日期', trigger: 'change'}
          ],
          beforeTaxAmount: [
            {required: true, message: '请填写含税款金额', trigger: 'change'},
            {validator: moneyValidator, trigger: 'change'}
          ],
          shareRate: [
            {required: true, message: '请填写税点', trigger: 'change'},
            {validator: shareRateValidator, trigger: 'change'}
          ],
          shareAmount: [
            {required: true, message: '请填写抵扣额', trigger: 'change'},
            {validator: moneyValidator, trigger: 'change'}
          ],
          invoiceDetailInfoList: {
            shareRate: [{validator: shareRateValidator, trigger: 'change'}]
          }
        }
      }
    },
    created () {
      this.getSubContractorList()
      this.getContractList()
      this.getInvoiceInfoList()
      this.getInvoiceContentSuggest()
    },
    methods: {
      getContractList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/contract/listAll',
          headers: {
            Authorization: localStorage.getItem('TOKEN')
          }
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
      getInvoiceInfoList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/invoiceInfo/list',
          data: this.invoiceInfoSearchReq
        }).then(response => {
          this.invoiceList = response.result.list
          this.total = response.result.total
          this.sumMap = response.result.sumMap
        })
      },
      searchList: function () {
        this.invoiceInfoSearchReq.pageIndex = 0
        this.getInvoiceInfoList()
      },
      pageChange: function (pageIndex) {
        this.invoiceInfoSearchReq.pageIndex = pageIndex
        this.getInvoiceInfoList()
      },
      handleAdd: function () {
        this.addInvoiceInfoFormVisible = true

        this.addInvoiceInfoForm.contractId = null
        this.addInvoiceInfoForm.invoiceContent = null
        this.addInvoiceInfoForm.remark = null
        this.addInvoiceInfoForm.invoiceTime = null
        this.addInvoiceInfoForm.beforeTaxAmount = 0
        this.addInvoiceInfoForm.taxRate = 0
        this.addInvoiceInfoForm.invoiceDetailInfoList = []
      },
      handleEdit: function (invoiceInfo) {
        this.editInvoiceInfoFormVisible = true
        this.editInvoiceInfoForm.invoiceId = null
        this.editInvoiceInfoForm.contractId = null
        this.editInvoiceInfoForm.invoiceContent = null
        this.editInvoiceInfoForm.remark = null
        this.editInvoiceInfoForm.invoiceTime = null
        this.editInvoiceInfoForm.beforeTaxAmount = 0
        this.editInvoiceInfoForm.taxRate = 0
        this.editInvoiceInfoForm.invoiceDetailInfoList = []
        this.editInvoiceInfoForm = this.deepCopy(invoiceInfo)
      },
      handleDel: function (invoiceId) {
        if (!confirm('确认删除?')) {
          return
        }

        this.doRequest({
          method: 'post',
          url: this.HOST + '/invoiceInfo/delete',
          data: {
            invoiceId: invoiceId
          }
        }).then(response => {
          alert('删除成功')
          this.getInvoiceInfoList()
        })
      },
      addInvoiceInfoFormSubmit: function (addInvoiceInfoForm) {
        this.$refs[addInvoiceInfoForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/invoiceInfo/add',
              data: this.addInvoiceInfoForm
            }).then(response => {
              this.getInvoiceInfoList()
              this.addInvoiceInfoFormVisible = false
              alert('添加成功')
            })
          }
        })
      },
      editInvoiceInfoFormSubmit: function (editInvoiceInfoForm) {
        this.$refs[editInvoiceInfoForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/invoiceInfo/edit',
              data: this.editInvoiceInfoForm
            }).then(response => {
              this.getInvoiceInfoList()
              this.editInvoiceInfoFormVisible = false
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
          (isAdd ? this.addInvoiceInfoForm : this.editInvoiceInfoForm).invoiceDetailInfoList = [];
          (isAdd ? this.addInvoiceInfoForm : this.editInvoiceInfoForm).invoiceDetailInfoList = response.result
        })
      },

      getInvoiceContentSuggest: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/invoiceInfo/listAllInvoiceContent'
        }).then(response => {
          this.invoiceContentSuggestList = []
          response.result.forEach(invoiceContent => {
            this.invoiceContentSuggestList.push({value: invoiceContent})
          })
        })
      },
      invoiceContentFilter (queryString, cb) {
        const invoiceContentSuggestList = this.invoiceContentSuggestList
        const results = queryString
          ? invoiceContentSuggestList.filter(this.createFilter(queryString))
          : invoiceContentSuggestList
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return invoiceContentSuggestList => {
          return (invoiceContentSuggestList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      getSummaries (param) {
        let sum = []
        sum[0] = '合计'
        sum[1] = null
        sum[2] = null
        sum[3] = this.sumMap ? this.sumMap['beforeTaxAmount'] : null
        sum[4] = null
        sum[5] = this.sumMap ? this.sumMap['deductAmount'] : null
        sum[6] = this.sumMap ? this.sumMap['subContractor1'] : null
        sum[7] = this.sumMap ? this.sumMap['subContractor2'] : null
        sum[8] = this.sumMap ? this.sumMap['subContractor3'] : null
        sum[9] = this.sumMap ? this.sumMap['subContractor4'] : null
        sum[10] = this.sumMap ? this.sumMap['subContractor5'] : null
        sum[11] = this.sumMap ? this.sumMap['subContractor6'] : null
        sum[12] = this.sumMap ? this.sumMap['subContractor7'] : null
        sum[13] = null
        sum[14] = null
        return sum
      }
    }
  }
</script>
