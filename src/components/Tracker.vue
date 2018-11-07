<template>
    <div class="main">
        <div class="hidden-xs hidden-sm" style="text-align: center; margin-top: 16px; font-size: 16px;">
            <span>链ID：</span>
            <span>{{eosInfo.cid}}</span>
        </div>
        <div class="row" style="margin: 16px 0px 0 0px;">
            <div class="col-xs-6 col-sm-3">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: center;">区块高度</div>
                    <div class="panel-body" style="text-align: center;">{{eosInfo.blc}}</div>
                </div>
            </div>
            <div class="col-xs-6 col-sm-3">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: center;">不可逆区块</div>
                    <div class="panel-body" style="text-align: center;">{{eosInfo.libn}}</div>
                </div>
            </div>
            <div class="col-xs-6 col-sm-3">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: center;">交易数量</div>
                    <div class="panel-body" style="text-align: center;">{{eosInfo.tra}}</div>
                </div>
            </div>
            <div class="col-xs-6 col-sm-3">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: center;">账户数量</div>
                    <div class="panel-body" style="text-align: center;">{{eosInfo.acc}}</div>
                </div>
            </div>
        </div>
        <div class="row" style="margin: 8px 0px 0 0px;">
            <div class="col-md-6">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: center;">最新区块</div>
                    <div class="panel-body" style="text-align: center; padding: 12px;">
                        <table class="table table-striped" style="width: 100%; table-layout: fixed; margin-bottom: 0;">
                            <thead>
                            <tr>
                                <td style="text-align: center;">#</td>
                                <td style="text-align: center; width: 100px;" class="hidden-xs hidden-sm">生产者</td>
                                <td style="text-align: center; width: 70px;">交易</td>
                                <td style="text-align: center; width: 160px;">时间</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(block, index) in newBlocks" :key="index">
                                <td class="text">
                                    <a href="javascript:void(0);" @click="GoBlock(block.block_num)">
                                        {{ block.block_num }}
                                    </a>
                                </td>
                                <td class="hidden-xs hidden-sm">{{ block.producer }}</td>
                                <td>{{ block.transactions }}</td>
                                <td>{{ GetMoment(block.createdAt) }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="panel panel-default">
                    <div class="panel-heading" style="text-align: center;">最新交易{{ newTransactions.length == 0 ? ' - 查询中' : '' }}</div>
                    <div class="panel-body" style="text-align: center; padding: 12px;">
                        <table class="table table-striped" style="width: 100%; table-layout: fixed; margin-bottom: 0;">
                            <thead v-if="newTransactions.length > 0">
                            <tr>
                                <td style="text-align: center;">#</td>
                                <td style="text-align: center; width: 70px;">actions</td>
                                <td style="text-align: center; width: 160px;">时间</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(transaction, index) in newTransactions" :key="index">
                                <td class="text">
                                    <a href="javascript:void(0);" @click="GoTransaction(transaction.trx_id)">
                                        {{ transaction.trx_id }}
                                    </a>
                                </td>
                                <td>{{ transaction.actions }}</td>
                                <td>{{ GetMoment(transaction.createdAt) }}</td>
                            </tr>
                            </tbody>
                        </table>
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
        name: 'Tracker',
        data() {
            return {
                host: host,
                loading: false,
                eosInfo: {
                    acc: 0,
                    blc: 0,
                    cid: '',
                    libn: 0,
                    tra: 0
                },
                newBlocks: [],
                newTransactions: []
            }
        },
        created: function () {
            this.GetInfo()
        },
        methods: {
            GetMoment: function (date) {
                return moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss')
            },
            GetInfo: function () {
                let self = this
                this.$http.get(`${host}/eosSak/db/GetChainInfo`, {}).then(response => {
                    let data = response.data
                    self.eosInfo.acc = data.result.acc
                    self.eosInfo.blc = data.result.blc
                    self.eosInfo.cid = data.result.cid
                    self.eosInfo.libn = data.result.libn
                    self.eosInfo.tra = data.result.tra
                }, response => {
                    console.log(response)
                })
                this.$http.get(`${host}/eosSak/db/GetNewBlocks`, {}).then(res => {
                    let data = res.data
                    self.newBlocks = data.result
                }, res => {
                    console.log(res)
                })
                this.$http.get(`${host}/eosSak/db/GetNewTransactionsNew`, {}).then(res => {
                    let data = res.data
                    self.newTransactions = data.result
                }, res => {
                    console.log(res)
                })
            },
            GoBlock: function (block_num) {
                this.$router.push({path: `/Block/${block_num}`})
            },
            GoTransaction: function (trx_id) {
                this.$router.push({path: `/Transaction/${trx_id}`})
            }
        }
    }
</script>

<style scoped>
    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
