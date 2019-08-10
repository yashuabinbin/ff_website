<template>
    <section>
        <!--工具条-->
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" style="float: left;">
                    <el-form-item>
                        <el-select v-model="outputValueSearchReq.outputTime" @change="getOutputValueList()"
                                   placeholder="请选择" clearable>
                            <el-option v-for="item in outputTimeList" :key="item" :label="'第' + item + '期'"
                                       :value="item"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleAdd()">新增</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleEdit()" :disabled="!outputValueSearchReq.outputTime">
                            修改
                        </el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="danger" @click="handleDel()" :disabled="!outputValueSearchReq.outputTime">删除
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-col :span="24" class="toolbar">
            <!--列表-->
            <el-table v-if="outputValue" border scope="scope"
                      :data="outputValue.difVoList"
                      style="width: 100%">
                <el-table-column prop="name" :label="sumName" width="120px">
                </el-table-column>
                <el-table-column :prop="'value' + (index+1)" v-for="(subContractor, index) in subContractorList"
                                 :label="subContractor.subContractorName"
                                 v-bind:key="subContractor.subContractorId">
                </el-table-column>
            </el-table>
        </el-col>

        <el-dialog title="新增" :visible.sync="addOutputValueFormVisible" :close-on-click-modal="false" width="700px">
            <el-form :model="addOutputValueForm" label-width="150px" :rules="addOutputValueFormRules"
                     ref="addOutputValueForm">
                <el-row :span="24">
                    <el-col :span="12">
                        <el-form-item label="期数" prop="outputTime" :rules="addOutputValueFormRules.outputTime">
                            <el-input type="number" v-model.number="addOutputValueForm.outputTime"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :span="24" v-for="(outputValueDetail, index) in addOutputValueForm.outputValueDetailList"
                        :key="outputValueDetail.subContractorId">
                    <el-col :span="12">
                        <el-form-item :label="outputValueDetail.subContractorName + ' 分部分项'"
                                      :prop="'outputValueDetailList.' + index + '.outputCategoryAmount'"
                                      :rules="addOutputValueFormRules.outputValueDetailList.outputCategoryAmount">
                            <el-input type="number" v-model.number="outputValueDetail.outputCategoryAmount"
                                      auto-complete="off">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="措施费"
                                      :prop="'outputValueDetailList.' + index + '.outputStepAmount'"
                                      :rules="addOutputValueFormRules.outputValueDetailList.outputStepAmount">
                            <el-input type="number" v-model.number="outputValueDetail.outputStepAmount"
                                      auto-complete="off">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addOutputValueFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addOutputValueFormSubmit('addOutputValueForm')">提交</el-button>
            </div>
        </el-dialog>


        <el-dialog title="修改" :visible.sync="editOutputValueFormVisible" :close-on-click-modal="false" width="700px">
            <el-form :model="editOutputValueForm" label-width="150px" :rules="addOutputValueFormRules"
                     ref="editOutputValueForm">
                <el-row :span="24">
                    <el-col :span="12">
                        <el-form-item label="期数" prop="outputTime" :rules="addOutputValueFormRules.outputTime">
                            <el-input type="number" disabled="true" v-model="editOutputValueForm.outputTime"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :span="24" v-for="(outputValueDetail, index) in editOutputValueForm.outputValueDetailList"
                        :key="outputValueDetail.subContractorId">
                    <el-col :span="12">
                        <el-form-item :label="outputValueDetail.subContractorName + ' 分部分项'"
                                      :prop="'outputValueDetailList.' + index + '.outputCategoryAmount'"
                                      :rules="addOutputValueFormRules.outputValueDetailList.outputCategoryAmount">
                            <el-input type="number" v-model.number="outputValueDetail.outputCategoryAmount"
                                      auto-complete="off">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="措施费"
                                      :prop="'outputValueDetailList.' + index + '.outputStepAmount'"
                                      :rules="addOutputValueFormRules.outputValueDetailList.outputStepAmount">
                            <el-input type="number" v-model.number="outputValueDetail.outputStepAmount"
                                      auto-complete="off">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addOutputValueFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editOutputValueFormSubmit('editOutputValueForm')">提交
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
  export default {
    name: 'outputValueManage',
    data() {
      let moneyValidator = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('金额不能小于0'))
          return;
        }
        if (!new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$').test(value)) {
          callback(new Error('小数点后至多2位'))
          return;
        }
        callback()
      };

      let outputTimeValidator = (rule, value, callback) => {
        console.info(value);
        if (!new RegExp('^[0-9]*[1-9][0-9]*$').test(value)) {
          callback(new Error('必须为正整数'));
          return;
        }

        callback();
      };

      return {
        total: 0,
        sumName: '汇总',

        outputTimeList: [],

        subContractorList: [],
        outputValue: null,
        outputValueSearchReq: {
          outputTime: null,
        },
        addOutputValueFormVisible: false,
        addOutputValueForm: {
          outputTime: 1,
          outputValueDetailList: [
            {
              outputCategoryAmount: 0,
              outputStepAmount: 0,
              subContractorId: null,
              subContractorName: null
            }
          ]
        },

        editOutputValueFormVisible: false,
        editOutputValueForm: {
          outputValueId: null,
          outputTime: null,
          outputValueDetailList: [
            {
              outputCategoryAmount: 0,
              outputStepAmount: 0,
              subContractorId: null,
              subContractorName: null
            }
          ]
        },

        addOutputValueFormRules: {
          outputTime: [
            {required: true, message: '请填写期数', trigger: 'change'},
            {validator: outputTimeValidator, trigger: 'change'}
          ],
          outputValueDetailList: {
            outputCategoryAmount: [
              {required: true, message: '请填写产值', trigger: 'change'},
              {validator: moneyValidator, trigger: 'change'}
            ],
            outputStepAmount: [
              {required: true, message: '请填写分部分项', trigger: 'change'},
              {validator: moneyValidator, trigger: 'change'}
            ],
          }
        }
      }
    },
    created() {
      this.getSubContractorList();
      this.getOutputValueList();
      this.getOutputTimeList();
    },
    methods: {
      getOutputTimeList() {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/output/getOutputTimeList'
        }).then(response => {
          this.outputTimeList = response.result;
        });
      },

      getSubContractorList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/subContractor/listAll'
        }).then(response => {
          this.subContractorList = response.result;
          this.subContractorList.forEach(subContractor => {
            this.addOutputValueForm.outputValueDetailList.push({
              outputCategoryAmount: 0,
              outputStepAmount: 0,
              subContractorId: subContractor.subContractorId,
              subContractorName: subContractor.subContractorName
            });
          })
        })
      },

      getOutputValueList: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/output/getByOutputTime',
          data: this.outputValueSearchReq
        }).then(response => {
          this.outputValue = response.result;
          if (this.outputValueSearchReq.outputTime) {
            this.sumName = '第' + this.outputValueSearchReq.outputTime + '期';
          } else {
            this.sumName = '汇总';
          }
        })
      },

      handleAdd: function () {
        this.addOutputValueFormVisible = true;
        this.addOutputValueForm.outputTime = null;
        this.addOutputValueForm.outputValueDetailList = [];
        this.subContractorList.forEach(subContractor => {
          this.addOutputValueForm.outputValueDetailList.push({
            subContractorName: subContractor.subContractorName,
            subContractorId: subContractor.subContractorId
          })
        })
      },

      handleEdit: function () {
        this.editOutputValueFormVisible = true;

        console.info(this.outputValue);
        this.doRequest({
          method: 'post',
          url: this.HOST + '/output/getById',
          data: {
            'outputValueId': this.outputValue.outputValueId
          }
        }).then(response => {
          this.editOutputValueForm.outputValueId = response.result.outputValueId;
          this.editOutputValueForm.outputTime = response.result.outputTime;
          this.editOutputValueForm.outputValueDetailList = [];
          response.result.outputValueDetailList.forEach(item => {
            this.editOutputValueForm.outputValueDetailList.push({
              subContractorId: item.subContractorId,
              subContractorName: item.subContractorName,
              outputCategoryAmount: item.outputCategoryAmount,
              outputStepAmount: item.outputStepAmount,
            });
          });
        });
      },

      handleDel: function () {
        if (!confirm('确认删除?')) {
          return
        }

        this.doRequest({
          method: 'post',
          url: this.HOST + '/output/delete',
          data: {
            outputValueId: this.outputValue.outputValueId
          }
        }).then(response => {
          alert('删除成功');
          this.getOutputTimeList();
          this.getOutputValueList();
          this.outputValueSearchReq.outputTime = null;
        })
      },

      addOutputValueFormSubmit: function (addOutputValueForm) {
        this.$refs[addOutputValueForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/output/add',
              data: this.addOutputValueForm
            }).then(response => {
              this.getOutputTimeList();
              this.getOutputValueList();
              this.addOutputValueFormVisible = false;
              this.$refs['addOutputValueForm'].clearValidate();
              alert('添加成功');
            });
          }
        })
      },

      editOutputValueFormSubmit: function (editoutputValueForm) {
        this.$refs[editoutputValueForm].validate(valid => {
          if (valid) {
            this.doRequest({
              method: 'post',
              url: this.HOST + '/output/edit',
              data: this.editOutputValueForm
            }).then(response => {
              this.getOutputValueList();
              this.getOutputTimeList();
              this.editOutputValueFormVisible = false;
              alert('修改成功')
            })
          }
        })
      }
    }
  }
</script>
