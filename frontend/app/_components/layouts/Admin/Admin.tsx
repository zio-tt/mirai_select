import { Admin, Resource, DataProvider } from 'react-admin';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { UserList } from './Lists/UserList';
import { CharacterList } from './Lists/CharacterList';
import { ConversationList } from './Lists/ConversationList';
import { DecisionList } from './Lists/DecisionList';
import { BookmarkList } from './Lists/BookmarkList';
import { CommentList } from './Lists/CommentList';
import { TagList } from './Lists/TagList';
import { useSession } from 'next-auth/react';

const encryptToken = (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  // 文字列をWordArrayに変換
  const key = CryptoJS.enc.Utf8.parse(secretKey!);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(token), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

const App = () => {
  const { data: session } = useSession();
  const token = process.env.NEXT_PUBLIC_ENCRYPTION_TOKEN;
  const encryptedToken = encryptToken(token!); 

  const dataProvider: DataProvider = {
    getList: async (resource, params) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${encryptedToken}`, // トークンを適切に設定
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true,
        });

        return {
          data: response.data,
          total: response.data.length,
        };
      } catch (error) {
        console.error(error);
        throw new Error('データの取得に失敗しました');
      }
    },

    getOne: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      });
      return {
        data: response.data
      };
    },
  
    update: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`;
      const response = await axios.put(url, { [resource]: params.data }, {
        headers: {
          'Authorization': `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      });
      return {
        data: response.data
      };
    },
  
    deleteMany: async (resource, params) => {
      await Promise.all(
        params.ids.map(id => axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${id}`, {
          headers: {
            'Authorization': `Bearer ${encryptedToken}`,
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true,
        }))
      );
    
      // 削除されたIDの配列を返す
      return { data: params.ids };
    },
    // 他のメソッドのダミー実装
    getMany: () => Promise.reject(),
    getManyReference: () => Promise.reject(),
    updateMany: () => Promise.reject(),
    create: () => Promise.reject(),
    delete: () => Promise.reject(),
  };

  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={UserList} />
      <Resource name="characters" list={CharacterList} />
      <Resource name="conversations" list={ConversationList} />
      <Resource name="decisions" list={DecisionList} />
      <Resource name="bookmarks" list={BookmarkList} />
      <Resource name="comments" list={CommentList} />
      <Resource name="tags" list={TagList} />
    </Admin>
  );
}

export default App;
