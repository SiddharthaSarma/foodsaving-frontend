import { storiesOf } from '@storybook/vue'
import { storesMock as stores } from '>/mockdata'

import StoreList from './StoreList.vue'
import StoreEdit from './StoreEdit.vue'
import i18n from '@/i18n'
import router from '@/router'

const store = stores[0]
const otherStores = stores.slice(1)

storiesOf('Stores', module)
  .add('StoreList', () => ({
    render: h => h(StoreList, { props: { stores } }),
    i18n,
    router,
  }))

  .add('StoreEdit', () => ({
    render: h => h(StoreEdit, {
      props: {
        store,
        allStores: otherStores,
        status: {},
      },
    }),
    i18n,
    router,
  }))

  .add('StoreEdit (with server error)', () => ({
    render: h => h(StoreEdit, {
      props: {
        store,
        allStores: otherStores,
        status: {
          error: {
            validationErrors: { name: ['a nice server error', 'and another one'] },
          },
        },
      },
    }),
    i18n,
    router,
  }))
