<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示栏 -->
    <el-alert
      class="alert"
      title="添加商品信息"
      type="info"
      center
      show-icon>
    </el-alert>
    <!-- 步骤条 -->
    <el-steps
      space="200px"
      :active="active"
      align-center
      finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab切换 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs
        @tab-click="handleClick"
        tab-position="left"
        style="margin-top: 20px">
        <el-tab-pane label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- :options="options" 绑定要展示的数据源-->
            <!-- :prop="defaultProps" 选中要展示的属性-->
            <!-- v-model="selectedOptions" -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              :props="defaultProps"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form-item
            v-for="items in paramsList"
            :key="items.attr_id"
            :label="items.attr_name">
            <!-- {{ items.params }} -->
            <!-- :checked="checked" 如果加上这个属性 则输出值为布尔类型 -->
            <el-checkbox-group v-model="items.params">
              <el-checkbox
                v-for="param in items.params"
                :key="param"
                :label="param"
                border
                size="medium">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form-item
            v-for="items in attrsList"
            :key="items.attr_id"
            :label="items.attr_name">
            <el-input v-model="items.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <!--
            headers: 设置上传的请求头部
            action  上传的地址，此处必须写上全部路径
           -->
          <el-upload
            :headers="headers"
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <el-button @click="handleAddGoods" type="primary">添加商品</el-button>
          <quill-editor v-model="form.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
// 引入富文本
import { quillEditor } from 'vue-quill-editor';

export default {
  // 注册局部组件
  components: {
    quillEditor
  },
  data() {
    return {
      active: 0,
      // 表单绑定数据
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 级联菜单绑定的数据源
      options: [],
      // 级联菜单双向绑定的数组
      selectedOptions: [],
      defaultProps: {
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项的名称为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      checked: true,
      // 所选分类动态参数展示绑定数据
      paramsList: [],
      // 所选分类静态属性展示绑定数据
      attrsList: [],
      // 绑定上传组件
      headers: {
        'Authorization': sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.loadGoodsData();
  },
  methods: {
    // 加载多级菜单数据
    async loadGoodsData() {
      const response = await this.$http.get('categories?type=3');
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.options = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // 获取商品参数
    async loadGoodsParams(index) {
      // 判断现在是哪个界面
      const sel = index === '1' ? 'many' : 'only';
      // 发送请求
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 如果为many 则获取动态参数
        if (sel === 'many') {
          this.paramsList = response.data.data;
          // 给paramsList中添加新的属性 存储参数数组分割后的结果
          this.paramsList.map((items) => {
            // console.log(items);
            const paramsArr = items.attr_vals.length === 0 ? [] : items.attr_vals.split(',');
            // $set方法: 将分割好的数组赋给items.params
            this.$set(items, 'params', paramsArr);
            // console.log(items.params);
          });
        } else if (sel === 'only') {
          // 如果为only 则获取静态参数
          this.attrsList = response.data.data;
        }
      } else {
        this.$message.error(msg);
      }
    },
    // tab栏点击切换步骤条效果
    handleClick(tab, event) {
      // console.log(tab);
      // 将tab中的index属性赋给active 从字符串转化为数值类型
      this.active = tab.index - 0;
      // 判断当前点击的是否为商品参数或者商品属性页面
      if (tab.index === '1' || tab.index === '2') {
        // 判断是否选择分类
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请选择3级分类');
        } else {
          this.loadGoodsParams(tab.index);
        }
      }
    },
    // 多级下拉选中项变化的时候执行
    handleChange(value) {
      // console.log(value);
      if (value.length !== 3) {
        this.$message.warning('请选择3级分类');
        // 清空级联下拉中的内容
        this.selectedOptions.length = 0;
      }
      // console.log(this.selectedOptions);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      // console.log(this.headers);
      // console.log(response);
      // console.log(file);
      // console.log(fileList);
      // 图片上传成功，在pics中记录当前图片的临时路径
      if (response.meta.status === 200) {
        this.form.pics.push({
          pic: response.data.tmp_path
        });
      } else {
        this.$message.error('图片上传失败');
      }
    },
    // 添加商品函数
    async handleAddGoods() {
      // console.log(this.form);
      // goods_cat attrs 需处理
      this.form.goods_cat = this.selectedOptions.join(',');
      // 基于动态参数列表生成新数组
      // 形式为 [{'attr_id': value,'attr_value':value},{key,value}]
      // attr_id: 数值
      // attr_value: 字符串
      const arrParams = this.paramsList.map((items) => {
        return { 'attr_id': items.attr_id, 'attr_value': items.params.join(',') };
      });
      // console.log(arrParams);
      const arrAttrs = this.attrsList.map((items) => {
        return { 'attr_id': items.attr_id, 'attr_value': items.attr_vals };
      });
      this.form.attrs = arrParams.concat(arrAttrs);
      // console.log(this.form.attrs);
      // console.log(this.form);
      const response = await this.$http.post('goods', this.form);
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 201) {
        // this.options = response.data.data;
        this.$message.success(msg);
        this.$router.push('/goods');
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .alert {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-step__title {
    font-size: 12px;
  }
  .el-checkbox.is-bordered.el-checkbox--medium {
    margin: 10px;
  }
  .quill-editor {
    margin-top: 10px;
    height: 400px;
  }
</style>
