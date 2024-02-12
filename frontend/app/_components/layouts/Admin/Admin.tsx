/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { Admin, Resource, DataProvider, EditGuesser } from 'react-admin'

import { BookmarkList } from './Lists/BookmarkList'
import { CharacterList } from './Lists/CharacterList'
import { CommentList } from './Lists/CommentList'
import { ConversationList } from './Lists/ConversationList'
import { DecisionList } from './Lists/DecisionList'
import { TagList } from './Lists/TagList'
import { UserList } from './Lists/UserList'

const encryptToken = (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
  // 文字列をWordArrayに変換
  const key = CryptoJS.enc.Utf8.parse(secretKey!)
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(token), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

const App = () => {
  const token = process.env.NEXT_PUBLIC_ENCRYPTION_TOKEN
  const encryptedToken = encryptToken(token!)

  const dataProvider: DataProvider = {
    getList: async (resource) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}`
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${encryptedToken}`, // トークンを適切に設定
            'X-Requested-With': 'XMLHttpRequest',
          },
          withCredentials: true,
        })

        return {
          data: response.data,
          total: response.data.length,
        }
      } catch (error) {
        console.error(error)
        throw new Error('データの取得に失敗しました')
      }
    },

    getOne: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
      return {
        data: response.data,
      }
    },

    getMany: async (resource) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
      return {
        data: response.data,
      }
    },

    getManyReference: async (resource) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
      return {
        data: response.data,
      }
    },

    update: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`
      const response = await axios.put(
        url,
        { [resource]: params.data },
        {
          headers: {
            Authorization: `Bearer ${encryptedToken}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
          withCredentials: true,
        },
      )
      return {
        data: response.data,
      }
    },

    updateMany: async (resource, params) => {
      await Promise.all(
        params.ids.map((id) =>
          axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${id}`, {
            headers: {
              Authorization: `Bearer ${encryptedToken}`,
              'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
          }),
        ),
      )
      return { data: params.ids }
    },

    create: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}`
      const response = await axios.post(
        url,
        { [resource]: params.data },
        {
          headers: {
            Authorization: `Bearer ${encryptedToken}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
          withCredentials: true,
        },
      )
      return {
        data: response.data,
      }
    },

    delete: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
      return {
        data: response.data,
      }
    },

    deleteMany: async (resource, params) => {
      await Promise.all(
        params.ids.map((id) =>
          axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${id}`, {
            headers: {
              Authorization: `Bearer ${encryptedToken}`,
              'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
          }),
        ),
      )
      // 削除されたIDの配列を返す
      return { data: params.ids }
    },
  }

  return (
    <Admin dataProvider={dataProvider}>
      <Resource name='users' list={UserList} />
      <Resource name='characters' list={CharacterList} edit={EditGuesser} />
      <Resource name='conversations' list={ConversationList} />
      <Resource name='decisions' list={DecisionList} />
      <Resource name='bookmarks' list={BookmarkList} />
      <Resource name='comments' list={CommentList} />
      <Resource name='tags' list={TagList} />
    </Admin>
  )
}

export default App
