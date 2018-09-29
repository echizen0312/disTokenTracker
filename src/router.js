import Vue from 'vue'
import Router from 'vue-router'
import Tracker from './components/Tracker.vue'
import Block from './components/Block.vue'
import Transaction from './components/Transaction.vue'
import Account from './components/Account.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Tracker',
            component: Tracker
        },
        {
            path: '/Tracker',
            name: 'Tracker',
            component: Tracker
        },
        {
            path: '/Block/:block_num',
            name: 'Block',
            component: Block
        },
        {
            path: '/Transaction/:trx_id',
            name: 'Transaction',
            component: Transaction
        },
        {
            path: '/Account/:account_name',
            name: 'Account',
            component: Account
        }
    ]
})
