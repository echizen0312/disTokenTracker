<template>
    <div class="main">
        <ol class="breadcrumb" style="text-align: left; margin: 16px 15px 0 15px;">
            <li><a href="javascript:void(0);" @click="GoHome">首页</a></li>
            <li class="active">账户信息</li>
        </ol>
        <div class="row" style="margin: 16px 0px 0 0px;" v-if="account == null">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: left;">账户：{{ account_name }}</div>
                    <div class="panel-body" style="text-align: left;">
                        没有找到这个账户的信息
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin: 16px 0px 0 0px;" v-if="account != null">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: left;">账户：{{ account_name }}</div>
                    <div class="panel-body" style="text-align: left;">
                        <div class="flex">
                            <div class="head">创建时间</div>
                            <div class="content">{{ GetMoment(account.created) }}</div>
                            <div class="text">&nbsp;</div>
                        </div>
                        <div class="flex">
                            <div class="head">TOK余额</div>
                            <div class="content">{{ account.core_liquid_balance }}</div>
                            <div class="text">&nbsp;</div>
                        </div>
                        <div class="flex">
                            <div class="head">RAM</div>
                            <div class="content" v-if="account.ram_quota == -1">
                                不限
                            </div>
                            <div class="content" v-else>
                                {{ getByteSize(account.ram_usage) }} / {{ getByteSize(account.ram_quota) }}
                            </div>
                            <div class="text">
                                <!--<el-progress v-if="account.ram_quota != -1"-->
                                <!--:text-inside="true" :stroke-width="18"-->
                                <!--:percentage="Number.parseFloat((account.ram_usage / account.ram_quota * 100).toFixed(2))"></el-progress>-->
                                {{ Number.parseFloat((account.ram_usage / account.ram_quota * 100).toFixed(2)) }} %
                            </div>
                        </div>
                        <div class="flex">
                            <div class="head">CPU</div>
                            <div class="content" v-if="account.cpu_limit.max == -1">
                                不限
                            </div>
                            <div class="content" v-else>
                                {{ getTimeSize(account.cpu_limit.used) }} / {{ getTimeSize(account.cpu_limit.max) }}
                            </div>
                            <div class="text">
                                <!--<el-progress v-if="account.cpu_limit.max != -1"-->
                                <!--:text-inside="true" :stroke-width="18"-->
                                <!--:percentage="Number.parseFloat((Number.parseInt(account.cpu_limit.used) / Number.parseInt(account.cpu_limit.max) * 100).toFixed(2))"></el-progress>-->
                                {{ Number.parseFloat((Number.parseInt(account.cpu_limit.used) /
                                Number.parseInt(account.cpu_limit.max) * 100).toFixed(2)) }} %
                            </div>
                        </div>
                        <div class="flex">
                            <div class="head">NET</div>
                            <div class="content" v-if="account.net_limit.max == -1">
                                不限
                            </div>
                            <div class="content" v-else>
                                {{ getByteSize(account.net_limit.used) }} / {{ getByteSize(account.net_limit.max) }}
                            </div>
                            <div class="text">
                                <!--<el-progress v-if="account.net_limit.max != -1"-->
                                <!--:text-inside="true" :stroke-width="18"-->
                                <!--:percentage="Number.parseFloat((Number.parseInt(account.net_limit.used) / Number.parseInt(account.net_limit.max) * 100).toFixed(2))"></el-progress>-->
                                {{ Number.parseFloat((Number.parseInt(account.net_limit.used) /
                                Number.parseInt(account.net_limit.max) * 100).toFixed(2)) }} %
                            </div>
                        </div>
                        <div class="split">&nbsp;</div>
                        <div class="flex" v-for="item in account.sss" :key="item.code + item.symbol">
                            <div class="head">{{ item.symbol }}余额</div>
                            <div class="content">{{ item.balance }}</div>
                            <div class="text">&nbsp;</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin: 8px 0px 0 0px;" v-if="actions != null">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: left;">转账（{{actions.length}}）{{ actions.length == 0 ?
                        '查询中' : '' }}
                    </div>
                    <div class="panel-body" style="text-align: center; padding: 12px;">
                        <div class="hidden-xs hidden-sm" v-if="actions.length > 0">
                            <div class="row" style="font-weight: bold;">
                                <div class="col-md-2 text" style="text-align: left;">trx_id</div>
                                <div class="col-md-2" style="text-align: left;">from</div>
                                <div class="col-md-2" style="text-align: left;">to</div>
                                <div class="col-md-2" style="text-align: left;">quantity</div>
                                <div class="col-md-4 text" style="text-align: left;">memo</div>
                            </div>
                            <div class="split">&nbsp;</div>
                        </div>
                        <div v-for="(action, index) in actions" :key="index">
                            <div class="row">
                                <div class="col-md-2 text" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        trx_id:
                                    </div>
                                    <a href="javascript:void(0);" @click="GoTransaction(action.trx_id)">
                                        {{ action.trx_id }}
                                    </a>
                                </div>
                                <div class="col-md-2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">from:
                                    </div>
                                    <a v-if="GetFrom(action) != account_name" href="javascript:void(0);"
                                       @click="GoAccount(GetFrom(action))">
                                        {{ GetFrom(action) }}
                                    </a>
                                    <span v-else>{{ GetFrom(action) }}</span>
                                </div>
                                <div class="col-md-2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">to:
                                    </div>
                                    <a v-if="action.data.to != account_name" href="javascript:void(0);"
                                       @click="GoAccount(action.data.to)">
                                        {{ action.data.to }}
                                    </a>
                                    <span v-else>{{ action.data.to }}</span>
                                </div>
                                <div class="col-md-2" style="text-align: left;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">
                                        quantity:
                                    </div>
                                    {{ action.data.quantity }}
                                </div>
                                <div class="col-md-4" style="text-align: left; word-break: break-all;">
                                    <div class="visible-xs-inline visible-sm-inline" style="font-weight: bold;">memo:
                                    </div>
                                    {{ action.data.memo }}
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
        name: 'Account',
        data() {
            return {
                host: host,
                account_name: '',
                account: null,
                actions: null
            }
        },
        created: function () {
            this.account_name = this.$route.params.account_name
            this.GetInfo()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': function () {
                this.account_name = this.$route.params.account_name
                this.account = null
                this.actions = null
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
                this.$http.get(`${host}/eosSak/db/GetAccount?account_name=${self.account_name}`, {}).then(res => {
                    let data = res.data
                    if (data.result.status != 500) {
                        self.account = data.result
                        self.actions = []
                        this.$http.get(`${host}/eosSak/db/GetAccountActions?account_name=${self.account_name}`, {}).then(res => {
                            let data = res.data
                            if (data.result.length > 0) {
                                self.actions = data.result
                            } else {
                                self.actions = []
                            }
                        }, res => {
                            console.log(res)
                        })
                    } else {
                        self.account = null
                        self.actions = null
                    }
                }, res => {
                    console.log(res)
                })
            },
            GoTransaction: function (trx_id) {
                this.$router.push({path: `/Transaction/${trx_id}`})
            },
            GoAccount: function (account) {
                this.$router.push({path: `/Account/${account}`})
            },
            GoHome: function () {
                this.$router.push({path: `/`})
            },
            getByteSize: function (net) {
                let len = 2
                let s = ''
                if (net < 1024) {
                    s = net.toFixed(len).toString() + 'B'
                } else {
                    net /= 1024
                    if (net < 1024) {
                        s = net.toFixed(len).toString() + 'KB'
                    } else {
                        net /= 1024
                        if (net < 1024) {
                            s = net.toFixed(len).toString() + 'MB'
                        } else {
                            net /= 1024
                            if (net < 1024) {
                                s = net.toFixed(len).toString() + 'GB'
                            } else {
                                net /= 1024
                                s = net.toFixed(len).toString() + 'TB'
                            }
                        }
                    }
                }
                return s
            },
            getTimeSize: function (net) {
                let len = 2
                let s = ''
                if (net < 1000) {
                    s = net.toFixed(len).toString() + 'ns'
                } else {
                    net /= 1000
                    if (net < 1000) {
                        s = net.toFixed(len).toString() + 'ms'
                    } else {
                        net /= 1000
                        if (net < 60) {
                            s = net.toFixed(len).toString() + 'sec'
                        } else {
                            net /= 60
                            if (net < 60) {
                                s = net.toFixed(len).toString() + 'min'
                            } else {
                                net /= 60
                                s = net.toFixed(len).toString() + 'hr'
                            }
                        }
                    }
                }
                return s
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

    .flex .content {
        width: 220px;
        padding-left: 24px;
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
