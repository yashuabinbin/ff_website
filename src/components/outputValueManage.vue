<!--<template>-->
  <!--<section>-->
    <!--&lt;!&ndash;工具条&ndash;&gt;-->
    <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
      <!--<el-form :inline="true" style="float: left;">-->
        <!--<el-form-item>-->
          <!--<el-date-picker type="date" v-model="outputValueSearchReq.outputStartTime"-->
                          <!--placeholder="产值开始日期" width="150">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
          <!--<el-date-picker type="date" v-model="outputValueSearchReq.outputEndTime"-->
                          <!--placeholder="产值结束日期" width="150">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="searchList()">查询</el-button>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="handleAdd()">新增</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</el-col>-->

    <!--<el-col :span="24" class="toolbar">-->
      <!--&lt;!&ndash;列表&ndash;&gt;-->
      <!--<el-table :data="outputValueList" stripe show-summary :summary-method="getSummaries" slot-scope="scope"-->
                <!--style="width: 100%">-->
        <!--<el-table-column prop="outputValueAmount" label="产值" width="150px">-->
        <!--</el-table-column>-->

        <!--<el-table-column prop="migrantWorkerAmount" label="农民工工资" width="150px">-->
        <!--</el-table-column>-->

        <!--<el-table-column prop="outputTime" label="产值日期" width="100px">-->
          <!--<span>{{ scope.row.outputTime | dateFilter }}</span>-->
        <!--</el-table-column>-->

        <!--<template v-for="(subContractor, index) in subContractorList">-->
          <!--<el-table-column prop="outputValueDetailList" :label="subContractor.subContractorName"-->
                           <!--v-bind:key="subContractor.subContractorId" width="200px">-->
            <!--产值: {{ scope.row.outputValueDetailList[index].outputValueAmount }}-->
            <!--<br/>-->
            <!--农民工工资: {{ scope.row.outputValueDetailList[index].migrantWorkerAmount }}-->
          <!--</el-table-column>-->
        <!--</template>-->

        <!--<el-table-column prop="remark" label="备注" width="150px"></el-table-column>-->

        <!--<el-table-column label="操作" width="150px" fixed="right">-->
          <!--<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>-->
          <!--<el-button type="danger" size="small" @click="handleDel(scope.row.outputValueId)">删除</el-button>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    <!--</el-col>-->

    <!--&lt;!&ndash;工具条&ndash;&gt;-->
    <!--<el-col :span="24" class="toolbar">-->
      <!--<el-pagination layout="prev, pager, next" @current-change="pageChange" style="float:right;"-->
                     <!--:page-size="outputValueSearchReq.pageSize" :total="total">-->
      <!--</el-pagination>-->
    <!--</el-col>-->

    <!--<el-dialog title="新增" :visible.sync="addOutputValueFormVisible" :close-on-click-modal="false" width="700px">-->
      <!--<el-form :model="addOutputValueForm" label-width="120px" :rules="addOutputValueFormRules"-->
               <!--ref="addOutputValueForm">-->
        <!--<el-row :span="24">-->
          <!--<el-col :span="12">-->
            <!--<el-form-item label="产值" prop="outputValueAmount">-->
              <!--<el-input type="number" step="0.01" v-model.number="addOutputValueForm.outputValueAmount"-->
                        <!--auto-complete="off">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <!--<el-col :span="12">-->
            <!--<el-form-item label="农民工工资" prop="outputValueAmount">-->
              <!--<el-input type="number" step="0.01" v-model.number="addOutputValueForm.migrantWorkerAmount"-->
                        <!--auto-complete="off">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<el-row :span="24">-->
          <!--<el-col :span="12" v-for="(outputValueDetail) in addOutputValueForm.outputValueDetailList"-->
                  <!--:key="outputValueDetail.outputValueId">-->
            <!--<el-form-item :label="outputValueDetail.subContractorName">-->
              <!--<el-input type="number" step="0.01" v-model.number="outputValueDetail.outputValueAmount" placeholder="请输入产值">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<el-row :span="24">-->
          <!--<el-col :span="12" v-for="(outputValueDetail, index) in addOutputValueForm.migrantWorkerList"-->
                  <!--:key="outputValueDetail.relationId">-->
            <!--<el-form-item :label="outputValueDetail.subContractorName"-->
                          <!--:prop="'outputValueDetail.' + index + '.outputValueAmount'"-->
                          <!--:rules="addOutputValueFormRules.outputValueDetailList.outputValueAmount">-->
              <!--<span>-->
                <!--{{invoiceDetail.outputValueAmount}}-->
              <!--</span>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<el-form-item label="产值日期" prop="outputValueTime">-->
          <!--<el-date-picker v-model="addOutputValueForm.outputValueTime" type="date">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="备注" prop="remark">-->
          <!--<el-input type="textarea" v-model="addOutputValueForm.remark" auto-complete="off" maxlength="30"-->
                    <!--show-word-limit></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="addOutputValueFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="addOutputValueFormSubmit('addOutputValueForm')">提交</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!--&lt;!&ndash;<el-dialog title="修改" :visible.sync="editoutputValueFormVisible" :close-on-click-modal="false" width="700px">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-form :model="editoutputValueForm" label-width="120px" :rules="addOutputValueFormRules"&ndash;&gt;-->
    <!--&lt;!&ndash;ref="editoutputValueForm">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-form-item label="合同" prop="contractId">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-select v-model="editoutputValueForm.contractId" filterable placeholder="请选择"&ndash;&gt;-->
    <!--&lt;!&ndash;v-on:change="contractChange(editoutputValueForm.contractId, true)">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option v-for="item in contractList" :key="item.contractId"&ndash;&gt;-->
    <!--&lt;!&ndash;:label="item.contractName" :value="item.contractId">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--&lt;!&ndash;<el-form-item label="发票内容" prop="invoiceContent">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-autocomplete class="inline-input" v-model="editoutputValueForm.invoiceContent"&ndash;&gt;-->
    <!--&lt;!&ndash;:fetch-suggestions="invoiceContentFilter" placeholder="请输入内容">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-autocomplete>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--&lt;!&ndash;<el-form-item label="开票日期" prop="invoiceTime">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-date-picker v-model="editoutputValueForm.invoiceTime" type="date">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-date-picker>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--&lt;!&ndash;<el-form-item label="含税金额" prop="beforeTaxAmount">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-input type="number" step="0.01" v-model.number="editoutputValueForm.beforeTaxAmount" auto-complete="off">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-input>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--&lt;!&ndash;<el-form-item label="税点" prop="taxRate">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-input type="number" step="0.01" v-model.number="editoutputValueForm.taxRate" auto-complete="off">&ndash;&gt;-->
    <!--&lt;!&ndash;<template slot="append">%</template>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-input>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--&lt;!&ndash;<el-form-item label="备注" prop="remark">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-input type="textarea" v-model="editoutputValueForm.remark" auto-complete="off" maxlength="30"&ndash;&gt;-->
    <!--&lt;!&ndash;show-word-limit></el-input>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--&lt;!&ndash;<el-row :span="24">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-col :span="12" v-for="(invoiceDetail, index) in editoutputValueForm.invoiceDetailInfoList"&ndash;&gt;-->
    <!--&lt;!&ndash;:key="invoiceDetail.key">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-form-item :label="invoiceDetail.subContractorName"&ndash;&gt;-->
    <!--&lt;!&ndash;:prop="'invoiceDetailInfoList.' + index + '.shareRate'"&ndash;&gt;-->
    <!--&lt;!&ndash;:rules="addOutputValueFormRules.invoiceDetailInfoList.shareRate">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-input type="number" step="0.01" v-model.number="invoiceDetail.shareRate" placeholder="请输入分摊比率">&ndash;&gt;-->
    <!--&lt;!&ndash;<template slot="append">%</template>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-input>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-row>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form>&ndash;&gt;-->

    <!--&lt;!&ndash;<div slot="footer" class="dialog-footer">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-button @click.native="editoutputValueFormVisible = false">取消</el-button>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-button type="primary" @click.native="editoutputValueFormSubmit('editoutputValueForm')">提交&ndash;&gt;-->
    <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-dialog>&ndash;&gt;-->
  <!--</section>-->
<!--</template>-->

<!--<script>-->
  <!--export default {-->
    <!--name: 'invoiceManage',-->
    <!--data () {-->
      <!--let shareRateValidator = (rule, value, callback) => {-->
        <!--if (value === null || value === undefined) {-->
          <!--callback(new Error('请输入比率'))-->
          <!--return-->
        <!--}-->
        <!--if (value < 0 || value > 100) {-->
          <!--callback(new Error('数值范围0-100，小数点后至多2位'))-->
          <!--return-->
        <!--}-->

        <!--if (!new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$').test(value)) {-->
          <!--callback(new Error('数值范围0-100，小数点后至多2位'))-->
          <!--return-->
        <!--}-->
        <!--callback()-->
      <!--}-->

      <!--let moneyValidator = (rule, value, callback) => {-->
        <!--if (value < 0) {-->
          <!--callback(new Error('金额不能小于0'))-->
          <!--return-->
        <!--}-->
        <!--if (!new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$').test(value)) {-->
          <!--callback(new Error('小数点后至多2位'))-->
          <!--return-->
        <!--}-->
        <!--callback()-->
      <!--}-->

      <!--return {-->
        <!--total: 0,-->
        <!--sumMap: null,-->

        <!--subContractorList: [],-->
        <!--outputValueDetailList: [],-->
        <!--outputValueSearchReq: {-->
          <!--outputValueStartTime: null,-->
          <!--outputValueEndTime: null,-->
          <!--pageIndex: 0,-->
          <!--pageSize: 15-->
        <!--},-->
        <!--addOutputValueFormVisible: false,-->
        <!--addOutputValueForm: {-->
          <!--outputValueAmount: 0,-->
          <!--remark: null,-->
          <!--outputTime: null,-->
          <!--migrantWorkerAmount: 0,-->
          <!--outputValueDetailList: []-->
        <!--},-->

        <!--editoutputValueFormVisible: false,-->
        <!--editoutputValueForm: {-->
          <!--outputValueId: null,-->
          <!--outputValueAmount: 0,-->
          <!--remark: null,-->
          <!--outputTime: null,-->
          <!--migrantWorkerAmount: 0,-->
          <!--outputValueDetailList: []-->
        <!--},-->

        <!--addOutputValueFormRules: {-->
          <!--// contractId: [-->
          <!--//   {required: true, message: '请选择合同', trigger: 'change'}-->
          <!--// ],-->
          <!--// invoiceContent: [-->
          <!--//   {required: true, message: '请填写发票内容', trigger: 'change'},-->
          <!--//   {-->
          <!--//     min: 2,-->
          <!--//     max: 20,-->
          <!--//     message: '长度在 2 到 20 个字符',-->
          <!--//     trigger: 'change'-->
          <!--//   }-->
          <!--// ],-->
          <!--// invoiceTime: [-->
          <!--//   {required: true, message: '请填写开票日期', trigger: 'change'}-->
          <!--// ],-->
          <!--// beforeTaxAmount: [-->
          <!--//   {required: true, message: '请填写含税款金额', trigger: 'change'},-->
          <!--//   {validator: moneyValidator, trigger: 'change'}-->
          <!--// ],-->
          <!--// shareRate: [-->
          <!--//   {required: true, message: '请填写税点', trigger: 'change'},-->
          <!--//   {validator: shareRateValidator, trigger: 'change'}-->
          <!--// ],-->
          <!--// shareAmount: [-->
          <!--//   {required: true, message: '请填写抵扣额', trigger: 'change'},-->
          <!--//   {validator: moneyValidator, trigger: 'change'}-->
          <!--// ],-->
          <!--// invoiceDetailInfoList: {-->
          <!--//   shareRate: [{validator: shareRateValidator, trigger: 'change'}]-->
          <!--// }-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--created () {-->
      <!--this.getSubContractorList()-->
      <!--this.getOutputValueList()-->
    <!--},-->
    <!--methods: {-->
      <!--getSubContractorList: function () {-->
        <!--this.doRequest({-->
          <!--method: 'post',-->
          <!--url: this.HOST + '/subContractor/listAll'-->
        <!--}).then(response => {-->
          <!--this.subContractorList = response.result-->
        <!--})-->
      <!--},-->
      <!--getOutputValueList: function () {-->
        <!--this.doRequest({-->
          <!--method: 'post',-->
          <!--url: this.HOST + '/outputValue/list',-->
          <!--data: this.outputValueSearchReq-->
        <!--}).then(response => {-->
          <!--this.invoiceList = response.result.list-->
          <!--this.total = response.result.total-->
          <!--this.sumMap = response.result.sumMap-->
        <!--})-->
      <!--},-->
      <!--searchList: function () {-->
        <!--this.outputValueSearchReq.pageIndex = 0-->
        <!--this.getOutputValueList()-->
      <!--},-->
      <!--pageChange: function (pageIndex) {-->
        <!--this.outputValueSearchReq.pageIndex = pageIndex-->
        <!--this.getOutputValueList()-->
      <!--},-->
      <!--handleAdd: function () {-->
        <!--this.addOutputValueFormVisible = true-->

        <!--this.addOutputValueForm.contractId = null-->
        <!--this.addOutputValueForm.invoiceContent = null-->
        <!--this.addOutputValueForm.remark = null-->
        <!--this.addOutputValueForm.invoiceTime = null-->
        <!--this.addOutputValueForm.beforeTaxAmount = 0-->
        <!--this.addOutputValueForm.taxRate = 0-->
        <!--this.addOutputValueForm.outputValueDetailList = []-->

        <!--this.subContractorList.forEach(subContractor => {-->
          <!--this.addOutputValueForm.outputValueDetailList.push({-->
            <!--subContractorName: subContractor.subContractorName-->
          <!--})-->
        <!--})-->
        <!--console.info( this.addOutputValueForm.outputValueDetailList)-->
      <!--},-->
      <!--handleEdit: function (outputValue) {-->
        <!--this.editoutputValueFormVisible = true-->
        <!--this.editoutputValueForm.invoiceId = null-->
        <!--this.editoutputValueForm.contractId = null-->
        <!--this.editoutputValueForm.invoiceContent = null-->
        <!--this.editoutputValueForm.remark = null-->
        <!--this.editoutputValueForm.invoiceTime = null-->
        <!--this.editoutputValueForm.beforeTaxAmount = 0-->
        <!--this.editoutputValueForm.taxRate = 0-->
        <!--this.editoutputValueForm.outputValueDetailList = []-->
        <!--this.editoutputValueForm = this.deepCopy(outputValue)-->
      <!--},-->
      <!--handleDel: function (invoiceId) {-->
        <!--if (!confirm('确认删除?')) {-->
          <!--return-->
        <!--}-->

        <!--this.doRequest({-->
          <!--method: 'post',-->
          <!--url: this.HOST + '/outputValue/delete',-->
          <!--data: {-->
            <!--invoiceId: invoiceId-->
          <!--}-->
        <!--}).then(response => {-->
          <!--alert('删除成功')-->
          <!--this.getOutputValueList()-->
        <!--})-->
      <!--},-->
      <!--addOutputValueFormSubmit: function (addOutputValueForm) {-->
        <!--this.$refs[addOutputValueForm].validate(valid => {-->
          <!--if (valid) {-->
            <!--this.doRequest({-->
              <!--method: 'post',-->
              <!--url: this.HOST + '/outputValue/add',-->
              <!--data: this.addOutputValueForm-->
            <!--}).then(response => {-->
              <!--this.getOutputValueList()-->
              <!--this.addOutputValueFormVisible = false-->
              <!--alert('添加成功')-->
            <!--})-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--editOutputValueFormSubmit: function (editoutputValueForm) {-->
        <!--this.$refs[editoutputValueForm].validate(valid => {-->
          <!--if (valid) {-->
            <!--this.doRequest({-->
              <!--method: 'post',-->
              <!--url: this.HOST + '/outputValue/edit',-->
              <!--data: this.editoutputValueForm-->
            <!--}).then(response => {-->
              <!--this.getOutputValueList()-->
              <!--this.editoutputValueFormVisible = false-->
              <!--alert('修改成功')-->
            <!--})-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--contractChange: function (contractId, isAdd) {-->
        <!--this.doRequest({-->
          <!--method: 'post',-->
          <!--url: this.HOST + '/subContractor/getSubContractorWithShareRate',-->
          <!--data: {-->
            <!--contractId: contractId-->
          <!--}-->
        <!--}).then(response => {-->
          <!--(isAdd ? this.addOutputValueForm : this.editoutputValueForm).invoiceDetailInfoList = [];-->
          <!--(isAdd ? this.addOutputValueForm : this.editoutputValueForm).invoiceDetailInfoList = response.result-->
        <!--})-->
      <!--},-->

      <!--invoiceContentFilter (queryString, cb) {-->
        <!--const invoiceContentSuggestList = this.invoiceContentSuggestList-->
        <!--const results = queryString-->
          <!--? invoiceContentSuggestList.filter(this.createFilter(queryString))-->
          <!--: invoiceContentSuggestList-->
        <!--// 调用 callback 返回建议列表的数据-->
        <!--cb(results)-->
      <!--},-->
      <!--createFilter (queryString) {-->
        <!--return invoiceContentSuggestList => {-->
          <!--return (invoiceContentSuggestList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)-->
        <!--}-->
      <!--},-->
      <!--getSummaries (param) {-->
        <!--let sum = []-->
        <!--sum[0] = '合计'-->
        <!--sum[1] = null-->
        <!--sum[2] = null-->
        <!--sum[3] = this.sumMap ? this.sumMap['beforeTaxAmount'] : null-->
        <!--sum[4] = null-->
        <!--sum[5] = this.sumMap ? this.sumMap['deductAmount'] : null-->
        <!--sum[6] = this.sumMap ? this.sumMap['subContractor1'] : null-->
        <!--sum[7] = this.sumMap ? this.sumMap['subContractor2'] : null-->
        <!--sum[8] = this.sumMap ? this.sumMap['subContractor3'] : null-->
        <!--sum[9] = this.sumMap ? this.sumMap['subContractor4'] : null-->
        <!--sum[10] = this.sumMap ? this.sumMap['subContractor5'] : null-->
        <!--sum[11] = this.sumMap ? this.sumMap['subContractor6'] : null-->
        <!--sum[12] = this.sumMap ? this.sumMap['subContractor7'] : null-->
        <!--sum[13] = null-->
        <!--sum[14] = null-->
        <!--return sum-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->
