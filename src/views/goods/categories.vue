<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button
      @click="handleOpenAddDialog"
      class="btn"
      type="success"
      plain>
      添加分类
    </el-button>
    <!-- 分类列表 -->
    <el-table
      border
      stripe
      :data="categoriesData"
      style="width: 100%">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="380"
        treeKey="cat_id"
        childKey="children"
        parentKey="cat_pid"
        levelKey="cat_level"></el-table-tree-column>
      <el-table-column
        label="级别"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效"
        width="150">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleOpenEditCate(scope.row)"
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit">
          </el-button>
          <el-button
            @click="handleDeleteCate(scope.row)"
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="openAddCateDialog">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类列表">
          <!--
            expand-trigger="hover"  鼠标悬停的时候触发
            options 绑定的数据(展示)
            v-model 双向绑定(输入)
            change-on-select  运行用户选择任意一级选项
            props 设置下拉框中显示数据源中的哪个属性的值
           -->
          <el-cascader
            placeholder="默认添加一级分类"
            clearable
            change-on-select
            expand-trigger="hover"
            :options="options"
            :props="defaultProps"
            v-model="catId">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openAddCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="openEditCateDialog">
      <el-form label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="catename" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openEditCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditCate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入element-tree-grid
import ElementTreegrid from 'element-tree-grid';
export default {
  // 局部组件
  components: {
    'el-table-tree-column': ElementTreegrid
  },
  data() {
    return {
      // 商品类别数据
      categoriesData: [],
      // 当前页码
      pagenum: 1,
      // 每页数据数目
      pagesize: 6,
      // 数据总条数
      total: 0,
      // 打开添加数据对话框
      openAddCateDialog: false,
      openEditCateDialog: false,
      // 添加输入框中绑定的数据
      form: {},
      // 添加级联菜单中展示的绑定数据
      options: [],
      // 添加中选择双向绑定的数据
      catId: [],
      // 显示数据源中的哪个属性的值
      defaultProps: {
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项的名称为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 双向绑定编辑分类输入框中的分类名称数据
      catename: '',
      // 编辑分类时当前分类的id
      cateId: -1,
      // 当前分类的数据对象
      currenCate: null,
      loading: true
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const response = await this.$http.get(`categories?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      // console.log(response);
      this.loading = false;
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 获取分类总数
        this.total = response.data.data.total;
        // 获取分类列表
        this.categoriesData = response.data.data.result;
      } else {
        this.$message.error(msg);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    async handleOpenAddDialog() {
      this.openAddCateDialog = true;
      const response = await this.$http.get('categories?type=2');
      this.options = response.data.data;
    },
    async handleAddCate() {
      // console.log(this.catId);
      // cat_level  级别
      // 一级分类  0
      // 二级分类  1
      // 三级分类  2
      // cat_pid  添加的分类的，父节点的id
      // 父id   当是一级分类   0
      // 父id   当是二级分类
      // this.catIds 绑定的多级选择器的值，是一个数组
      // this.catIds.length === 0  要添加的分类是一级分类
      // this.catIds.length === 1  要添加的分类是二级分类
      // this.catIds.length === 2  要添加的分类是三级分类
      // 设置级别
      this.form.cat_level = this.catId.length;
      // 设置父id
      if (this.catId.length === 0) {
        this.form.cat_pid = 0;
      } else if (this.catId.length === 1) {
        this.form.cat_pid = this.catId[0];
      } else if (this.catId.length === 2) {
        this.form.cat_pid = this.catId[1];
      }
      // console.log(this.form);
      this.openAddCateDialog = false;
      // 发送请求
      const response = await this.$http.post('categories', this.form);
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 201) {
        // this.rolesData = response.data.data;
        this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    handleDeleteCate(cate) {
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$http.delete(`categories/${cate.cat_id}`);
        console.log(response);
        const { meta: { status, msg } } = response.data;
        if (status === 200) {
          this.loadData();
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async handleOpenEditCate(cate) {
      this.openEditCateDialog = true;
      const response = await this.$http.get(`categories/${cate.cat_id}`);
      // 记录当前点击分类的id
      this.cateId = cate.cat_id;
      // 根据当前id查询到分类名称
      this.catename = response.data.data.cat_name;
      // console.log(this.catename);
      // 存储当前分类的对象数据
      this.currenCate = cate;
    },
    async handleEditCate(cate) {
      this.openEditCateDialog = false;
      const response = await this.$http.put(`categories/${this.cateId}`, {
        cat_name: this.catename
      });
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.currenCate.cat_name = response.data.data.cat_name;
        // this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .btn {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
