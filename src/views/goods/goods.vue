<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="search">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button
          @click="$router.push('/goods/add')"
          class="btn"
          type="success"
          plain>
          添加商品
        </el-button>
      </el-col>
    </el-row>
    <el-table
      border
      stripe
      :data="goodsData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="380">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="120">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180">
        <template slot-scope="scope">
           {{ scope.row.upd_time | fmtDate('YYYY - MM - DD')}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit">
          </el-button>
          <el-button
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      searchValue: '',
      // 当前页码
      pagenum: 1,
      // 每页数据数目
      pagesize: 6,
      // 数据总条数
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      // console.log(response);
      this.goodsData = response.data.data.goods;
      this.total = response.data.data.total;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    }
  }
};
</script>

<style>
  .search {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
