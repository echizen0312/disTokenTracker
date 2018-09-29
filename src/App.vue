<template>
    <div id="app" style="margin: 10px auto; max-width: 1024px;">
        <div class="row" style="padding-bottom: 12px; margin: 0;" @keyup.enter="GoSearch">
            <div class="col-sm-6">
                <div style="font-weight: bold; font-size: 30px; cursor: pointer; text-align: left;" @click="GoHome">
                    disTokenTracker
                </div>
            </div>
            <div class="col-sm-6">
                <div style="height: 42px; display: flex; align-items: center;">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="区块 / 交易 / 账户" v-model="keyword">
                        <span class="input-group-btn">
                        <button class="btn btn-default" type="button" @click="GoSearch">查询</button>
                    </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="border-bottom: 1px solid #DCDFE6; margin: 0 15px 0 15px;"></div>
        <div class="tracker-main">
            <router-view/>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-undef */

    export default {
        name: 'App',
        data() {
            return {
                host: host,
                keyword: ''
            }
        },
        created: function () {

        },
        methods: {
            GoSearch: function () {
                let self = this
                let kw = self.keyword
                if (!isNaN(kw)) {
                    self.GoBlock(kw)
                    self.keyword = ''
                } else if (kw.length == 64) {
                    self.GoTransaction(kw)
                    self.keyword = ''
                } else {
                    self.GoAccount(kw)
                    self.keyword = ''
                }
            },
            GoHome: function () {
                this.$router.push({path: `/`})
            },
            GoBlock: function (block_num) {
                this.$router.push({path: `/Block/${block_num}`})
            },
            GoTransaction: function (trx_id) {
                this.$router.push({path: `/Transaction/${trx_id}`})
            },
            GoAccount: function (account) {
                this.$router.push({path: `/Account/${account}`})
            }
        }
    }
</script>

<style>
    body {
        margin: 0 8px;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 0px;
    }
</style>
