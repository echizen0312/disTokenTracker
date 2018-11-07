<template>
    <div class="main">
        <ol class="breadcrumb" style="text-align: left; margin: 16px 15px 0 15px;">
            <li><a href="javascript:void(0);" @click="GoHome">首页</a></li>
            <li class="active">区块信息</li>
        </ol>
        <div class="row" style="margin: 16px 0px 0 0px;" v-if="block != null">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: left;">区块 # {{ block_num }}</div>
                    <div class="panel-body" style="text-align: left;">
                        <div class="flex">
                            <div class="head">区块ID</div>
                            <div class="text">{{ block.block_id }}</div>
                        </div>
                        <!--<div class="flex">-->
                        <!--<div class="head">区块高度</div>-->
                        <!--<div class="text">{{ block.block_num }}</div>-->
                        <!--</div>-->
                        <div class="flex">
                            <div class="head">出块时间</div>
                            <div class="text">{{ GetMoment(block.createdAt) }}</div>
                        </div>
                        <div class="flex">
                            <div class="head">出块节点</div>
                            <div class="text">{{ block.block.producer }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin: 8px 0px 0 0px;" v-if="block != null">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: left;">交易（{{block.block.transactions.length}}）</div>
                    <div class="panel-body" style="text-align: center; padding: 12px;">
                        <div class="hidden-xs hidden-sm" v-if="block.block.transactions.length > 0">
                            <div class="row" style="font-weight: bold;">
                                <div class="col-md-7 text" style="text-align: left;">trx_id</div>
                                <div class="col-md-2" style="text-align: left;">actions</div>
                                <div class="col-md-3" style="text-align: left;">时间</div>
                            </div>
                            <div class="split">&nbsp;</div>
                        </div>
                        <div v-for="(transaction, index) in block.block.transactions" :key="index">
                            <div class="row">
                                <div class="col-md-7 text" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        trx_id:
                                    </div>
                                    <a href="javascript:void(0);" @click="GoTransaction(transaction.trx.id)">
                                        {{ transaction.trx.id }}
                                    </a>
                                </div>
                                <div class="col-md-2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        actions:
                                    </div>
                                    {{ transaction.trx.transaction.actions.length }}
                                </div>
                                <div class="col-md-3" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        时间:
                                    </div>
                                    {{ GetMoment(transaction.trx.transaction.expiration) }}
                                </div>
                            </div>
                            <div class="split">&nbsp;</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console,no-undef */

    import * as moment from 'moment'

    export default {
        name: 'Block',
        data() {
            return {
                host: host,
                block_num: 0,
                block: null
            }
        },
        created: function () {
            this.block_num = this.$route.params.block_num
            this.GetInfo()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': function () {
                this.block_num = this.$route.params.block_num
                this.GetInfo()
            }
        },
        methods: {
            GetMoment: function (date) {
                return moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss')
            },
            GetInfo: function () {
                let self = this
                this.$http.get(`${host}/eosSak/db/GetBlock?block_num=${self.block_num}`, {}).then(res => {
                    let data = res.data
                    if (data.result.length == 1) {
                        self.block = data.result[0]
                    } else {
                        self.block = null
                    }
                }, res => {
                    console.log(res)
                })
            },
            GoTransaction: function (trx_id) {
                this.$router.push({path: `/Transaction/${trx_id}`})
            },
            GoHome: function () {
                this.$router.push({path: `/`})
            }
        }
    }
</script>

<style scoped>
    .flex {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-height: 32px;
    }

    .flex .head {
        width: 80px;
    }

    .flex .text {
        flex: 1;
    }

    .split {
        background-color: #E4E7ED;
        height: 1px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
