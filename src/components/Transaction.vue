<template>
    <div class="main">
        <ol class="breadcrumb" style="text-align: left; margin: 16px 15px 0 15px;">
            <li><a href="javascript:void(0);" @click="GoHome">首页</a></li>
            <li class="active">交易信息</li>
        </ol>
        <div class="row" style="margin: 16px 0px 0 0px;" v-if="transaction != null">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading text" style="text-align: left;">交易 # {{ trx_id }}</div>
                    <div class="panel-body" style="text-align: left;">
                        <div class="flex">
                            <div class="head">交易状态</div>
                            <div class="text">{{ transaction.irreversible ? '已确认' : '未确认' }}</div>
                        </div>
                        <div class="flex">
                            <div class="head">区块</div>
                            <div class="text"><a href="javascript:void(0);" @click="GoBlock(transaction.block_num)">{{
                                transaction.block_num }}</a></div>
                        </div>
                        <div class="flex">
                            <div class="head">创建时间</div>
                            <div class="text">{{ GetMoment(transaction.createdAt) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin: 8px 0px 0 0px;" v-if="transaction != null">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: left;">actions（{{transaction.actions.length}}）</div>
                    <div class="panel-body" style="text-align: center; padding: 12px;">
                        <div class="hidden-xs hidden-sm" v-if="transaction.actions.length > 0">
                            <div class="row" style="font-weight: bold;">
                                <div class="col-md-2" style="text-align: left;">合约</div>
                                <div class="col-md-2" style="text-align: left;">接口</div>
                                <div class="col-md-8" style="text-align: left;">数据</div>
                            </div>
                            <div class="split">&nbsp;</div>
                        </div>
                        <div v-for="(transaction, index) in transaction.actions" :key="index">
                            <div class="row">
                                <div class="col-md-2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        合约:
                                    </div>
                                    {{ transaction.account }}
                                </div>
                                <div class="col-md-2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        接口:
                                    </div>
                                    {{ transaction.name }}
                                </div>
                                <div class="col-md-8 text2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        数据:
                                    </div>
                                    <div v-if="transaction.name == 'transfer' || transaction.name == 'issue'">
                                        <a href="javascript:void(0);" @click="GoAccount(GetFrom(transaction))">{{
                                            GetFrom(transaction)
                                            }}</a>
                                        <span style="padding-left: 20px; padding-right: 20px;">{{ transaction.name == 'transfer' ? '转给' : '发行'}}</span>
                                        <a href="javascript:void(0);" @click="GoAccount(transaction.data.to)">{{
                                            transaction.data.to
                                            }}</a>
                                        <span style="padding-left: 20px; padding-right: 20px;">{{ transaction.data.quantity }}</span>
                                        <br><br>
                                        <span style="padding-left: 0; padding-right: 0;">备注：</span>
                                        <span style="padding-left: 20px; padding-right: 20px;">{{ transaction.data.memo }}</span>
                                    </div>
                                    <span v-else>{{ transaction.data }}</span>
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
        name: 'Transaction',
        data() {
            return {
                host: host,
                trx_id: 0,
                transaction: null
            }
        },
        created: function () {
            this.trx_id = this.$route.params.trx_id
            this.GetInfo()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': function () {
                this.trx_id = this.$route.params.trx_id
                this.GetInfo()
            }
        },
        methods: {
            GetMoment: function (date) {
                return moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss')
            },
            GetFrom: function (row) {
                if (row.name == 'issue') {
                    return row.account
                } else {
                    return row.data.from
                }
            },
            GetInfo: function () {
                let self = this
                this.$http.get(`${host}/eosSak/db/GetTransaction?trx_id=${self.trx_id}`, {}).then(res => {
                    let data = res.data
                    if (data.result.length == 1) {
                        self.transaction = data.result[0]
                    } else {
                        self.transaction = null
                    }
                }, res => {
                    console.log(res)
                })
            },
            GoAccount: function (account) {
                this.$router.push({path: `/Account/${account}`})
            },
            GoBlock: function (block_num) {
                this.$router.push({path: `/Block/${block_num}`})
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

    .text2 {
        word-wrap: break-word;
    }
</style>
